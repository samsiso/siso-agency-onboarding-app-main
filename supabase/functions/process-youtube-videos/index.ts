
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.13";

// Import the YouTube API client
import { createYouTubeClient } from "./youtube-client.ts";

// Configure Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessOptions {
  videoId?: string;
  date?: string;
  channelId?: string;
  forceReprocess?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request
    const options: ProcessOptions = await req.json().catch(() => ({}));
    console.log("Process options:", options);

    // Create YouTube client
    const youtube = createYouTubeClient(youtubeApiKey);
    
    // Process based on provided options
    if (options.videoId) {
      // Process a single video
      const result = await processVideo(options.videoId, options.forceReprocess);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (options.date) {
      // Process videos for specific date
      const result = await processVideosByDate(options.date, options.forceReprocess);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (options.channelId) {
      // Process videos from a specific channel
      const result = await processChannelVideos(options.channelId, options.forceReprocess);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Process stuck videos - default action
      const result = await cleanupStuckVideos();
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function cleanupStuckVideos() {
  console.log("Starting cleanup of stuck videos...");
  
  // Find videos stuck in processing state for more than 10 minutes
  const tenMinutesAgo = new Date();
  tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
  
  const { data: stuckVideos, error } = await supabase
    .from('ai_news_video_processing')
    .select('*')
    .eq('status', 'processing')
    .lt('created_at', tenMinutesAgo.toISOString())
    .order('created_at', { ascending: true })
    .limit(5);
  
  if (error) {
    console.error("Error finding stuck videos:", error);
    throw error;
  }
  
  console.log(`Found ${stuckVideos?.length || 0} stuck videos`);
  
  const results = [];
  for (const video of stuckVideos || []) {
    try {
      // Reset to pending with increased retry count
      const { data, error: updateError } = await supabase
        .from('ai_news_video_processing')
        .update({
          status: 'pending',
          retry_count: (video.retry_count || 0) + 1,
          error_message: 'Reset after being stuck in processing state'
        })
        .eq('id', video.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      results.push({ id: video.id, status: 'reset', retry_count: data.retry_count });
    } catch (error) {
      console.error(`Failed to reset stuck video ${video.id}:`, error);
      results.push({ id: video.id, status: 'failed', error: error.message });
    }
  }
  
  return { 
    processed: results.length,
    details: results
  };
}

async function processVideo(videoId: string, forceReprocess = false) {
  console.log(`Processing video ${videoId}...`);
  
  // Check if video is already processed
  if (!forceReprocess) {
    const { data: existingProcess } = await supabase
      .from('ai_news_video_processing')
      .select('*')
      .eq('video_id', videoId)
      .not('status', 'eq', 'failed')
      .maybeSingle();
      
    if (existingProcess) {
      console.log(`Video ${videoId} is already in processing state: ${existingProcess.status}`);
      return { id: existingProcess.id, status: existingProcess.status, skipped: true };
    }
  }
  
  // Create or update the processing record
  const { data, error } = await supabase
    .from('ai_news_video_processing')
    .upsert(
      { 
        video_id: videoId,
        status: 'pending',
        retry_count: 0
      },
      { onConflict: 'video_id' }
    )
    .select()
    .single();
  
  if (error) {
    console.error(`Error creating process record for video ${videoId}:`, error);
    throw error;
  }
  
  console.log(`Successfully initiated processing for video ${videoId}`);
  return { id: data.id, status: 'pending', videoId };
}

async function processVideosByDate(dateStr: string, forceReprocess = false) {
  console.log(`Processing videos for date ${dateStr}...`);
  
  // Get YouTube videos for the specified date
  const { data: videos, error } = await supabase
    .from('youtube_videos')
    .select('id')
    .eq('date', dateStr)
    .order('viewCount', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error(`Error fetching videos for date ${dateStr}:`, error);
    throw error;
  }
  
  console.log(`Found ${videos?.length || 0} videos for date ${dateStr}`);
  
  const results = [];
  for (const video of videos || []) {
    try {
      const result = await processVideo(video.id, forceReprocess);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process video ${video.id}:`, error);
      results.push({ id: video.id, status: 'failed', error: error.message });
    }
    
    // Short delay to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return {
    date: dateStr,
    processed: results.length,
    details: results
  };
}

async function processChannelVideos(channelId: string, forceReprocess = false) {
  console.log(`Processing videos for channel ${channelId}...`);
  
  // Get YouTube videos for the specified channel
  const { data: videos, error } = await supabase
    .from('youtube_videos')
    .select('id')
    .eq('channel_id', channelId)
    .order('published_timestamp', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error);
    throw error;
  }
  
  console.log(`Found ${videos?.length || 0} videos for channel ${channelId}`);
  
  const results = [];
  for (const video of videos || []) {
    try {
      const result = await processVideo(video.id, forceReprocess);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process video ${video.id}:`, error);
      results.push({ id: video.id, status: 'failed', error: error.message });
    }
    
    // Short delay to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return {
    channelId,
    processed: results.length,
    details: results
  };
}
