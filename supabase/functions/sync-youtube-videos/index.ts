
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { google } from 'https://esm.sh/googleapis@126.0.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize YouTube API client
const youtube = google.youtube('v3');

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get YouTube sources that need syncing
    const { data: sources, error: sourcesError } = await supabase
      .from('ai_news_youtube_sources')
      .select('*')
      .eq('auto_process', true);

    if (sourcesError) throw sourcesError;

    const youtubeClient = google.youtube({
      version: 'v3',
      auth: Deno.env.get('YOUTUBE_API_KEY'),
    });

    for (const source of sources) {
      console.log(`Processing channel: ${source.channel_name}`);
      
      try {
        // Get latest videos
        const response = await youtubeClient.search.list({
          channelId: source.channel_id,
          part: ['snippet'],
          order: 'date',
          maxResults: source.processing_config.max_videos_per_sync || 10,
          type: ['video'],
        });

        if (!response.data.items) continue;

        // Process each video
        for (const item of response.data.items) {
          if (!item.id?.videoId) continue;

          const videoMetadata: VideoMetadata = {
            videoId: item.id.videoId,
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
            thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
          };

          // Check if video already exists in processing queue
          const { data: existing } = await supabase
            .from('ai_news_video_processing')
            .select()
            .eq('video_id', videoMetadata.videoId)
            .single();

          if (!existing) {
            // Add new video to processing queue
            const { error: insertError } = await supabase
              .from('ai_news_video_processing')
              .insert({
                video_id: videoMetadata.videoId,
                source_id: source.id,
                processing_metadata: {
                  title: videoMetadata.title,
                  description: videoMetadata.description,
                  publishedAt: videoMetadata.publishedAt,
                  thumbnailUrl: videoMetadata.thumbnailUrl,
                },
                status: 'pending',
                retry_count: 0
              });

            if (insertError) {
              console.error(`Error inserting video ${videoMetadata.videoId}:`, insertError);
            } else {
              console.log(`Added video ${videoMetadata.videoId} to processing queue`);
            }
          }
        }

        // Update last synced timestamp
        await supabase
          .from('ai_news_youtube_sources')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error processing channel ${source.channel_id}:`, error);
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing videos:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
