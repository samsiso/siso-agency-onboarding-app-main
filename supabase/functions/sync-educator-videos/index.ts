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
      maxres?: { url: string }
    }
    publishedAt: string
    channelId: string
    tags?: string[]
    categoryId?: string
    defaultLanguage?: string
    defaultAudioLanguage?: string
  }
  contentDetails: {
    duration: string
    caption: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
    favoriteCount: string
  }
  status: {
    uploadStatus: string
    privacyStatus: string
  }
  topicDetails?: {
    topicCategories: string[]
    relevantTopicIds: string[]
  }
}

interface ChannelStats {
  id: string
  statistics: {
    viewCount: string
    subscriberCount: string
    videoCount: string
  }
  snippet: {
    country?: string
    publishedAt: string
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

// [Analysis] Enhanced YouTube API calls with additional data
async function fetchChannelDetails(channelId: string): Promise<ChannelStats> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
  )
  const data = await response.json()
  if (!data.items?.[0]) {
    throw new Error(`Could not find channel: ${channelId}`)
  }
  return data.items[0]
}

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
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status,topicDetails&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
  )
  const videoDetails = await videoDetailsResponse.json()
  return videoDetails.items || []
}

// [Analysis] Enhanced database operations with new fields
async function updateEducatorStats(supabase: any, educator: Educator, channelStats: ChannelStats) {
  const { error } = await supabase
    .from('education_creators')
    .update({
      number_of_subscribers: parseInt(channelStats.statistics.subscriberCount),
      total_view_count: parseInt(channelStats.statistics.viewCount),
      channel_total_videos: parseInt(channelStats.statistics.videoCount),
      channel_location: channelStats.snippet.country,
      channel_joined_date: channelStats.snippet.publishedAt,
      subscriber_count_history: supabase.sql`array_append(subscriber_count_history, jsonb_build_object('count', ${channelStats.statistics.subscriberCount}, 'date', ${new Date().toISOString()}))`
    })
    .eq('id', educator.id)

  if (error) throw error
}

async function upsertVideo(supabase: any, video: YouTubeVideo, channelId: string) {
  const { error } = await supabase
    .from('youtube_videos')
    .upsert({
      id: video.id,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
      hd_thumbnail_url: video.snippet.thumbnails.maxres?.url,
      duration: video.contentDetails.duration,
      viewCount: parseInt(video.statistics.viewCount),
      likes_count: parseInt(video.statistics.likeCount),
      comment_count: parseInt(video.statistics.commentCount),
      category_id: video.snippet.categoryId,
      tags: video.snippet.tags || [],
      full_description: video.snippet.description,
      language: video.snippet.defaultLanguage || video.snippet.defaultAudioLanguage,
      has_captions: video.contentDetails.caption !== "false",
      date: video.snippet.publishedAt,
      channel_id: channelId,
      url: `https://youtube.com/watch?v=${video.id}`
    })

  if (error) throw error

  // Record engagement metrics
  await supabase
    .from('video_engagement_history')
    .insert({
      video_id: video.id,
      view_count: parseInt(video.statistics.viewCount),
      likes_count: parseInt(video.statistics.likeCount),
      comment_count: parseInt(video.statistics.commentCount)
    })
}

// [Analysis] Main sync logic with enhanced data collection
async function syncEducatorVideos(supabase: any, educator: Educator) {
  let syncHistory;
  try {
    syncHistory = await createSyncHistory(supabase, educator)
    await updateEducatorStatus(supabase, educator.id, 'in_progress')

    // Fetch enhanced channel statistics
    const channelStats = await fetchChannelDetails(educator.channel_id)
    await updateEducatorStats(supabase, educator, channelStats)

    const playlistId = await fetchChannelPlaylistId(educator.channel_id)
    const videoIds = await fetchPlaylistVideos(playlistId, educator.last_synced_at)
    const videos = await fetchVideoDetails(videoIds)
    
    console.log(`[sync-educator-videos] Fetched ${videos.length} videos for ${educator.name} with enhanced data`)
    
    for (const video of videos) {
      await upsertVideo(supabase, video, educator.channel_id)
    }

    // Calculate video upload frequency if we have multiple videos
    if (videos.length > 1) {
      const dates = videos.map(v => new Date(v.snippet.publishedAt)).sort()
      const avgDays = dates.slice(1).reduce((sum, date, i) => {
        return sum + (date.getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24)
      }, 0) / (dates.length - 1)
      
      await supabase
        .from('education_creators')
        .update({
          video_upload_frequency: `${Math.round(avgDays)} days`
        })
        .eq('id', educator.id)
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

// [Analysis] Keep existing sync history and status update functions
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

    console.log(`[sync-educator-videos] Processing ${educators?.length || 0} educators with enhanced data collection`)

    for (const educator of educators || []) {
      await syncEducatorVideos(supabase, educator)
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${educators?.length || 0} educators with enhanced data`
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
