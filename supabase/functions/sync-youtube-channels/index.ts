
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
    // [Analysis] Initialize Supabase client with admin privileges
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

    if (channelsError) {
      console.error('Error fetching channels:', channelsError);
      throw channelsError;
    }

    if (!channels || channels.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No channels found to sync' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${channels.length} channels to sync`);
    
    const results = [];
    const syncDetails = [];

    for (const channel of channels) {
      console.log(`Processing channel: ${channel.channel_name} (${channel.channel_id})`);
      
      try {
        // [Analysis] Create sync history record
        const { data: syncRecord, error: syncRecordError } = await supabaseClient
          .from('sync_history')
          .insert({
            channel_id: channel.channel_id,
            sync_status: 'pending'
          })
          .select()
          .single();

        if (syncRecordError) {
          console.error('Error creating sync record:', syncRecordError);
          continue; // Move to next channel if we can't log this one
        }

        // [Analysis] Fetch recent videos for each channel
        const videos = await fetchChannelVideos(channel.channel_id);
        console.log(`Found ${videos.length} videos for channel ${channel.channel_name}`);
        
        // [Analysis] Process each video
        const processedVideos = [];
        for (const video of videos) {
          const processed = await processVideo(video, channel, supabaseClient);
          processedVideos.push(processed);
        }

        // [Analysis] Update sync history record with success status
        await supabaseClient
          .from('sync_history')
          .update({ 
            sync_status: 'success',
            videos_processed: processedVideos.length
          })
          .eq('id', syncRecord.id);

        // [Analysis] Update last sync timestamp - critical fix
        const { error: updateError } = await supabaseClient
          .from('ai_news_youtube_sources')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', channel.id);

        if (updateError) {
          console.error(`Error updating last_synced_at for channel ${channel.channel_name}:`, updateError);
        } else {
          console.log(`Successfully updated last_synced_at for channel ${channel.channel_name}`);
        }

        results.push({
          channel_id: channel.channel_id,
          channel_name: channel.channel_name,
          videos_processed: processedVideos.length,
          status: 'success'
        });

        syncDetails.push({
          channel_id: channel.channel_id,
          processed_videos: processedVideos
        });

      } catch (error) {
        console.error(`Error processing channel ${channel.channel_name}:`, error);
        
        // [Analysis] Update sync history record with failure
        await supabaseClient
          .from('sync_history')
          .update({ 
            sync_status: 'failed',
            error_message: error.message || 'Unknown error during sync'
          })
          .eq('channel_id', channel.channel_id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        results.push({
          channel_id: channel.channel_id,
          channel_name: channel.channel_name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results,
      details: syncDetails
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
  console.log(`Fetching videos for channel ID: ${channelId}`);
  
  const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!youtubeApiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&` +
      `key=${youtubeApiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`YouTube API error (${response.status}):`, errorText);
      throw new Error(`YouTube API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully retrieved ${data.items?.length || 0} videos from YouTube API`);
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching channel videos for ${channelId}:`, error);
    throw error;
  }
}

async function processVideo(video: any, channel: any, supabaseClient: any) {
  try {
    const videoId = video.id.videoId;
    console.log(`Processing video: ${videoId} - ${video.snippet.title}`);
    
    // [Analysis] Check if video already processed
    const { data: existing, error: existingError } = await supabaseClient
      .from('ai_news_video_processing')
      .select('*')
      .eq('video_id', videoId)
      .maybeSingle();

    if (existingError) {
      console.error(`Error checking existing processing record for ${videoId}:`, existingError);
    }

    if (existing) {
      console.log(`Video ${videoId} already in processing queue, status: ${existing.status}`);
      return { status: 'already_queued', videoId };
    }

    // [Analysis] Create processing record for the video
    const { data: processingRecord, error: insertError } = await supabaseClient
      .from('ai_news_video_processing')
      .insert({
        video_id: videoId,
        status: 'pending',
        source_id: channel.id,
        processing_metadata: {
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          channelTitle: video.snippet.channelTitle,
          channelId: channel.channel_id
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error(`Error creating processing record for ${videoId}:`, insertError);
      throw insertError;
    }

    console.log(`Successfully queued video ${videoId} for processing`);
    return { 
      status: 'queued', 
      videoId, 
      processingId: processingRecord.id 
    };
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}
