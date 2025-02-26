import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const connection = await pool.connect();
    let result;

    try {
      // Get today's date
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      console.log(`Generating daily news summary for ${formattedDate}`);

      // Check if we already have a daily news post for today
      const { data: existingPost, error: checkError } = await supabaseAdmin
        .from('ai_news')
        .select('id')
        .eq('date', formattedDate)
        .eq('article_type', 'daily_brief')
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingPost) {
        return new Response(
          JSON.stringify({
            message: `Daily news already exists for ${formattedDate}`,
            postId: existingPost.id,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // Get news articles from today
      const { data: todaysArticles, error: articlesError } = await supabaseAdmin
        .from('ai_news')
        .select('*')
        .eq('date', formattedDate)
        .neq('article_type', 'daily_brief')
        .order('views', { ascending: false })
        .limit(5);

      if (articlesError) {
        throw articlesError;
      }

      if (!todaysArticles || todaysArticles.length === 0) {
        return new Response(
          JSON.stringify({
            message: `No articles found for ${formattedDate} to generate a daily brief`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      // Generate a summary of the day's news
      const articleTitles = todaysArticles.map(article => article.title).join("\n- ");
      
      // Find default banner template
      const { data: template, error: templateError } = await supabaseAdmin
        .from('banner_templates')
        .select('id')
        .eq('is_default', true)
        .eq('template_type', 'daily_brief')
        .maybeSingle();
        
      if (templateError) {
        throw templateError;
      }

      // Create the daily news post
      const dailyNewsPost = {
        title: `AI News Daily Brief: ${formattedDate}`,
        description: `A summary of the top AI news stories from ${formattedDate}`,
        content: `Here are today's top stories in AI:\n\n- ${articleTitles}`,
        date: formattedDate,
        category: 'daily_brief',
        article_type: 'daily_brief',
        status: 'published',
        source: 'SISO AI',
        source_credibility: 'verified',
        banner_template_id: template?.id || null,
        technical_complexity: 'intermediate',
        impact: 'medium',
        reading_time: 5,
      };

      // Insert the daily news post
      const { data: insertedPost, error: insertError } = await supabaseAdmin
        .from('ai_news')
        .insert(dailyNewsPost)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return new Response(
        JSON.stringify({
          message: `Daily news generated for ${formattedDate}`,
          post: insertedPost,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// [Analysis] Initialize Supabase Admin client to access the database
// Import and initialize the Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
