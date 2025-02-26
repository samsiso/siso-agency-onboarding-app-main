
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// [Analysis] Enhanced transcript fetching with retry logic and exponential backoff
async function fetchYouTubeTranscript(videoId: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Attempt ${attempt}: Fetching transcript for video ${videoId}`);
    
    try {
      // Use YouTube API to get captions
      const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
      
      if (!youtubeApiKey) {
        throw new Error('YouTube API key not configured');
      }
      
      // First get the caption track ID
      const captionListResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`
      );
      
      // [Analysis] Added detailed error logging for API response issues
      if (!captionListResponse.ok) {
        const errorText = await captionListResponse.text();
        console.error(`YouTube Captions API error (${captionListResponse.status}): ${errorText}`);
        
        // If no captions available, return empty transcript but don't retry
        if (captionListResponse.status === 404) {
          console.log(`No captions found for video ${videoId}`);
          return "";
        }
        
        // For other errors, we'll retry
        throw new Error(`Failed to fetch captions list: ${captionListResponse.status} - ${errorText}`);
      }
      
      const captionsData = await captionListResponse.json();
      
      // Check if captions exist
      if (!captionsData.items || captionsData.items.length === 0) {
        console.log(`No captions found for video ${videoId}`);
        return "";
      }
      
      // Prioritize English captions if available
      let captionId = captionsData.items[0].id; // Default to first caption
      const englishCaption = captionsData.items.find((item: any) => 
        item.snippet.language === 'en' || item.snippet.language === 'en-US'
      );
      
      if (englishCaption) {
        captionId = englishCaption.id;
      }
      
      // [Analysis] Added timedText format parameter and downloading as text
      console.log(`Using caption ID: ${captionId} for video ${videoId}`);
      const transcriptResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${youtubeApiKey}&tfmt=sbv`
      );
      
      if (!transcriptResponse.ok) {
        throw new Error(`Failed to fetch transcript: ${transcriptResponse.status}`);
      }
      
      const transcriptData = await transcriptResponse.text();
      return transcriptData;
    } catch (error) {
      console.error(`Attempt ${attempt}: Failed transcript for ${videoId}:`, error);
      
      // Don't retry if it's the last attempt
      if (attempt < retries) {
        // Exponential backoff
        const backoffTime = attempt * 2000;
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(res => setTimeout(res, backoffTime));
      } else {
        // Last attempt failed, log the failure
        await logProcessingFailure(videoId, `Failed to fetch transcript after ${retries} attempts: ${error.message}`);
      }
    }
  }
  
  // All attempts failed
  return "";
}

// [Analysis] Added separate function for generating article content to make the code more modular
async function generateArticleContent(videoMetadata: any) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    console.log(`Generating article content for video: ${videoMetadata.title}`);
    
    // [Analysis] Added more detailed prompt with better structuring
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable AI news article writer who creates detailed and engaging content about AI technology. Focus on accuracy, clarity, and delivering valuable insights.'
          },
          {
            role: 'user',
            content: `Create a detailed AI news article based on this YouTube video:
              Title: ${videoMetadata.title}
              Description: ${videoMetadata.description}
              Transcript: ${videoMetadata.transcript ? videoMetadata.transcript.substring(0, 5000) : "No transcript available."}

              Generate a comprehensive article that includes:
              1. An engaging title
              2. A brief description (2-3 sentences)
              3. Key technical insights
              4. Industry impact analysis
              5. Future implications

              Format the response as a JSON object with the following structure:
              {
                "title": "Enhanced title",
                "description": "Brief overview",
                "content": "Main article content with proper formatting",
                "technical_complexity": "basic|intermediate|advanced",
                "impact": "low|medium|high",
                "category": "industry_applications|breakthrough_technologies|language_models|robotics_automation|international_developments"
              }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}): ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    try {
      return JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      throw new Error('Failed to parse article content from AI response');
    }
  } catch (error) {
    console.error('Error generating article content:', error);
    throw error;
  }
}

