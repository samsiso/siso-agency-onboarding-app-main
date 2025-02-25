
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

async function generateArticleContent(videoMetadata: any) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    console.log(`Generating article content for video: ${videoMetadata.title}`);
    
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
            content: 'You are a knowledgeable AI news article writer who creates detailed and engaging content about AI technology.'
          },
          {
            role: 'user',
            content: `Create a detailed AI news article based on this YouTube video:
              Title: ${videoMetadata.title}
              Description: ${videoMetadata.description}

              Generate a comprehensive article that includes:
              1. An engaging title
              2. A brief description
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

async function fetchYouTubeTranscript(videoId: string) {
  try {
    console.log(`Fetching transcript for YouTube video: ${videoId}`);
    
    // Use YouTube API to get captions
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    // First get the caption track ID
    const captionListResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`
    );
    
    if (!captionListResponse.ok) {
      const errorText = await captionListResponse.text();
      console.error(`YouTube Captions API error (${captionListResponse.status}): ${errorText}`);
      
      // If no captions available, return empty transcript
      if (captionListResponse.status === 404) {
        console.log(`No captions found for video ${videoId}`);
        return "";
      }
      
      throw new Error(`Failed to fetch captions list: ${captionListResponse.status}`);
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
    
    // Get the actual transcript
    const transcriptResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${youtubeApiKey}`
    );
    
    if (!transcriptResponse.ok) {
      throw new Error(`Failed to fetch transcript: ${transcriptResponse.status}`);
    }
    
    const transcriptData = await transcriptResponse.text();
    return transcriptData;
  } catch (error) {
    console.error(`Error fetching transcript for video ${videoId}:`, error);
    
    // Return empty string on failure, we'll still try to generate content from title/description
    return "";
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get pending videos to process
    const { data: pendingVideos, error: fetchError } = await supabase
      .from('ai_news_video_processing')
      .select('*, ai_news_youtube_sources(*)')
      .eq('status', 'pending')
      .limit(5);

    if (fetchError) throw fetchError;

    console.log(`Found ${pendingVideos?.length || 0} pending videos to process`);

    if (!pendingVideos || pendingVideos.length === 0) {
      return new Response(
        JSON.stringify({ status: 'success', message: 'No pending videos found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const video of pendingVideos) {
      console.log(`Processing video: ${video.video_id}`);

      try {
        // Update status to processing
        await supabase
          .from('ai_news_video_processing')
          .update({
            status: 'processing',
            processed_at: new Date().toISOString()
          })
          .eq('id', video.id);

        // Fetch video details if not in processing metadata
        let videoDetails = video.processing_metadata;
        if (!videoDetails.title || !videoDetails.description) {
          console.log(`Fetching additional details for video ${video.video_id}`);
          const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${video.video_id}&key=${youtubeApiKey}`
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
              .eq('id', video.id);
          }
        }

        // Fetch transcript
        const transcript = await fetchYouTubeTranscript(video.video_id);
        console.log(`Transcript fetched for ${video.video_id}: ${transcript ? 'Success' : 'Not available'}`);
        
        // Save transcript
        await supabase
          .from('ai_news_video_processing')
          .update({
            transcript: transcript || null
          })
          .eq('id', video.id);

        // Prepare metadata for content generation
        const contentMetadata = {
          title: videoDetails.title || `YouTube Video ${video.video_id}`,
          description: videoDetails.description || '',
          transcript: transcript || '',
          videoId: video.video_id,
          channelTitle: videoDetails.channelTitle || '',
          publishedAt: videoDetails.publishedAt || new Date().toISOString()
        };

        // Generate article content
        const articleContent = await generateArticleContent(contentMetadata);
        console.log(`Generated article content for ${video.video_id}`);

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
            status: 'published'
          })
          .select()
          .single();

        if (articleError) throw articleError;

        console.log(`Successfully created article: ${article.id}`);

        // Update processing status
        await supabase
          .from('ai_news_video_processing')
          .update({
            status: 'completed',
            article_id: article.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', video.id);

        results.push({
          video_id: video.video_id,
          status: 'success',
          article_id: article.id
        });

      } catch (error) {
        console.error(`Error processing video ${video.video_id}:`, error);
        
        // Determine if we should retry
        const shouldRetry = video.retry_count < 3; // Limit to 3 retries
        
        // Update error status
        await supabase
          .from('ai_news_video_processing')
          .update({
            status: shouldRetry ? 'pending' : 'error',
            error_message: error.message || 'Unknown error during processing',
            retry_count: (video.retry_count || 0) + 1
          })
          .eq('id', video.id);
          
        results.push({
          video_id: video.video_id,
          status: 'error',
          error: error.message,
          will_retry: shouldRetry
        });
      }
    }

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
