// Import required modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const EVENT_REGISTRY_API_KEY = Deno.env.get('EVENT_REGISTRY_API_KEY') || '';
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY') || '';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Required environment variables are missing");
}

// [Analysis] Create a Supabase client with the service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// [Framework] Handler function to process incoming requests
serve(async (req) => {
  console.log("Request received:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body with default values for AI-specific news
    const { 
      keyword = "artificial intelligence", 
      limit = 50,
      testMode = true, 
      source = "event_registry",
      debug = false // [Analysis] Added debug flag for additional logging
    } = await req.json();
    
    console.log(`Processing request with parameters:`, { keyword, limit, testMode, source, debug });
    
    // Validate inputs
    if (!keyword) {
      throw new Error("Keyword is required");
    }
    
    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new Error("Limit must be a number between 1 and 100");
    }
    
    // Fetch articles based on selected source
    let articles = [];
    let errorMessages = [];
    
    if (source === "event_registry") {
      if (!EVENT_REGISTRY_API_KEY) {
        throw new Error("Event Registry API key is not configured");
      }
      
      console.log("Fetching articles from Event Registry with simplified filters");
      const eventRegistryArticles = await fetchFromEventRegistry(keyword, limit, debug);
      articles = eventRegistryArticles;
    } else if (source === "news_api") {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }
      
      console.log("Fetching articles from News API with simplified filters");
      const newsApiArticles = await fetchFromNewsAPI(keyword, limit, debug);
      articles = newsApiArticles;
    } else {
      throw new Error(`Invalid source: ${source}`);
    }
    
    console.log(`Fetched ${articles.length} articles from ${source}`);
    
    // If test mode is enabled, return the articles without saving
    if (testMode) {
      console.log("Test mode enabled, returning articles without saving");
      
      // Sample an article to log
      if (articles.length > 0) {
        console.log("Sample article:", JSON.stringify(articles[0]));
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully retrieved ${articles.length} articles from ${source}`,
          count: articles.length,
          articles: articles,
          errors: errorMessages
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Save articles to database if not in test mode
    console.log("Saving articles to database...");
    
    const importResults = await saveArticlesToDatabase(articles);
    
    console.log("Import results:", importResults);
    
    return new Response(
      JSON.stringify({
        success: importResults.success,
        message: importResults.message,
        count: importResults.count,
        errors: importResults.errors,
        articles: articles
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error: ${error.message}`,
        count: 0,
        errors: [{ error: error.message }],
        articles: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// [Analysis] Simplified function to fetch articles from Event Registry API
async function fetchFromEventRegistry(keyword, limit, debug = false) {
  try {
    console.log(`Fetching from Event Registry with basic filtering: "${keyword}" and limit ${limit}`);
    
    // Build the Event Registry API URL with parameters
    const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
    
    // [Analysis] Simplified request body with basic filtering parameters 
    const requestBody = {
      action: "getArticles",
      // Use simpler keyword approach
      keyword: keyword,
      
      // Set additional parameters for quality and freshness
      articlesPage: 1,
      articlesCount: limit,
      articlesSortBy: "date", // Sort by date to get newest articles
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1, // Get full article content
      resultType: "articles",
      dataType: ["news", "blog"],
      apiKey: EVENT_REGISTRY_API_KEY,
      forceMaxDataTimeWindow: 31, // Limit to last month for freshness
      lang: "eng", // English articles only
      
      // Include additional metadata for better processing
      includeArticleConcepts: true,
      includeArticleCategories: true,
      includeArticleSentiment: true,
      isDuplicateFilter: "skipDuplicates", // Filter out duplicate content
    };
    
    // Log request for debugging
    if (debug) {
      console.log("Event Registry API request:", JSON.stringify(requestBody, null, 2));
    }
    
    // Make the request to Event Registry
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Event Registry API error:", errorText);
      throw new Error(`Event Registry API returned ${response.status}: ${errorText}`);
    }
    
    // Parse the response JSON
    const data = await response.json();
    
    // Log the raw response for debugging
    if (debug) {
      console.log("Event Registry API raw response:", JSON.stringify(data, null, 2));
    }
    
    // Check if the response contains articles
    if (!data.articles || !data.articles.results) {
      console.warn("No articles found in Event Registry response");
      return [];
    }
    
    console.log(`Retrieved ${data.articles.results.length} raw articles from Event Registry`);
    
    // Transform and filter articles
    const transformedArticles = data.articles.results.map(article => {
      // Extract concepts to determine AI relevance
      const concepts = article.concepts || [];
      const aiTerms = ["artificial intelligence", "ai", "machine learning", "neural network", 
                       "deep learning", "llm", "chatgpt", "gpt", "openai"];
      
      // Simple relevance check - just see if title or content contains AI terms
      const title = article.title?.toLowerCase() || "";
      const body = article.body?.toLowerCase() || "";
      
      // Calculate a simple AI relevance score (0-100)
      let aiRelevanceScore = 0;
      
      // Check title for AI terms (higher weight)
      aiTerms.forEach(term => {
        if (title.includes(term)) {
          aiRelevanceScore += 30; // Higher weight for title matches
        } 
        if (body.includes(term)) {
          aiRelevanceScore += 10; // Lower weight for body matches
        }
      });
      
      // Cap at 100
      aiRelevanceScore = Math.min(100, aiRelevanceScore);
      
      // Determine impact based on title
      let impact = "medium";
      const highImpactTerms = ["revolutionary", "breakthrough", "major", "groundbreaking"];
      if (highImpactTerms.some(term => title.includes(term))) {
        impact = "high";
      }
      
      // Determine technical complexity based on content
      const technicalTerms = ["algorithm", "neural network", "parameters", "training", "dataset"];
      const technicalCount = technicalTerms.reduce((count, term) => {
        return count + ((body.match(new RegExp(term, 'g')) || []).length);
      }, 0);
      
      const technicalComplexity = technicalCount > 5 ? "advanced" : 
                                 technicalCount > 2 ? "intermediate" : "basic";
      
      // Parse categories to determine appropriate category
      const categories = article.categories || [];
      let category = determineCategory(title, body, categories);
      
      // Calculate reading time based on content length
      const wordCount = (body.match(/\S+/g) || []).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        title: article.title,
        description: article.body ? article.body.substring(0, 300) + "..." : "",
        content: article.body || "",
        url: article.url || "",
        image_url: article.image || "",
        source: article.source?.title || extractDomainFromUrl(article.url) || "Event Registry",
        date: article.date || new Date().toISOString().split('T')[0],
        category,
        impact,
        technical_complexity: technicalComplexity,
        estimated_reading_time: readingTime,
        source_credibility: article.source?.ranking?.importanceRank < 50 ? "verified" : "standard",
        article_type: "news",
        ai_relevance_score: aiRelevanceScore
      };
    });
    
    // [Analysis] Less strict filtering - include anything with minimal AI relevance
    return transformedArticles.filter(article => {
      const title = article.title.toLowerCase();
      // Keep article if it has ANY AI relevance or AI in the title
      return article.ai_relevance_score > 0 || 
             title.includes("ai") ||
             title.includes("artificial intelligence") ||
             title.includes("machine learning");
    });
    
  } catch (error) {
    console.error("Error fetching from Event Registry:", error);
    throw error;
  }
}

// [Analysis] Simplified function to fetch articles from News API
async function fetchFromNewsAPI(keyword, limit, debug = false) {
  try {
    console.log(`Fetching from News API with basic filtering: "${keyword}" and limit ${limit}`);
    
    // Build the News API URL with parameters
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // [Analysis] Create a simpler query for AI news
    const aiQuery = encodeURIComponent(`"artificial intelligence" OR "ai" OR "machine learning"`);
    
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", aiQuery);
    url.searchParams.append("from", fromDate);
    url.searchParams.append("to", toDate);
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("language", "en");
    url.searchParams.append("pageSize", limit.toString());
    url.searchParams.append("page", "1");
    
    // Log request for debugging
    if (debug) {
      console.log("News API request:", url.toString());
    }
    
    // Make the request to News API
    const response = await fetch(url, {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("News API error:", errorText);
      throw new Error(`News API returned ${response.status}: ${errorText}`);
    }
    
    // Parse the response JSON
    const data = await response.json();
    
    // Log the raw response for debugging
    if (debug) {
      console.log("News API raw response:", JSON.stringify(data, null, 2));
    }
    
    // Check if the response contains articles
    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn("No articles found in News API response");
      return [];
    }
    
    console.log(`Retrieved ${data.articles.length} raw articles from News API`);
    
    // Transform articles
    return data.articles.map((article, index) => {
      // Combine title and description for text analysis
      const combinedText = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
      
      // Simple AI relevance check
      const aiTerms = ["artificial intelligence", "ai", "machine learning", "neural network", 
                       "deep learning", "llm", "chatgpt", "gpt", "openai"];
      
      // Calculate a simple AI relevance score (0-100)
      let aiRelevanceScore = 0;
      
      // Check combined text for AI terms
      aiTerms.forEach(term => {
        if (combinedText.includes(term)) {
          aiRelevanceScore += 20;
        }
      });
      
      // Cap at 100
      aiRelevanceScore = Math.min(100, aiRelevanceScore);
      
      // Determine category based on content
      let category = determineCategory(article.title || '', article.description || '', []);
      
      // Determine impact based on title
      let impact = "medium";
      const highImpactTerms = ["revolutionary", "breakthrough", "major", "groundbreaking"];
      if (highImpactTerms.some(term => combinedText.includes(term))) {
        impact = "high";
      }
      
      // Calculate reading time based on content length
      const content = article.content || article.description || "";
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // Extract domain for source
      const source = article.source?.name || extractDomainFromUrl(article.url);
      
      return {
        title: article.title,
        description: article.description || "",
        content: article.content || article.description || "",
        url: article.url || "",
        image_url: article.urlToImage || "",
        source: source,
        date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        category,
        impact,
        technical_complexity: "intermediate", // Default value
        estimated_reading_time: readingTime,
        source_credibility: "standard",
        article_type: "news",
        ai_relevance_score: aiRelevanceScore,
        featured: (index === 0) // Feature first article
      };
    }).filter(article => {
      // [Analysis] Less strict filtering - include anything with minimal AI relevance
      const title = article.title.toLowerCase();
      return article.ai_relevance_score > 0 || 
             title.includes("ai") ||
             title.includes("artificial intelligence") ||
             title.includes("machine learning");
    });
    
  } catch (error) {
    console.error("Error fetching from News API:", error);
    throw error;
  }
}

// [Analysis] Helper function to extract domain from URL
function extractDomainFromUrl(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    console.error("Error extracting domain from URL:", e);
    return null;
  }
}

