
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
  try {
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
      const { data: existing, error: fetchError } = await supabase
        .from("news_fetch_history")
        .select("*")
        .eq("source_type", source)
        .eq("status", "pending")
        .order("fetch_time", { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error("Error fetching existing history record:", fetchError);
        return;
      }
      
      const historyId = existing?.[0]?.id;
      
      if (historyId) {
        const updateData: any = {
          status: status === "completed" ? "success" : "error",
          articles_fetched: metrics.articles_fetched || 0,
          articles_added: metrics.articles_added || 0,
          articles_updated: metrics.articles_updated || 0,
          duplicates_skipped: metrics.duplicates_skipped || 0,
          execution_time_ms: metrics.execution_time_ms || 0,
          error_message: metrics.error_message || null,
        };

        // Safely handle metadata by ensuring existing[0].metadata exists
        if (existing && existing[0] && existing[0].metadata) {
          updateData.metadata = {
            ...existing[0].metadata,
            completed_at: new Date().toISOString(),
            ...(metrics.metadata || {})
          };
        } else {
          updateData.metadata = {
            completed_at: new Date().toISOString(),
            ...(metrics.metadata || {})
          };
        }

        const { error } = await supabase
          .from("news_fetch_history")
          .update(updateData)
          .eq("id", historyId);

        if (error) console.error("Error updating fetch history:", error);
      } else {
        // If no pending record found, create a new one
        console.log("No pending record found, creating a new one");
        const { error } = await supabase
          .from("news_fetch_history")
          .insert({
            source_type: source,
            status: status === "completed" ? "success" : "error",
            articles_fetched: metrics.articles_fetched || 0,
            articles_added: metrics.articles_added || 0,
            articles_updated: metrics.articles_updated || 0,
            duplicates_skipped: metrics.duplicates_skipped || 0,
            execution_time_ms: metrics.execution_time_ms || 0,
            error_message: metrics.error_message || null,
            metadata: { 
              completed_at: new Date().toISOString(),
              ...(metrics.metadata || {})
            },
          });
  
        if (error) console.error("Error creating new fetch history record:", error);
      }
    }
  } catch (error) {
    console.error("Error in recordFetchHistory:", error);
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
  try {
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
  } catch (error) {
    console.error("Error in isDuplicate:", error);
    return { isDuplicate: false };
  }
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
        is_duplicate: duplicateCheck.isDuplicate,
        duplicate_of: duplicateCheck.duplicateOf,
        similarity_score: duplicateCheck.similarity,
      };

      // Check if article already exists by title
      const { data: existingArticle, error: existingError } = await supabase
        .from("ai_news")
        .select("id, title")
        .eq("title", article.title)
        .maybeSingle();
        
      if (existingError) {
        console.error("Error checking for existing article:", existingError);
      }

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
        const { error: updateError } = await supabase
          .from("ai_news")
          .update(newsItem)
          .eq("id", existingArticle.id);
          
        if (updateError) {
          console.error("Error updating article:", updateError);
        } else {
          updated++;
        }
      } else {
        // Insert new article
        const { error: insertError } = await supabase
          .from("ai_news")
          .insert(newsItem);
          
        if (insertError) {
          console.error("Error inserting article:", insertError);
        } else {
          added++;
        }
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
    
    // [Analysis] Added better API key validation
    if (!newsApiKey || newsApiKey === "undefined" || newsApiKey === "null") {
      console.error("NEWS_API_KEY environment variable is not configured or is invalid");
      throw new Error("News API key is not configured or is invalid. Please add a valid key to the edge function secrets.");
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json() as RequestBody;
    } catch (error) {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid request body. Please provide valid JSON.");
    }
    
    const { 
      keyword = "artificial intelligence", 
      limit = 10,
      testMode = false,
      skipDuplicates = true,
      deduplicationThreshold = 0.7 // Default threshold
    } = requestBody;
    
    // Record the start of the fetch operation
    console.log("Recording fetch history - start");
    try {
      await recordFetchHistory(supabase, "news_api", "started", {});
    } catch (recordError) {
      console.error("Failed to record fetch start history, but continuing:", recordError);
    }
    
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
    
    // Use a reasonable timeout for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(newsApiUrl.toString(), {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      // Check for HTTP errors first
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: "Could not parse error response" };
        }
        
        // Log detailed error information
        console.error(`News API error: Status ${response.status}, Message: ${errorData.message || response.statusText}`);
        
        // Special handling for common error codes
        let errorMessage = `News API error: ${errorData.message || response.statusText} (Status: ${response.status})`;
        
        if (response.status === 401) {
          errorMessage = "Invalid News API key. Please check your API key and make sure it's valid.";
        } else if (response.status === 429) {
          errorMessage = "News API rate limit exceeded. Please try again later or upgrade your plan.";
        } else if (response.status === 403) {
          errorMessage = "News API access is forbidden. Your key might be restricted.";
        }
        
        // Record the error
        try {
          await recordFetchHistory(supabase, "news_api", "error", {
            error_message: errorMessage,
            metadata: {
              status_code: response.status,
              api_response: errorData
            }
          });
        } catch (recordError) {
          console.error("Failed to record fetch error history:", recordError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Failed to parse API response. The service may be experiencing issues.");
      }
      
      // Additional validation of response format
      if (!data.articles || !Array.isArray(data.articles)) {
        const errorMessage = "Invalid response format from News API - missing 'articles' array";
        console.error(errorMessage, data);
        
        try {
          await recordFetchHistory(supabase, "news_api", "error", {
            error_message: errorMessage,
            metadata: { api_response: data }
          });
        } catch (recordError) {
          console.error("Failed to record fetch error history:", recordError);
        }
        
        throw new Error(errorMessage);
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
        try {
          // Update news source last_fetched_at
          await supabase
            .from("news_sources")
            .update({ last_fetched_at: new Date().toISOString() })
            .eq("source_type", "news_api");
        } catch (updateError) {
          console.error("Error updating news source last_fetched_at:", updateError);
        }
      }
      
      // Record the completion of the fetch operation
      try {
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
      } catch (recordError) {
        console.error("Failed to record fetch completion history:", recordError);
      }
      
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch operation failed:", fetchError);
      
      // Check if it's an abort error (timeout)
      if (fetchError.name === "AbortError") {
        throw new Error("News API request timed out. The service may be experiencing issues.");
      } else {
        throw fetchError; // Re-throw the error to be caught by the outer try/catch
      }
    }
  } catch (error) {
    console.error("Error in fetch-news:", error);
    
    // Record the error
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await recordFetchHistory(supabase, "news_api", "error", {
        error_message: error.message,
      });
    } catch (recordError) {
      console.error("Failed to record error in catch block:", recordError);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