// [Analysis] Added dedicated function for logging processing failures
async function logProcessingFailure(videoId: string, errorMessage: string) {
  try {
    console.error(`Processing failure for video ${videoId}: ${errorMessage}`);
    
    // First, update the video processing record
    const { error: updateError } = await supabase
      .from('ai_news_video_processing')
      .update({
        status: 'failed',
        error_message: errorMessage,
        processed_at: new Date().toISOString()
      })
      .eq('video_id', videoId);
      
    if (updateError) {
      console.error('Error updating processing status:', updateError);
    }
    
    // Check if processing_logs table exists, if not, we'll create it
    const { error: tableCheckError } = await supabase
      .from('processing_logs')
      .select('id')
      .limit(1);
      
    if (tableCheckError && tableCheckError.message.includes('relation "processing_logs" does not exist')) {
      // Table doesn't exist, create it
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS processing_logs (
          id SERIAL PRIMARY KEY,
          video_id TEXT,
          log_message TEXT,
          created_at TIMESTAMP DEFAULT now()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec', { sql: createTableQuery });
      if (createError) {
        console.error('Error creating processing_logs table:', createError);
        return; // Can't log if we can't create the table
      }
    }
    
    // Log the failure
    await supabase
      .from('processing_logs')
      .insert({
        video_id: videoId,
        log_message: errorMessage
      });
      
  } catch (logError) {
    console.error('Error logging processing failure:', logError);
  }
}

// [Plan] Process a single video at a time to improve reliability
async function processVideo(videoId: string, processingRecord: any) {
  console.log(`Starting processing for video: ${videoId}`);
  
  try {
    // Update status to processing
    const { error: updateError } = await supabase
      .from('ai_news_video_processing')
      .update({
        status: 'processing',
        processed_at: new Date().toISOString()
      })
      .eq('id', processingRecord.id)
      .eq('status', 'pending');
      
    if (updateError) {
      console.error(`Error updating status to processing: ${updateError.message}`);
      return { status: 'error', error: updateError.message };
    }
    
    // Fetch video details if not in processing metadata
    let videoDetails = processingRecord.processing_metadata || {};
    if (!videoDetails.title || !videoDetails.description) {
      console.log(`Fetching additional details for video ${videoId}`);
      const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
      
      if (!youtubeApiKey) {
        throw new Error('YouTube API key not configured');
      }
      
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
      );
      
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videoResponse.status}`);
      }
      
      const videoData = await videoResponse.json();
      if (videoData.items && videoData.items.length > 0) {
        videoDetails = {
          ...videoDetails,
          title: videoData.items[0].snippet.title,
          description: videoData.items[0].snippet.description,
          publishedAt: videoData.items[0].snippet.publishedAt,
          channelTitle: videoData.items[0].snippet.channelTitle,
          thumbnailUrl: videoData.items[0].snippet.thumbnails?.high?.url || videoData.items[0].snippet.thumbnails?.default?.url
        };
        
        // Update the processing metadata
        await supabase
          .from('ai_news_video_processing')
          .update({
            processing_metadata: videoDetails
          })
          .eq('id', processingRecord.id);
      } else {
        throw new Error('Video not found on YouTube');
      }
    }
    
    // Fetch transcript
    const transcript = await fetchYouTubeTranscript(videoId);
    console.log(`Transcript fetched for ${videoId}: ${transcript ? 'Success' : 'Not available'}`);
    
    // Save transcript
    await supabase
      .from('ai_news_video_processing')
      .update({
        transcript: transcript || null
      })
      .eq('id', processingRecord.id);
      
    // Prepare metadata for content generation
    const contentMetadata = {
      title: videoDetails.title || `YouTube Video ${videoId}`,
      description: videoDetails.description || '',
      transcript: transcript || '',
      videoId: videoId,
      channelTitle: videoDetails.channelTitle || '',
      publishedAt: videoDetails.publishedAt || new Date().toISOString()
    };
    
    // Generate article content
    const articleContent = await generateArticleContent(contentMetadata);
    console.log(`Generated article content for ${videoId}`);
    
    // Create new article
    const { data: article, error: articleError } = await supabase
      .from('ai_news')
      .insert({
        title: articleContent.title,
        description: articleContent.description,
        content: articleContent.content,
        technical_complexity: articleContent.technical_complexity,
        impact: articleContent.impact,
        category: articleContent.category,
        source: 'youtube',
        image_url: videoDetails.thumbnailUrl,
        date: new Date(videoDetails.publishedAt || new Date()).toISOString().split('T')[0],
        status: 'published',
        article_type: 'news'
      })
      .select()
      .single();
      
    if (articleError) {
      throw articleError;
    }
    
    console.log(`Successfully created article: ${article.id}`);
    
    // Update processing status
    await supabase
      .from('ai_news_video_processing')
      .update({
        status: 'completed',
        article_id: article.id,
        processed_at: new Date().toISOString()
      })
      .eq('id', processingRecord.id);
      
    return {
      status: 'success',
      article_id: article.id
    };
    
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error);
    
    // Determine if we should retry
    const shouldRetry = (processingRecord.retry_count || 0) < 3; // Limit to 3 retries
    
    // Update error status
    await supabase
      .from('ai_news_video_processing')
      .update({
        status: shouldRetry ? 'pending' : 'failed',
        error_message: error.message || 'Unknown error during processing',
        retry_count: (processingRecord.retry_count || 0) + 1
      })
      .eq('id', processingRecord.id);
      
    await logProcessingFailure(videoId, error.message || 'Unknown error during processing');
      
    return {
      status: 'error',
      error: error.message,
      will_retry: shouldRetry
    };
  }
}

// [Analysis] Added function to cleanup stuck videos
async function cleanupStuckVideos() {
  const thirtyMinutesAgo = new Date();
  thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
  
  const { data: stuckVideos, error } = await supabase
    .from('ai_news_video_processing')
    .update({
      status: 'failed',
      error_message: 'Processing timed out after 30 minutes'
    })
    .eq('status', 'processing')
    .lt('processed_at', thirtyMinutesAgo.toISOString())
    .select();
    
  if (error) {
    console.error('Error cleaning up stuck videos:', error);
    return;
  }
  
  if (stuckVideos && stuckVideos.length > 0) {
    console.log(`Cleaned up ${stuckVideos.length} stuck videos`);
    
    // Log each stuck video
    for (const video of stuckVideos) {
      await logProcessingFailure(video.video_id, 'Processing timed out after 30 minutes');
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Run cleanup on each invocation
    await cleanupStuckVideos();
    
    // Get pending videos to process
    const { data: pendingVideos, error: fetchError } = await supabase
      .from('ai_news_video_processing')
      .select('*, ai_news_youtube_sources(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1); // Only process one video at a time for reliability

    if (fetchError) throw fetchError;

    console.log(`Found ${pendingVideos?.length || 0} pending videos to process`);

    if (!pendingVideos || pendingVideos.length === 0) {
      return new Response(
        JSON.stringify({ status: 'success', message: 'No pending videos found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];
    const video = pendingVideos[0]; // Only process one video
    
    console.log(`Processing video: ${video.video_id}`);
    const result = await processVideo(video.video_id, video);
    results.push(result);

    return new Response(
      JSON.stringify({ status: 'success', processed: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