// [Analysis] Helper function to determine appropriate category
function determineCategory(title, content, apiCategories) {
  title = title.toLowerCase();
  content = content.toLowerCase();
  
  // Default category
  let category = "breakthrough_technologies";
  
  // Check for business/industry terms
  if (
    title.includes("business") || 
    title.includes("company") || 
    title.includes("startup") ||
    content.includes("industry") || 
    content.includes("market")
  ) {
    category = "industry_applications";
  }
  
  // Check for research terms
  else if (
    title.includes("research") || 
    title.includes("study") || 
    title.includes("paper") ||
    content.includes("university") || 
    content.includes("researchers")
  ) {
    category = "research_papers";
  }
  
  // Check for ethics terms
  else if (
    title.includes("ethics") || 
    title.includes("bias") || 
    title.includes("policy") ||
    content.includes("regulation") || 
    content.includes("governance")
  ) {
    category = "ai_ethics";
  }
  
  // Try to use API categories if available
  if (apiCategories && apiCategories.length > 0) {
    const categoryStr = JSON.stringify(apiCategories).toLowerCase();
    if (categoryStr.includes("business") || categoryStr.includes("economy")) {
      category = "industry_applications";
    } else if (categoryStr.includes("science") || categoryStr.includes("research")) {
      category = "research_papers";
    } else if (categoryStr.includes("ethics") || categoryStr.includes("policy")) {
      category = "ai_ethics";
    }
  }
  
  return category;
}

