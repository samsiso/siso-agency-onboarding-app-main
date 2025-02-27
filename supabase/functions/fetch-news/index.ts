
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY") || "";

interface FetchNewsOptions {
  keyword?: string;
  limit?: number;
}

serve(async (req) => {
  // [Analysis] Handle CORS for browser requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // [Analysis] Parse request body for parameters
    const { keyword = "artificial intelligence", limit = 20 } = await req.json() as FetchNewsOptions;

    // [Analysis] Validate API key
    if (!NEWS_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, message: "News API key not configured" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    console.log(`Fetching news for keyword: ${keyword}, limit: ${limit}`);

    // [Analysis] Use News API "everything" endpoint for comprehensive results
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", keyword);
    url.searchParams.append("language", "en");
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        "X-Api-Key": NEWS_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`News API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `News API request failed: ${response.status} ${response.statusText}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status 
        }
      );
    }

    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid response from News API" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    console.log(`Received ${data.articles.length} articles from News API`);

    // [Analysis] Transform News API format to our app's format
    const { supabaseClient } = await import("../_shared/supabase-client.ts");

    // [Analysis] Get our News API source record from database
    const { data: newsSource, error: sourceError } = await supabaseClient
      .from('news_sources')
      .select('*')
      .eq('source_type', 'news_api')
      .single();

    if (sourceError) {
      console.error("Error fetching News API source record:", sourceError);
    }

    // [Analysis] Process and insert articles
    const articles = data.articles.map(article => ({
      title: article.title,
      description: article.description || article.title,
      content: article.content,
      source: article.source.name,
      category: 'AI Technology', // Default category
      date: new Date(article.publishedAt).toISOString().split('T')[0],
      image_url: article.urlToImage,
      impact: 'Medium', // Default impact
      status: 'published',
      technical_complexity: 'intermediate',
      source_credibility: 'verified',
      article_type: 'news',
      url: article.url,
      created_at: new Date().toISOString()
    }));

    let importCount = 0;

    // [Analysis] Insert articles in batches to avoid statement limits
    for (let i = 0; i < articles.length; i += 10) {
      const batch = articles.slice(i, i + 10);
      const { data: insertedArticles, error: insertError } = await supabaseClient
        .from('ai_news')
        .upsert(batch, { 
          onConflict: 'title',
          ignoreDuplicates: true 
        })
        .select();

      if (insertError) {
        console.error(`Error inserting articles batch ${i / 10 + 1}:`, insertError);
      } else {
        importCount += insertedArticles?.length || 0;
      }
    }

    // [Analysis] Update the last_fetched_at timestamp for the News API source
    if (newsSource) {
      await supabaseClient
        .from('news_sources')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', newsSource.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: importCount,
        message: `Imported ${importCount} articles from News API` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error processing News API request:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
