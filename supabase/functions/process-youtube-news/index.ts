
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { decode } from 'https://deno.land/std@0.208.0/encoding/base64.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchYouTubeTranscript(videoId: string) {
  // First try to get from YouTube's transcript API
  const transcriptUrl = `https://youtube.com/get_video_info?video_id=${videoId}`;
  const response = await fetch(transcriptUrl);
  const data = await response.text();
  
  // Parse the transcript data
  // This is a simplified version - we'll need to handle different formats
  const params = new URLSearchParams(data);
  const playerResponse = JSON.parse(params.get('player_response') || '{}');
  const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer;
  
  if (!captions) {
    throw new Error('No captions available for this video');
  }
  
  return captions;
}

async function identifyNewsSegments(transcript: string) {
  // [Analysis] Updated to use the specified gpt-4o-mini-2024-07-18 model
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-2024-07-18", // Updated model
      messages: [{
        role: "system",
        content: "You are an AI news analyzer. Identify distinct AI news stories from video transcripts. For each story, extract: title, description, start/end timestamps, technical complexity, and topic tags."
      }, {
        role: "user",
        content: transcript
      }],
      temperature: 0.3
    })
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

async function processVideo(videoId: string, channelId: string) {
  console.log(`Processing video ${videoId} from channel ${channelId}`);
  
  try {
    // 1. Fetch transcript
    const transcript = await fetchYouTubeTranscript(videoId);
    
    // 2. Identify news segments
    const segments = await identifyNewsSegments(transcript);
    
    // 3. Store segments and create news articles
    for (const segment of segments) {
      // Create news article
      const { data: article, error: articleError } = await supabase
        .from('ai_news')
        .insert({
          title: segment.title,
          description: segment.description,
          content: segment.transcript_text,
          technical_complexity: segment.technical_complexity,
          source: 'youtube',
          category: segment.topic_tags[0], // Primary topic
          impact: 'medium', // Default impact
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (articleError) throw articleError;

      // Store video segment
      const { error: segmentError } = await supabase
        .from('ai_news_video_segments')
        .insert({
          video_id: videoId,
          channel_id: channelId,
          start_time: segment.start_time,
          end_time: segment.end_time,
          transcript_text: segment.transcript_text,
          title: segment.title,
          description: segment.description,
          topic_tags: segment.topic_tags,
          technical_complexity: segment.technical_complexity,
          news_article_id: article.id
        });

      if (segmentError) throw segmentError;
    }

    return { success: true, processedSegments: segments.length };
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { videoId, channelId } = await req.json();
    
    if (!videoId || !channelId) {
      throw new Error('videoId and channelId are required');
    }

    const result = await processVideo(videoId, channelId);
    
    return new Response(
      JSON.stringify(result),
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
