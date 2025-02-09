
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

interface Educator {
  id: string
  channel_id: string
  name: string
  last_synced_at?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BATCH_SIZE = 5
const QUOTA_PER_REQUEST = 100

// [Analysis] Separate YouTube API calls for better error handling and reusability
async function fetchChannelPlaylistId(channelId: string): Promise<string> {
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
  )
  const playlistData = await playlistResponse.json()
  const uploadsPlaylistId = playlistData.items[0]?.contentDetails?.relatedPlaylists?.uploads

  if (!uploadsPlaylistId) {
    throw new Error(`Could not find uploads playlist for channel: ${channelId}`)
  }

  return uploadsPlaylistId
}

async function fetchPlaylistVideos(playlistId: string, lastSyncedAt?: string): Promise<string[]> {
  const publishedAfter = lastSyncedAt ? `&publishedAfter=${lastSyncedAt}` : ''
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${publishedAfter}&key=${YOUTUBE_API_KEY}`
  )
  const videosData = await videosResponse.json()
  
  if (!videosData.items?.length) {
    return []
  }

  return videosData.items.map((item: any) => item.snippet.resourceId.videoId)
}

async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const videoDetailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
  )
  const videoDetails = await videoDetailsResponse.json()
  return videoDetails.items || []
}

// [Analysis] Database operations isolated for better error handling
async function createSyncHistory(supabase: any, educator: Educator) {
  const { data: historyRecord, error } = await supabase
    .from('video_sync_history')
    .insert({
      creator_id: educator.id,
      status: 'running'
    })
    .select()
    .single()

  if (error) throw error
  return historyRecord
}

async function updateEducatorStatus(supabase: any, educatorId: string, status: string, data = {}) {
  await supabase
    .from('education_creators')
    .update({ 
      sync_status: status,
      ...data
    })
    .eq('id', educatorId)
}

async function upsertVideo(supabase: any, video: YouTubeVideo, channelId: string) {
  const { error } = await supabase
    .from('youtube_videos')
    .upsert({
      id: video.id,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
      duration: video.contentDetails.duration,
      viewCount: parseInt(video.statistics.viewCount),
      date: video.snippet.publishedAt,
      channel_id: channelId,
      url: `https://youtube.com/watch?v=${video.id}`
    })

  if (error) throw error
}

// [Analysis] Main sync logic separated for clarity
async function syncEducatorVideos(supabase: any, educator: Educator) {
  let syncHistory;
  try {
    syncHistory = await createSyncHistory(supabase, educator)
    await updateEducatorStatus(supabase, educator.id, 'in_progress', { 
      sync_started_at: new Date().toISOString() 
    })

    const playlistId = await fetchChannelPlaylistId(educator.channel_id)
    const videoIds = await fetchPlaylistVideos(playlistId, educator.last_synced_at)
    const videos = await fetchVideoDetails(videoIds)
    
    console.log(`[sync-educator-videos] Fetched ${videos.length} videos for ${educator.name}`)
    
    for (const video of videos) {
      await upsertVideo(supabase, video, educator.channel_id)
    }

    await Promise.all([
      supabase
        .from('video_sync_history')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          videos_synced: videos.length,
          api_quota_used: QUOTA_PER_REQUEST
        })
        .eq('id', syncHistory.id),
      
      updateEducatorStatus(supabase, educator.id, 'completed', {
        sync_completed_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      })
    ])

  } catch (error) {
    console.error(`[sync-educator-videos] Error syncing educator ${educator.name}:`, error)
    await Promise.all([
      supabase
        .from('video_sync_history')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', syncHistory?.id),
      
      updateEducatorStatus(supabase, educator.id, 'failed', {
        last_sync_error: error.message
      })
    ])
    throw error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    const { data: educators, error: educatorsError } = await supabase
      .from('education_creators')
      .select('id, channel_id, name, last_synced_at')
      .or('sync_status.eq.pending,last_synced_at.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('last_synced_at', { ascending: true, nullsFirst: true })
      .limit(BATCH_SIZE)

    if (educatorsError) {
      console.error('[sync-educator-videos] Error fetching educators:', educatorsError)
      throw educatorsError
    }

    console.log(`[sync-educator-videos] Processing ${educators?.length || 0} educators`)

    for (const educator of educators || []) {
      await syncEducatorVideos(supabase, educator)
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${educators?.length || 0} educators`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })

  } catch (error) {
    console.error('[sync-educator-videos] Error in sync function:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})

