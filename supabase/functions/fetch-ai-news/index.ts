
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const eventRegistryApiKey = Deno.env.get("EVENT_REGISTRY_API_KEY")!;

interface RequestBody {
  keyword: string;
  limit: number;
}

// [Analysis] Create central function to track fetch operations with detailed metrics
async function recordFetchHistory(
  supabase: any,
  source: "event_registry" | "news_api",
  status: "started" | "completed" | "error",
  metrics: {
    articles_fetched?: number;
    articles_added?: number;
    articles_updated?: number;
    duplicates_skipped?: number;
    execution_time_ms?: number;
    error_message?: string;
    metadata?: any;
  }
) {
  if (status === "started") {
    const { data, error } = await supabase
      .from("news_fetch_history")
      .insert({
        source_type: source,
        status: "pending",
        metadata: { started_at: new Date().toISOString() },
      })
      .select();

    if (error) console.error("Error recording fetch start:", error);
    return data?.[0]?.id;
  } else {
    // Find the most recent pending record for this source
    const { data: existing } = await supabase
      .from("news_fetch_history")
      .select("*")
      .eq("source_type", source)
      .eq("status", "pending")
      .order("fetch_time", { ascending: false })
      .limit(1);

    const historyId = existing?.[0]?.id;
    
    if (historyId) {
      const { error } = await supabase
        .from("news_fetch_history")
        .update({
          status: status === "completed" ? "success" : "error",
          articles_fetched: metrics.articles_fetched || 0,
          articles_added: metrics.articles_added || 0,
          articles_updated: metrics.articles_updated || 0,
          duplicates_skipped: metrics.duplicates_skipped || 0,
          execution_time_ms: metrics.execution_time_ms || 0,
          error_message: metrics.error_message || null,
          metadata: { 
            ...existing[0].metadata,
            completed_at: new Date().toISOString(),
            ...metrics.metadata
          },
        })
        .eq("id", historyId);

      if (error) console.error("Error updating fetch history:", error);
    }
  }
}

// [Analysis] Process Event Registry response into standardized news format
async function processEventRegistryArticles(
  articles: any[],
  supabase: any
): Promise<{
  added: number;
  updated: number;
  duplicates: number;
}> {
  let added = 0;
  let updated = 0;
  let duplicates = 0;

  for (const article of articles) {
    try {
      // Check if article already exists
      const { data: existingArticle } = await supabase
        .from("ai_news")
        .select("id, title")
        .eq("title", article.title)
        .maybeSingle();

      // Default importance and standardize impact values
      const impact = article.eventImpact 
        ? (article.eventImpact > 70 ? "high" : article.eventImpact > 40 ? "medium" : "low")
        : "medium";
      
      // Prepare reading time and technical complexity
      const wordCount = (article.body || "").split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Avg reading speed
      
      // Determine technical complexity based on content analysis
      const techTerms = ["neural network", "algorithm", "transformer", "deep learning", "parameter"];
      const techCount = techTerms.reduce((count: number, term: string) => {
        return count + (article.body?.toLowerCase().includes(term) ? 1 : 0);
      }, 0);
      const technicalComplexity = techCount > 3 ? "advanced" : techCount > 1 ? "intermediate" : "basic";

      const newsItem = {
        title: article.title,
        description: article.summary || article.title,
        content: article.body || article.summary || "",
        date: new Date(article.dateTime).toISOString().split("T")[0],
        source: article.source?.title || "Event Registry",
        category: article.categories?.[0] || "artificial intelligence",
        impact,
        reading_time: readingTime,
        technical_complexity: technicalComplexity,
        image_url: article.image || null,
        source_credibility: "verified",
        article_type: "news",
        status: "published",
      };

      if (existingArticle) {
        // Update existing article
        await supabase
          .from("ai_news")
          .update(newsItem)
          .eq("id", existingArticle.id);
        updated++;
      } else {
        // Insert new article
        await supabase.from("ai_news").insert(newsItem);
        added++;
      }
    } catch (error) {
      console.error("Error processing article:", error);
      duplicates++;
    }
  }

  return { added, updated, duplicates };
}

serve(async (req) => {
  try {
    const startTime = Date.now();
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { keyword = "artificial intelligence", limit = 10 } = await req.json() as RequestBody;
    
    // Record the start of the fetch operation
    const historyId = await recordFetchHistory(supabase, "event_registry", "started", {});
    
    // Fetch articles from Event Registry
    const eventRegistryUrl = new URL("https://eventregistry.org/api/v1/article/getArticles");
    
    const params = {
      action: "getArticles",
      keyword,
      articlesCount: limit,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1, // Get full article body
      resultType: "articles",
      apiKey: eventRegistryApiKey,
      lang: "eng"
    };
    
    Object.entries(params).forEach(([key, value]) => {
      eventRegistryUrl.searchParams.append(key, String(value));
    });
    
    const response = await fetch(eventRegistryUrl.toString());
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Event Registry API error: ${data.error || response.statusText}`);
    }
    
    // Extract articles from response
    const articles = data.articles?.results || [];
    
    // Process and store articles
    const { added, updated, duplicates } = await processEventRegistryArticles(
      articles,
      supabase
    );
    
    // Update news source last_fetched_at
    await supabase
      .from("news_sources")
      .update({ last_fetched_at: new Date().toISOString() })
      .eq("source_type", "event_registry");
    
    // Record the completion of the fetch operation
    await recordFetchHistory(supabase, "event_registry", "completed", {
      articles_fetched: articles.length,
      articles_added: added,
      articles_updated: updated,
      duplicates_skipped: duplicates,
      execution_time_ms: Date.now() - startTime,
      metadata: {
        keyword,
        limit,
      },
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        count: added,
        message: `Successfully synced ${added} new articles, updated ${updated} existing articles.`,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-ai-news:", error);
    
    // Record the error
    const supabase = createClient(supabaseUrl, supabaseKey);
    await recordFetchHistory(supabase, "event_registry", "error", {
      error_message: error.message,
    });
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
