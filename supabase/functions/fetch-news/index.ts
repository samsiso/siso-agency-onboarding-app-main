
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

// [Analysis] Using environment variables to maintain security
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const newsApiKey = Deno.env.get('NEWS_API_KEY') ?? '';

// [Analysis] Initialize Supabase client with admin privileges to write to database
const supabase = createClient(supabaseUrl, supabaseKey);

// [Analysis] Define CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Main server handler using Deno's serve API
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { keyword = "artificial intelligence", limit = 10 } = await req.json();

    console.log(`Fetching news for keyword: ${keyword}, limit: ${limit}`);

    // [Analysis] Validate request parameters
    if (!keyword) {
      throw new Error("Keyword parameter is required");
    }

    // [Analysis] Calculate date range - last 30 days
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30);

    // Format dates for API query
    const fromDateStr = fromDate.toISOString().split('T')[0];
    const toDateStr = today.toISOString().split('T')[0];

    // [Analysis] Build News API URL with parameters 
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', keyword);
    url.searchParams.append('from', fromDateStr);
    url.searchParams.append('to', toDateStr);
    url.searchParams.append('language', 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', limit.toString());

    console.log(`Requesting: ${url.toString()}`);

    // [Analysis] Fetch news from News API
    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': newsApiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("News API error:", errorData);
      throw new Error(`News API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log(`Received ${data.articles?.length || 0} articles from News API`);

    // [Analysis] Transform News API response to match our database schema
    const articles = data.articles.map((article: any) => {
      // Extract date without time
      const publishDate = article.publishedAt 
        ? article.publishedAt.split('T')[0]
        : new Date().toISOString().split('T')[0];

      // [Analysis] Calculate reading time based on content length
      const wordCount = (article.content || article.description || '').split(' ').length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      return {
        title: article.title,
        description: article.description || article.title,
        content: article.content || article.description,
        date: publishDate,
        category: 'artificial_intelligence',
        impact: 'medium',
        source: article.source.name,
        source_credibility: 'verified',
        image_url: article.urlToImage,
        technical_complexity: 'intermediate',
        article_type: 'news',
        reading_time: readingTime,
        views: 0,
        bookmarks: 0,
        status: 'published',
        url: article.url, // Store original URL for reference
      };
    });

    // [Analysis] Start database transaction to save articles in batch
    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        // Check if article already exists (by title to avoid duplicates)
        const { data: existingArticle } = await supabase
          .from('ai_news')
          .select('id')
          .eq('title', article.title)
          .maybeSingle();

        if (existingArticle) {
          console.log(`Article already exists: ${article.title}`);
          continue;
        }

        // Insert new article
        const { error } = await supabase
          .from('ai_news')
          .insert([article]);

        if (error) {
          console.error("Error inserting article:", error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error("Error processing article:", error);
        errorCount++;
      }
    }

    // [Analysis] Update last_fetched timestamp in news_sources
    await supabase
      .from('news_sources')
      .update({ last_fetched_at: new Date().toISOString() })
      .eq('source_type', 'news_api');

    return new Response(
      JSON.stringify({
        success: true,
        source: 'news_api',
        count: successCount,
        errored: errorCount,
        message: `Imported ${successCount} articles from News API`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Function error:", error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        source: 'news_api',
        error: error.message,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
