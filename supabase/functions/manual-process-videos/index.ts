
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// [Analysis] Using CORS headers to ensure the function can be called from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Creating a Supabase client with service role for full database access
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// [Analysis] Implementing retry mechanism with exponential backoff for API calls
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Failed with status: ${response.status}`);
  } catch (err) {
    if (retries === 0) {
      throw err;
    }
    console.log(`Retrying fetch in ${backoff}ms... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

// [Analysis] Function to fetch video details from YouTube API
async function fetchVideoDetails(videoId: string) {
  const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
  
  if (!youtubeApiKey) {
    throw new Error('YouTube API key not configured');
  }
  
  console.log(`Fetching details for video: ${videoId}`);
  
  const videoResponse = await fetchWithRetry(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`,
    { method: 'GET' }
  );
  
  if (!videoResponse?.items || videoResponse.items.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }
  
  return {
    title: videoResponse.items[0].snippet.title,
    description: videoResponse.items[0].snippet.description,
    publishedAt: videoResponse.items[0].snippet.publishedAt,
    channelTitle: videoResponse.items[0].snippet.channelTitle,
    thumbnailUrl: videoResponse.items[0].snippet.thumbnails?.high?.url || videoResponse.items[0].snippet.thumbnails?.default?.url
  };
}

// [Analysis] Function to fetch video transcript from YouTube API
async function fetchYouTubeTranscript(videoId: string) {
  try {
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured');
    }
    
    console.log(`Fetching captions for video: ${videoId}`);
    
    // First get the caption track ID
    const captionListResponse = await fetchWithRetry(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`,
      { method: 'GET' }
    );
    
    if (!captionListResponse?.items || captionListResponse.items.length === 0) {
      console.log(`No captions found for video ${videoId}`);
      return "No captions available";
    }
    
    // Prioritize English captions if available
    let captionId = captionListResponse.items[0].id;
    const englishCaption = captionListResponse.items.find((item: any) => 
      item.snippet.language === 'en' || item.snippet.language === 'en-US'
    );
    
    if (englishCaption) {
      captionId = englishCaption.id;
    }
    
    console.log(`Using caption ID: ${captionId} for video ${videoId}`);
    
    // [Analysis] YouTube API requires OAuth2 for retrieving transcript content directly
    // [Plan] As a workaround, we'll use third-party libraries in the future for fetching transcripts
    // For now, return caption metadata instead
    return `Caption track found with ID: ${captionId}. Direct transcript access requires OAuth2.`;
    
  } catch (error) {
    console.error(`Error fetching transcript for ${videoId}:`, error);
    return `Error: ${error.message}`;
  }
}

// [Analysis] Main function to process a video
async function processVideo(videoId: string) {
  console.log(`Starting processing for video: ${videoId}`);
  
  try {
    // Check if we already have a processing record for this video
    const { data: existingRecord, error: fetchError } = await supabase
      .from('ai_news_video_processing')
      .select('*')
      .eq('video_id', videoId)
      .maybeSingle();
      
    let processingRecordId;
    
    if (existingRecord) {
      // Update the existing record to reprocess
      processingRecordId = existingRecord.id;
      
      const { error: updateError } = await supabase
        .from('ai_news_video_processing')
        .update({
          status: 'processing',
          processed_at: new Date().toISOString(),
          error_message: null,
          retry_count: (existingRecord.retry_count || 0) + 1
        })
        .eq('id', processingRecordId);
        
      if (updateError) {
        throw new Error(`Error updating processing record: ${updateError.message}`);
      }
    } else {
      // Create a new processing record
      const { data: newRecord, error: insertError } = await supabase
        .from('ai_news_video_processing')
        .insert({
          video_id: videoId,
          status: 'processing',
          created_at: new Date().toISOString(),
          processed_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (insertError || !newRecord) {
        throw new Error(`Error creating processing record: ${insertError?.message || 'No record returned'}`);
      }
      
      processingRecordId = newRecord.id;
    }
    
    // Fetch video details
    const videoDetails = await fetchVideoDetails(videoId);
    console.log(`Video details fetched: ${videoDetails.title}`);
    
    // Fetch transcript
    const transcript = await fetchYouTubeTranscript(videoId);
    console.log(`Transcript result: ${transcript?.substring(0, 100)}...`);
    
    // Update processing record with details and transcript
    const { error: saveError } = await supabase
      .from('ai_news_video_processing')
      .update({
        processing_metadata: videoDetails,
        transcript: transcript,
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', processingRecordId);
      
    if (saveError) {
      throw new Error(`Error saving video data: ${saveError.message}`);
    }
    
    return {
      success: true,
      videoId,
      title: videoDetails.title,
      transcriptLength: transcript?.length || 0
    };
    
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error);
    
    // Update error status in the record if we can
    try {
      await supabase
        .from('ai_news_video_processing')
        .update({
          status: 'failed',
          error_message: error.message || 'Unknown error',
          processed_at: new Date().toISOString()
        })
        .eq('video_id', videoId);
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }
    
    return {
      success: false,
      videoId,
      error: error.message
    };
  }
}

// [Analysis] Main serve function for handling requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the video ID from the request (support both query param and JSON body)
    let videoId: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      videoId = url.searchParams.get('videoId');
    } else {
      try {
        const body = await req.json();
        videoId = body.videoId;
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }
    
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'videoId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Received request to process video: ${videoId}`);
    const result = await processVideo(videoId);

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in processing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
