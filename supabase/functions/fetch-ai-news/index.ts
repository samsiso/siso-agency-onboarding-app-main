
// fetch-ai-news/index.ts - Edge Function to fetch AI news from Event Registry API
import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Create a Supabase client with Admin access for database operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  // [Analysis] Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { keyword = "artificial intelligence", limit = 20, testMode = false } = requestData;

    console.log(`Fetching AI news for ${keyword}, limit: ${limit}, testMode: ${testMode}`);

    // Ensure limit is a valid number and between 1-50
    const validLimit = Math.min(Math.max(parseInt(String(limit), 10) || 20, 1), 50);

    // [Analysis] Get Event Registry API key from environment variable
    const eventRegistryApiKey = Deno.env.get('EVENT_REGISTRY_API_KEY');
    if (!eventRegistryApiKey) {
      throw new Error('EVENT_REGISTRY_API_KEY is not configured in environment variables');
    }

    // Current date and 30 days ago for date range (using UTC to avoid time zone issues)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Format dates for API call
    const dateEnd = today.toISOString().split('T')[0];
    const dateStart = thirtyDaysAgo.toISOString().split('T')[0];

    console.log(`Fetching news from ${dateStart} to ${dateEnd}`);

    // [Analysis] Construct Event Registry API URL with improved parameters for better relevance
    const apiUrl = 'https://eventregistry.org/api/v1/article/getArticles';
    const requestBody = {
      action: "getArticles",
      keyword: keyword,
      articlesPage: 1,
      articlesCount: validLimit,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: "articles",
      dataType: ["news", "blog"],
      apiKey: eventRegistryApiKey,
      lang: "eng",
      keywordOper: "and",
      dateStart: dateStart,
      dateEnd: dateEnd,
      forceMaxDataTimeWindow: 31,
      ignoreSourceUri: "", // Optional source exclusion
      sourceLocationUri: "", // Optional location filtering
      categoryUri: "", // Optional category filtering
      ignoreCategoryUri: "", // Optional category exclusion
      sourceUri: "", // Optional source inclusion
    };

    // [Analysis] Make request to Event Registry API with enhanced error handling
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event Registry API error:', response.status, errorText);
      throw new Error(`Event Registry API error: ${response.status} ${errorText}`);
    }

    // Parse API response
    const data = await response.json();

    if (!data || !data.articles || !data.articles.results) {
      console.error('Invalid response format from Event Registry API:', data);
      throw new Error('Invalid response format from Event Registry API');
    }

    const articles = data.articles.results;
    console.log(`Received ${articles.length} articles from Event Registry API`);

    // Test Mode - Return processed results without saving to database
    if (testMode) {
      // Transform articles to match our database schema
      const transformedArticles = articles.map((article: any) => ({
        id: article.uri,
        title: article.title,
        content: article.body || article.description || '',
        description: article.description || '',
        url: article.url || '',
        source: article.source?.title || 'Event Registry',
        author: article.authors?.join(', ') || 'Unknown',
        date: article.date || new Date().toISOString(),
        image_url: article.image || '',
        category: 'ai',
        status: 'published',
      }));

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Successfully retrieved ${transformedArticles.length} articles from Event Registry in test mode`, 
          count: transformedArticles.length,
          articles: transformedArticles
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normal Mode - Save to database
    // Track processed and skipped articles
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each article and insert into database if not exists
    for (const article of articles) {
      try {
        // Check if article already exists
        const { data: existingArticle } = await supabaseAdmin
          .from('ai_news')
          .select('id')
          .eq('url', article.url)
          .maybeSingle();

        if (existingArticle) {
          console.log(`Article already exists: ${article.title}`);
          skippedCount++;
          continue;
        }

        // Extract article data
        const newsItem = {
          title: article.title,
          content: article.body || article.description || '',
          description: article.description || '',
          url: article.url || '',
          source: article.source?.title || 'Event Registry',
          author: article.authors?.join(', ') || 'Unknown',
          date: article.date || new Date().toISOString(),
          image_url: article.image || '',
          category: 'ai', // Default category
          status: 'published',
          views: 0,
          bookmarks: 0,
          // Add more fields as needed for your schema
        };

        // Insert article into database
        const { error: insertError } = await supabaseAdmin
          .from('ai_news')
          .insert([newsItem]);

        if (insertError) {
          console.error(`Error inserting article ${article.title}:`, insertError);
          errorCount++;
          continue;
        }

        insertedCount++;
      } catch (error) {
        console.error(`Error processing article ${article.title}:`, error);
        errorCount++;
      }
    }

    // Update the news_sources table to record the last fetch time
    await supabaseAdmin
      .from('news_sources')
      .upsert([
        {
          source_type: 'event_registry',
          last_fetched_at: new Date().toISOString(),
          articles_fetched: insertedCount,
          status: 'success'
        }
      ], { onConflict: 'source_type' });

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${articles.length} articles. Inserted: ${insertedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`,
        count: insertedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // [Analysis] Enhanced error handling with detailed error information
    console.error('Error fetching AI news:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Error fetching AI news: ${error instanceof Error ? error.message : String(error)}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
