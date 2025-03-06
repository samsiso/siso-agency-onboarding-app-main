
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const newsApiKey = Deno.env.get("NEWS_API_KEY")!;

interface RequestBody {
  keyword: string;
  limit: number;
  testMode?: boolean;
  skipDuplicates?: boolean;
  deduplicationThreshold?: number; // New parameter to control sensitivity
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

// [Framework] Jaccard similarity function for more accurate title comparison
function jaccardSimilarity(str1: string, str2: string): number {
  // Normalize and tokenize strings
  const tokens1 = str1.toLowerCase().split(/\W+/).filter(s => s.length > 2);
  const tokens2 = str2.toLowerCase().split(/\W+/).filter(s => s.length > 2);
  
  // Create sets
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  // Find intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // Calculate union
  const union = new Set([...set1, ...set2]);
  
  // Return similarity ratio
  return intersection.size / union.size;
}

// [Analysis] Enhanced duplicate detection function with Jaccard similarity
async function isDuplicate(supabase: any, article: any, threshold = 0.7): Promise<{
  isDuplicate: boolean;
  duplicateOf?: string;
  similarity?: number;
  similarArticles?: any[];
}> {
  // Check by URL first (strongest signal)
  if (article.url) {
    const { data: urlMatch, error: urlError } = await supabase
      .from("ai_news")
      .select("id, title, source")
      .eq("url", article.url)
      .limit(1);
      
    if (urlError) {
      console.error("Error checking for URL duplicates:", urlError);
    } else if (urlMatch && urlMatch.length > 0) {
      return { 
        isDuplicate: true, 
        duplicateOf: urlMatch[0].id,
        similarity: 1.0 // Exact URL match is 100% similarity
      };
    }
  }
  
  // Get recent articles to check title similarity
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: recentArticles, error: recentError } = await supabase
    .from("ai_news")
    .select("id, title, source, url")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(100); // Reasonable limit for comparison
  
  if (recentError) {
    console.error("Error fetching recent articles:", recentError);
    return { isDuplicate: false };
  }
  
  if (!recentArticles || recentArticles.length === 0) {
    return { isDuplicate: false };
  }
  
  // Compare title similarity using Jaccard index
  const titleLower = article.title.toLowerCase();
  const similarityScores = recentArticles.map(existingArticle => ({
    id: existingArticle.id,
    title: existingArticle.title,
    source: existingArticle.source,
    url: existingArticle.url,
    similarity: jaccardSimilarity(titleLower, existingArticle.title.toLowerCase())
  }));
  
  // Sort by similarity score
  similarityScores.sort((a, b) => b.similarity - a.similarity);
  
  // Find highest similarity match above threshold
  const bestMatch = similarityScores[0];
  
  if (bestMatch && bestMatch.similarity >= threshold) {
    console.log(`Duplicate found: "${article.title}" is similar to "${bestMatch.title}" (${bestMatch.similarity.toFixed(2)})`);
    
    // Collect similar articles for grouping
    const similarArticles = similarityScores
      .filter(item => item.similarity >= threshold * 0.8) // Include slightly less similar articles too
      .slice(0, 5); // Limit to top 5 similar articles
    
    return { 
      isDuplicate: true, 
      duplicateOf: bestMatch.id,
      similarity: bestMatch.similarity,
      similarArticles: similarArticles
    };
  }
  
  return { isDuplicate: false };
}

