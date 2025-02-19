
import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateArticleContent(videoMetadata: any) {
  const prompt = `
    Create a detailed AI news article based on this YouTube video:
    Title: ${videoMetadata.title}
    Description: ${videoMetadata.description}

    Generate a comprehensive article that includes:
    1. An engaging title
    2. A brief description
    3. Key technical insights
    4. Industry impact analysis
    5. Future implications

    Format the response as a JSON object with the following structure:
    {
      "title": "Enhanced title",
      "description": "Brief overview",
      "content": "Main article content with proper formatting",
      "technical_complexity": "basic|intermediate|advanced",
      "impact": "low|medium|high",
      "category": "industry_applications|breakthrough_technologies|language_models|robotics_automation|international_developments"
    }
  `;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(completion.data.choices[0].message?.content || '{}');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get pending videos to process
    const { data: pendingVideos, error: fetchError } = await supabase
      .from('ai_news_video_processing')
      .select('*, ai_news_youtube_sources(*)')
      .eq('status', 'pending')
      .limit(5);

    if (fetchError) throw fetchError;

    for (const video of pendingVideos) {
      console.log(`Processing video: ${video.video_id}`);

      try {
        // Generate article content
        const articleContent = await generateArticleContent(video.processing_metadata);

        // Create new article
        const { data: article, error: articleError } = await supabase
          .from('ai_news')
          .insert({
            title: articleContent.title,
            description: articleContent.description,
            content: articleContent.content,
            technical_complexity: articleContent.technical_complexity,
            impact: articleContent.impact,
            category: articleContent.category,
            source: 'youtube',
            image_url: video.processing_metadata.thumbnailUrl,
            date: new Date(video.processing_metadata.publishedAt).toISOString(),
            status: 'published'
          })
          .select()
          .single();

        if (articleError) throw articleError;

        // Update processing status
        await supabase
          .from('ai_news_video_processing')
          .update({
            status: 'completed',
            article_id: article.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', video.id);

      } catch (error) {
        console.error(`Error processing video ${video.video_id}:`, error);
        
        // Update error status
        await supabase
          .from('ai_news_video_processing')
          .update({
            status: 'error',
            error_message: error.message,
            retry_count: video.retry_count + 1
          })
          .eq('id', video.id);
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in processing:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