// [Analysis] Function to save articles to the database
async function saveArticlesToDatabase(articles) {
  console.log(`Attempting to save ${articles.length} articles to the database`);
  
  if (!articles || articles.length === 0) {
    return {
      success: true,
      message: "No articles to import",
      count: 0,
      errors: []
    };
  }
  
  const successfulImports = [];
  const errors = [];
  
  // Update the last_fetched timestamp in the news_sources table first
  try {
    const source_type = articles[0].source.toLowerCase().includes('eventregistry') ? 'event_registry' : 'news_api';
    
    const { error: sourceUpdateError } = await supabase
      .from('news_sources')
      .upsert([
        {
          source_type: source_type,
          last_fetched_at: new Date().toISOString()
        }
      ]);
    
    if (sourceUpdateError) {
      console.warn("Could not update news_sources timestamp:", sourceUpdateError);
      // Continue with the import even if we couldn't update the timestamp
    }
    
    // Process each article and import it to the database
    for (const article of articles) {
      try {
        // Check for duplicates - don't import the same article twice
        const { data: existingArticle, error: duplicateCheckError } = await supabase
          .from('ai_news')
          .select('id, title, url')
          .or(`title.eq."${article.title}",url.eq."${article.url}"`)
          .maybeSingle();
        
        if (duplicateCheckError) {
          console.warn("Error checking for duplicates:", duplicateCheckError);
        }
        
        if (existingArticle) {
          // Skip importing duplicate articles
          console.log(`Skipping duplicate article: ${article.title}`);
          continue;
        }
        
        // Prepare the article data for insertion
        const articleData = {
          title: article.title,
          description: article.description,
          content: article.content,
          date: article.date,
          category: article.category,
          article_type: article.article_type || 'news',
          image_url: article.image_url,
          source: article.source,
          url: article.url,
          source_credibility: article.source_credibility,
          technical_complexity: article.technical_complexity,
          impact: article.impact,
          estimated_reading_time: article.estimated_reading_time,
          featured: article.featured || false,
          // Additional AI-specific metadata
          status: 'published',
          created_at: new Date().toISOString(),
          // Optional fields if available
          views: 0,
          bookmarks: 0
        };
        
        // Insert the article into the database
        const { data, error } = await supabase
          .from('ai_news')
          .insert([articleData])
          .select('id')
          .single();
        
        if (error) {
          console.error("Error inserting article:", error);
          errors.push({
            title: article.title,
            error: error.message
          });
          continue;
        }
        
        console.log(`Successfully imported article: ${article.title}`);
        successfulImports.push(data.id);
        
      } catch (error) {
        console.error("Error processing article for database:", error);
        errors.push({
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `Successfully imported ${successfulImports.length} articles`,
      count: successfulImports.length,
      errors: errors
    };
    
  } catch (error) {
    console.error("Error in article import process:", error);
    return {
      success: false,
      message: `Error importing articles: ${error.message}`,
      count: successfulImports.length,
      errors: [...errors, { error: error.message }]
    };
  }
}
