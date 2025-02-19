
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

async function getLatestVideos(channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.items || [];
}

async function syncChannel(channelId: string) {
  console.log(`Syncing channel ${channelId}`);
  
  try {
    // 1. Get latest videos
    const videos = await getLatestVideos(channelId);
    
    // 2. Filter videos we haven't processed yet
    const { data: existingVideos } = await supabase
      .from('ai_news_video_segments')
      .select('video_id')
      .eq('channel_id', channelId);
    
    const processedVideoIds = new Set(existingVideos?.map(v => v.video_id));
    const newVideos = videos.filter(v => !processedVideoIds.has(v.id.videoId));
    
    // 3. Process each new video
    for (const video of newVideos) {
      // Call our process-youtube-news function
      const response = await fetch(`${SUPABASE_URL}/functions/v1/process-youtube-news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId: video.id.videoId,
          channelId: channelId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to process video ${video.id.videoId}`);
      }
    }
    
    // 4. Update channel's last sync time
    await supabase
      .from('ai_news_channels')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('channel_id', channelId);
    
    return { success: true, processedVideos: newVideos.length };
  } catch (error) {
    console.error('Error syncing channel:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get all active channels
    const { data: channels, error } = await supabase
      .from('ai_news_channels')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Process each channel
    const results = await Promise.all(
      channels.map(channel => syncChannel(channel.channel_id))
    );
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
