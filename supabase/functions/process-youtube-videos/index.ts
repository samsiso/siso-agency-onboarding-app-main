
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateArticleContent(videoMetadata: any) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable AI news article writer who creates detailed and engaging content about AI technology.'
          },
          {
            role: 'user',
            content: `Create a detailed AI news article based on this YouTube video:
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
              }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating article content:', error);
    throw error;
  }
}

serve(async (req) => {
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

    console.log(`Found ${pendingVideos?.length || 0} pending videos to process`);

    for (const video of pendingVideos || []) {
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

        console.log(`Successfully created article: ${article.id}`);

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
