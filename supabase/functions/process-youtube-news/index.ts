import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

    // [Analysis] First fetch video captions
    const transcript = await fetchVideoTranscript(videoId);
    
    if (!transcript) {
      throw new Error('No transcript available for this video');
    }

    // [Analysis] Process transcript into news segments
    const segments = await identifyNewsSegments(transcript);
    
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
    return transcript;

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

async function identifyNewsSegments(transcript: string) {
  // [Analysis] Use gpt-4o-mini for faster processing and cost efficiency
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: `You are an AI news analyzer specialized in identifying distinct AI news stories from video transcripts.
For each story segment, you must extract:
1. A clear, concise title
2. A brief description (2-3 sentences)
3. The key technical details discussed
4. Technical complexity level (basic, intermediate, advanced)
5. Relevant topic tags
6. Impact assessment for businesses

Format your response as a JSON array of story segments.`
      },
      {
        role: "user",
        content: transcript
      }],
      temperature: 0.5,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function processSegments(videoId: string, segments: string) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    // [Analysis] Parse segments data
    const parsedSegments = JSON.parse(segments);
    
    // [Analysis] Store each segment with metadata
    const insertPromises = parsedSegments.map(async (segment: any) => {
      const { data, error } = await supabaseClient
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
