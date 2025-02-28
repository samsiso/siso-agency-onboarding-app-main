
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// [Analysis] Define CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// [Analysis] Create Supabase client for database operations
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// [Analysis] Define Event Registry API request options
interface EventRegistryRequestOptions {
  keyword: string;
  limit?: number;
  testMode?: boolean;
}

serve(async (req) => {
  // [Analysis] Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // [Analysis] Parse request body for search parameters
    const { keyword = "artificial intelligence", limit = 20, testMode = false } = await req.json() as EventRegistryRequestOptions;
    
    console.log(`Processing fetch-ai-news request with keyword: ${keyword}, limit: ${limit}, testMode: ${testMode}`);

    // [Analysis] Get API key from environment variables
    const apiKey = Deno.env.get("EVENT_REGISTRY_API_KEY");
    if (!apiKey) {
      throw new Error("EVENT_REGISTRY_API_KEY is not set");
    }

    // [Analysis] Construct Event Registry API query
    const currentDate = new Date();
    // Default to past 3 days for test mode, 2 weeks for normal mode
    const pastDays = testMode ? 3 : 14;
    const dateFrom = new Date(currentDate);
    dateFrom.setDate(currentDate.getDate() - pastDays);

    // [Analysis] Format dates in the required format (YYYY-MM-DD)
    const dateToStr = currentDate.toISOString().split("T")[0];
    const dateFromStr = dateFrom.toISOString().split("T")[0];

    // [Analysis] Build Event Registry API URL with search parameters
    const url = `https://eventregistry.org/api/v1/article/getArticles`;
    const params = {
      action: "getArticles",
      keyword: keyword,
      articlesPage: 1,
      articlesCount: limit,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: "articles",
      dataType: ["news", "blog"],
      lang: "eng",
      dateStart: dateFromStr,
      dateEnd: dateToStr,
      apiKey: apiKey,
    };

    // [Analysis] Convert params to URL query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, String(value));
      }
    });

    console.log(`Fetching articles from Event Registry API for date range: ${dateFromStr} to ${dateToStr}`);
    
    // [Analysis] Make request to Event Registry API
    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Event Registry API error: ${response.status} ${errorText}`);
      throw new Error(`Event Registry API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.articles || !data.articles.results) {
      console.warn("No articles found in API response");
      return new Response(
        JSON.stringify({
          success: false,
          message: "No articles found in API response",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const articles = data.articles.results;
    console.log(`Retrieved ${articles.length} articles from Event Registry API`);
    
    // [Analysis] Logging first article for testing purposes
    if (articles.length > 0) {
      console.log("Sample article:", {
        title: articles[0].title,
        date: articles[0].date,
        source: articles[0].source.title,
      });
    }

    // Record fetch in history
    const { error: historyError } = await supabaseClient
      .from("news_fetch_history")
      .insert({
        source: "event_registry",
        keyword,
        count: articles.length,
        params: {
          dateStart: dateFromStr,
          dateEnd: dateToStr,
          limit,
        },
        success: true,
      });

    if (historyError) {
      console.error("Error recording fetch history:", historyError);
    }

    // [Analysis] Also update last_fetched_at in news_sources table
    const { error: sourceUpdateError } = await supabaseClient
      .from("news_sources")
      .upsert({
        source_type: "event_registry",
        last_fetched_at: new Date().toISOString(),
        is_active: true,
      })
      .eq("source_type", "event_registry");

    if (sourceUpdateError) {
      console.error("Error updating news_sources:", sourceUpdateError);
    }

    // [Analysis] Transform articles to match our database schema
    const transformedArticles = articles.map((article: any) => ({
      title: article.title,
      url: article.url,
      source: article.source.title || "Event Registry",
      date: article.date,
      image_url: article.image || "",
      description: article.body || article.description || "",
      content: article.body || "",
      category: "ai_research",
      status: "published",
      author: article.author || "AI News",
      source_id: article.uri || "",
      updated_at: new Date().toISOString(),
    }));

    // In test mode, return the articles without inserting into the database
    if (testMode) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Articles retrieved successfully in test mode",
          count: transformedArticles.length,
          articles: transformedArticles,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // [Analysis] Insert articles into the database
    let insertedCount = 0;
    
    // [Analysis] Use for...of loop for better async handling
    for (const article of transformedArticles) {
      // Check if the article already exists by source_id
      const { data: existingArticle, error: checkError } = await supabaseClient
        .from("ai_news")
        .select("id")
        .eq("source_id", article.source_id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing article:", checkError);
        continue;
      }

      if (existingArticle) {
        console.log(`Article already exists: ${article.title}`);
        continue;
      }

      // Insert new article
      const { error: insertError } = await supabaseClient
        .from("ai_news")
        .insert(article);

      if (insertError) {
        console.error("Error inserting article:", insertError);
      } else {
        insertedCount++;
      }
    }

    console.log(`Inserted ${insertedCount} new articles into the database`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Retrieved ${articles.length} articles, inserted ${insertedCount} new articles`,
        count: insertedCount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-ai-news function:", error);
    
    // Record error in history
    await supabaseClient
      .from("news_fetch_history")
      .insert({
        source: "event_registry",
        success: false,
        error_message: error.message,
      });
      
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error fetching news: ${error.message}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