// [Analysis] Process News API response into standardized news format
async function processNewsApiArticles(
  articles: any[],
  supabase: any,
  skipDuplicates: boolean = true,
  deduplicationThreshold: number = 0.7
): Promise<{
  added: number;
  updated: number;
  duplicates: number;
  processedArticles: any[];
  duplicateGroups: Record<string, any[]>;
}> {
  let added = 0;
  let updated = 0;
  let duplicates = 0;
  const processedArticles = [];
  const duplicateGroups: Record<string, any[]> = {};

  // First pass: check for duplicates and group them
  for (const article of articles) {
    try {
      // Enhanced duplicate detection
      const duplicateCheck = await isDuplicate(supabase, article, deduplicationThreshold);
      
      // Prepare reading time and technical complexity
      const wordCount = (article.content || "").split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Avg reading speed
      
      // Determine technical complexity based on content analysis
      const techTerms = ["neural network", "algorithm", "transformer", "deep learning", "parameter"];
      const techContent = article.content?.toLowerCase() || article.description?.toLowerCase() || "";
      const techCount = techTerms.reduce((count: number, term: string) => {
        return count + (techContent.includes(term) ? 1 : 0);
      }, 0);
      const technicalComplexity = techCount > 3 ? "advanced" : techCount > 1 ? "intermediate" : "basic";

      const newsItem = {
        title: article.title,
        description: article.description || article.title,
        content: article.content || article.description || "",
        date: new Date(article.publishedAt).toISOString().split("T")[0],
        source: article.source?.name || "News API",
        category: "artificial intelligence",
        impact: "medium", // Default impact level
        reading_time: readingTime,
        technical_complexity: technicalComplexity,
        image_url: article.urlToImage || null,
        source_credibility: "verified",
        article_type: "news",
        status: "published",
        url: article.url || null,
        // Add duplicate information
        isDuplicate: duplicateCheck.isDuplicate,
        duplicateOf: duplicateCheck.duplicateOf,
        similarity: duplicateCheck.similarity,
        duplicateGroup: duplicateCheck.duplicateOf || null,
      };

      // Check if article already exists by title
      const { data: existingArticle } = await supabase
        .from("ai_news")
        .select("id, title")
        .eq("title", article.title)
        .maybeSingle();

      // Transform the article for the response
      const transformedArticle = {
        ...newsItem,
        id: existingArticle?.id || crypto.randomUUID(),
      };
      
      // Group duplicates
      if (duplicateCheck.isDuplicate && duplicateCheck.duplicateOf) {
        if (!duplicateGroups[duplicateCheck.duplicateOf]) {
          duplicateGroups[duplicateCheck.duplicateOf] = [];
        }
        duplicateGroups[duplicateCheck.duplicateOf].push(transformedArticle);
      }
      
      processedArticles.push(transformedArticle);

      // Skip duplicates if requested
      if (duplicateCheck.isDuplicate && skipDuplicates) {
        duplicates++;
        continue;
      }

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
      duplicates++; // Count failed processing as duplicates for now
    }
  }

  return { added, updated, duplicates, processedArticles, duplicateGroups };
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const startTime = Date.now();
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Validate API key availability
    if (!newsApiKey) {
      console.error("NEWS_API_KEY environment variable is not configured");
      throw new Error("News API key is not configured. Please add it to the edge function secrets.");
    }

    // Parse request body
    const { 
      keyword = "artificial intelligence", 
      limit = 10,
      testMode = false,
      skipDuplicates = true,
      deduplicationThreshold = 0.7 // Default threshold
    } = await req.json() as RequestBody;
    
    // Record the start of the fetch operation
    const historyId = await recordFetchHistory(supabase, "news_api", "started", {});
    
    // Fetch articles from News API
    const newsApiUrl = new URL("https://newsapi.org/v2/everything");
    
    const params = {
      q: keyword,
      apiKey: newsApiKey,
      language: "en",
      sortBy: "publishedAt",
      pageSize: limit.toString(),
    };
    
    Object.entries(params).forEach(([key, value]) => {
      newsApiUrl.searchParams.append(key, String(value));
    });
    
    console.log(`Fetching news from ${newsApiUrl.toString().replace(newsApiKey, "API_KEY_HIDDEN")}`);
    
    const response = await fetch(newsApiUrl.toString());
    const data = await response.json();
    
    if (!response.ok) {
      // Log detailed error information
      console.error(`News API error: Status ${response.status}, Message: ${data.message || response.statusText}`);
      console.error("Full response:", JSON.stringify(data));
      
      throw new Error(`News API error: ${data.message || response.statusText} (Status: ${response.status})`);
    }
    
    // Extract articles from response
    const articles = data.articles || [];
    console.log(`Received ${articles.length} articles from News API`);
    
    // Process and store articles with improved duplicate detection
    const { added, updated, duplicates, processedArticles, duplicateGroups } = await processNewsApiArticles(
      articles,
      supabase,
      skipDuplicates,
      deduplicationThreshold
    );
    
    // Only update database if not in test mode
    if (!testMode) {
      // Update news source last_fetched_at
      await supabase
        .from("news_sources")
        .update({ last_fetched_at: new Date().toISOString() })
        .eq("source_type", "news_api");
    }
    
    // Record the completion of the fetch operation
    await recordFetchHistory(supabase, "news_api", "completed", {
      articles_fetched: articles.length,
      articles_added: added,
      articles_updated: updated,
      duplicates_skipped: duplicates,
      execution_time_ms: Date.now() - startTime,
      metadata: {
        keyword,
        limit,
        testMode,
        skipDuplicates,
        deduplicationThreshold
      },
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        count: added,
        message: `Successfully synced ${added} new articles, updated ${updated} existing articles, skipped ${duplicates} duplicates.`,
        articles: testMode ? processedArticles : undefined,
        duplicateGroups: testMode ? duplicateGroups : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-news:", error);
    
    // Record the error
    const supabase = createClient(supabaseUrl, supabaseKey);
    await recordFetchHistory(supabase, "news_api", "error", {
      error_message: error.message,
    });
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
