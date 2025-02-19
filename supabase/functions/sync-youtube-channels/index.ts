
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // [Analysis] Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // [Analysis] Get active channels to sync
    const { data: channels, error: channelsError } = await supabaseClient
      .from('ai_news_youtube_sources')
      .select('*')
      .eq('auto_process', true)
      .order('last_synced_at', { ascending: true })
      .limit(3); // [Plan] Process in batches to respect API limits

    if (channelsError) throw channelsError;

    const results = [];
    for (const channel of channels) {
      // [Analysis] Fetch recent videos for each channel
      const videos = await fetchChannelVideos(channel.channel_id);
      
      // [Analysis] Process each video
      for (const video of videos) {
        const processed = await processVideo(video, supabaseClient);
        results.push(processed);
      }

      // [Analysis] Update last sync timestamp
      await supabaseClient
        .from('ai_news_youtube_sources')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', channel.id);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error syncing YouTube channels:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchChannelVideos(channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&` +
    `key=${Deno.env.get('YOUTUBE_API_KEY')}`
  );

  const data = await response.json();
  return data.items || [];
}

async function processVideo(video: any, supabaseClient: any) {
  try {
    // [Analysis] Check if video already processed
    const { data: existing } = await supabaseClient
      .from('ai_news_video_processing')
      .select('*')
      .eq('video_id', video.id.videoId)
      .maybeSingle();

    if (existing) {
      return { status: 'already_processed', videoId: video.id.videoId };
    }

    // [Analysis] Create processing record
    await supabaseClient
      .from('ai_news_video_processing')
      .insert({
        video_id: video.id.videoId,
        status: 'pending',
        processing_metadata: {
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt
        }
      });

    // [Plan] Implement video transcript fetching
    // [Plan] Add automatic categorization of content
    // [Plan] Implement duplicate detection

    return { status: 'queued', videoId: video.id.videoId };
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}
