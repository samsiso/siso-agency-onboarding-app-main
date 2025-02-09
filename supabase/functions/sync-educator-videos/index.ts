
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string }
      high: { url: string }
    }
    publishedAt: string
    channelId: string
  }
  contentDetails: {
    duration: string
  }
  statistics: {
    viewCount: string
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    // Get educators that need syncing (pending or not synced in last 24 hours)
    const { data: educators, error: educatorsError } = await supabase
      .from('education_creators')
      .select('id, channel_id, name')
      .or('sync_status.eq.pending,last_synced_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(5) // Process in batches to respect YouTube API quotas

    if (educatorsError) {
      console.error('[sync-educator-videos] Error fetching educators:', educatorsError);
      throw educatorsError;
    }

    console.log(`[sync-educator-videos] Processing ${educators?.length || 0} educators`);

    for (const educator of educators || []) {
      try {
        // Update sync status to in_progress
        const { error: updateError } = await supabase
          .from('education_creators')
          .update({ sync_status: 'in_progress' })
          .eq('id', educator.id)

        if (updateError) {
          console.error(`[sync-educator-videos] Error updating status for ${educator.name}:`, updateError);
          continue;
        }

        // Fetch videos from YouTube API
        const videos = await fetchYouTubeVideos(educator.channel_id)
        console.log(`[sync-educator-videos] Fetched ${videos.length} videos for ${educator.name}`);
        
        // Begin transaction to update videos
        for (const video of videos) {
          const { error: upsertError } = await supabase
            .from('youtube_videos')
            .upsert({
              id: video.id,
              title: video.snippet.title,
              thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
              duration: video.contentDetails.duration,
              viewCount: parseInt(video.statistics.viewCount),
              date: video.snippet.publishedAt,
              channel_id: educator.channel_id,
              url: `https://youtube.com/watch?v=${video.id}`
            })

          if (upsertError) {
            console.error(`[sync-educator-videos] Error upserting video ${video.id}:`, upsertError);
            throw upsertError;
          }
        }

        // Update educator sync status
        await supabase
          .from('education_creators')
          .update({ 
            sync_status: 'completed',
          })
          .eq('id', educator.id)

      } catch (error) {
        console.error(`[sync-educator-videos] Error syncing educator ${educator.name}:`, error)
        
        // Update educator with error status
        await supabase
          .from('education_creators')
          .update({ 
            sync_status: 'failed',
          })
          .eq('id', educator.id)
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${educators?.length || 0} educators`
    }), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    })

  } catch (error) {
    console.error('[sync-educator-videos] Error in sync function:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    })
  }
})

async function fetchYouTubeVideos(channelId: string): Promise<YouTubeVideo[]> {
  // First get playlist ID for channel uploads
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
  )
  const playlistData = await playlistResponse.json()
  const uploadsPlaylistId = playlistData.items[0]?.contentDetails?.relatedPlaylists?.uploads

  if (!uploadsPlaylistId) {
    console.error('[sync-educator-videos] Could not find uploads playlist for channel:', channelId);
    throw new Error('Could not find uploads playlist for channel')
  }

  // Then get videos from playlist
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
  )
  const videosData = await videosResponse.json()

  // Get full video details
  const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',')
  const videoDetailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
  )
  const videoDetails = await videoDetailsResponse.json()

  return videoDetails.items
}
