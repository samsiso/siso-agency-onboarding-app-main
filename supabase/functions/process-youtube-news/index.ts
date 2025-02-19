
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // [Analysis] Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();

    if (!videoId) {
      throw new Error('VideoId is required');
    }

    console.log('Processing video:', videoId);

    // [Analysis] First fetch video captions
    const transcript = await fetchVideoTranscript(videoId);
    
    if (!transcript) {
      throw new Error('No transcript available for this video');
    }

    console.log('Transcript retrieved, processing segments...');

    // [Analysis] Process transcript into news segments
    const segments = await identifyNewsSegments(transcript);
    
    console.log('Segments identified:', segments);

    // [Analysis] Store results in Supabase
    const processedSegments = await processSegments(videoId, segments);

    return new Response(JSON.stringify({ 
      success: true, 
      transcript,
      segments: processedSegments 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing YouTube news:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchVideoTranscript(videoId: string): Promise<string | null> {
  try {
    // [Analysis] First get video details including caption tracks
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,contentDetails&id=${videoId}&` +
      `key=${Deno.env.get('YOUTUBE_API_KEY')}`
    );

    const videoDetails = await videoDetailsResponse.json();
    console.log('Video details retrieved:', videoDetails.items?.[0]?.snippet?.title);
    
    // [Analysis] Get caption tracks for the video
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?` +
      `part=snippet&videoId=${videoId}&` +
      `key=${Deno.env.get('YOUTUBE_API_KEY')}`
    );

    const captionsData = await captionsResponse.json();
    console.log('Captions data:', captionsData);

    if (!captionsData.items || captionsData.items.length === 0) {
      throw new Error('No captions found for this video');
    }

    // [Analysis] Get English captions preferably
    const captionTrack = captionsData.items.find(
      (track: any) => track.snippet.language === 'en'
    ) || captionsData.items[0];

    // [Analysis] Fetch the actual transcript
    const transcriptResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionTrack.id}?` +
      `key=${Deno.env.get('YOUTUBE_API_KEY')}`, {
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (!transcriptResponse.ok) {
      console.error('Transcript fetch error:', await transcriptResponse.text());
      throw new Error('Failed to fetch transcript');
    }

    const transcript = await transcriptResponse.text();
    console.log('Transcript retrieved successfully');
    return transcript;

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

async function identifyNewsSegments(transcript: string) {
  try {
    // [Analysis] Use GPT-4 for accurate news story identification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `You are an AI news analyzer. Extract distinct AI news stories from video transcripts.
For each story segment, provide:
1. Title (clear, concise)
2. Brief description (2-3 sentences)
3. Key technical details
4. Technical complexity (basic/intermediate/advanced)
5. Topic tags
6. Business impact assessment

Format response as a JSON array of story segments.`
        },
        {
          role: "user",
          content: transcript
        }],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process with GPT-4');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in identifyNewsSegments:', error);
    throw error;
  }
}

async function processSegments(videoId: string, segments: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // [Analysis] Parse segments data
    const parsedSegments = JSON.parse(segments);
    
    // [Analysis] Store each segment with metadata
    const insertPromises = parsedSegments.map(async (segment: any) => {
      const { data, error } = await supabase
        .from('ai_news_video_segments')
        .insert({
          video_id: videoId,
          title: segment.title,
          description: segment.description,
          technical_complexity: segment.complexity,
          topic_tags: segment.tags,
          transcript_text: segment.content,
          confidence_score: 0.8, // [Plan] Implement dynamic confidence scoring
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    });

    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error processing segments:', error);
    throw error;
  }
}
