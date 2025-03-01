
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
    // Parse request body
    const { keyword = "artificial intelligence", limit = 10, testMode = true, source = "event_registry" } = await req.json();
    
    console.log(`Processing request with parameters:`, { keyword, limit, testMode, source });
    
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
      
      console.log("Fetching articles from Event Registry");
      const eventRegistryArticles = await fetchFromEventRegistry(keyword, limit);
      articles = eventRegistryArticles;
    } else if (source === "news_api") {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }
      
      console.log("Fetching articles from News API");
      const newsApiArticles = await fetchFromNewsAPI(keyword, limit);
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

// [Analysis] Function to fetch articles from Event Registry API
async function fetchFromEventRegistry(keyword, limit) {
  try {
    console.log(`Fetching from Event Registry with keyword "${keyword}" and limit ${limit}`);
    
    // Build the Event Registry API URL with parameters
    const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
    
    // Prepare the request body for Event Registry
    const requestBody = {
      action: "getArticles",
      keyword: keyword,
      articlesPage: 1,
      articlesCount: limit,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: "articles",
      dataType: ["news", "blog"],
      apiKey: EVENT_REGISTRY_API_KEY,
      forceMaxDataTimeWindow: 31,
      lang: "eng"
    };
    
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
    
    // Check if the response contains articles
    if (!data.articles || !data.articles.results) {
      console.warn("No articles found in Event Registry response");
      return [];
    }
    
    // Transform the articles to match our schema
    return data.articles.results.map(article => ({
      title: article.title,
      description: article.body || article.summary || "",
      content: article.body || article.summary || "",
      url: article.url || "",
      image_url: article.image || "",
      source: article.source?.title || extractDomainFromUrl(article.url) || "Event Registry",
      date: article.date || new Date().toISOString().split('T')[0],
      category: mapCategory(article.categories, keyword)
    }));
    
  } catch (error) {
    console.error("Error fetching from Event Registry:", error);
    throw error;
  }
}

// [Analysis] Function to fetch articles from News API
async function fetchFromNewsAPI(keyword, limit) {
  try {
    console.log(`Fetching from News API with keyword "${keyword}" and limit ${limit}`);
    
    // Build the News API URL with parameters
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", keyword);
    url.searchParams.append("from", fromDate);
    url.searchParams.append("to", toDate);
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("language", "en");
    url.searchParams.append("pageSize", limit.toString());
    url.searchParams.append("page", "1");
    
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
    
    // Check if the response contains articles
    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn("No articles found in News API response");
      return [];
    }
    
    // Transform the articles to match our schema
    return data.articles.map(article => ({
      title: article.title,
      description: article.description || "",
      content: article.content || article.description || "",
      url: article.url || "",
      image_url: article.urlToImage || "",
      source: article.source?.name || extractDomainFromUrl(article.url) || "News API",
      date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      category: mapCategory([], keyword)
    }));
    
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

// [Analysis] Function to map categories to our predefined categories
function mapCategory(categories, keyword) {
  // Default category if we can't determine a better one
  let defaultCategory = "breakthrough_technologies";
  
  // Keywords that might indicate specific categories
  const keywordMappings = {
    "ethics": "ai_ethics",
    "regulation": "ai_ethics",
    "policy": "ai_ethics",
    "app": "ai_tools",
    "tool": "ai_tools",
    "business": "industry_applications",
    "startup": "industry_applications",
    "company": "industry_applications",
    "research": "research_papers",
    "paper": "research_papers",
    "study": "research_papers",
    "development": "ai_in_development",
    "programming": "ai_in_development",
    "code": "ai_in_development",
    "impact": "societal_impact",
    "society": "societal_impact",
    "future": "future_possibilities",
    "crypto": "crypto_ai",
    "blockchain": "crypto_ai",
    "nft": "crypto_ai",
    "health": "healthcare_ai",
    "medical": "healthcare_ai",
    "education": "education_ai",
    "learning": "education_ai",
    "teach": "education_ai"
  };
  
  // Look for category hints in the provided keyword
  const lowercaseKeyword = keyword.toLowerCase();
  for (const [key, value] of Object.entries(keywordMappings)) {
    if (lowercaseKeyword.includes(key)) {
      return value;
    }
  }
  
  // If we have categories from the API, try to map them
  if (Array.isArray(categories) && categories.length > 0) {
    // Look at the first few categories to see if any match our mappings
    for (const category of categories.slice(0, 3)) {
      const categoryName = typeof category === 'string' ? category.toLowerCase() : 
                          (category.name ? category.name.toLowerCase() : '');
      
      for (const [key, value] of Object.entries(keywordMappings)) {
        if (categoryName.includes(key)) {
          return value;
        }
      }
    }
  }
  
  return defaultCategory;
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
  } catch (e) {
    console.warn("Error updating news_sources:", e);
    // Continue with the import even if we couldn't update the timestamp
  }
  
  // Process each article individually
  for (const article of articles) {
    try {
      // Check if article already exists to avoid duplicates (using title as the unique identifier)
      const { data: existingArticles, error: checkError } = await supabase
        .from('ai_news')
        .select('id')
        .eq('title', article.title)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking for existing article:", checkError);
        errors.push({
          title: article.title,
          error: checkError.message,
          details: checkError
        });
        continue;
      }
      
      // Skip if article already exists
      if (existingArticles && existingArticles.length > 0) {
        console.log(`Article already exists: "${article.title}"`);
        continue;
      }
      
      // Insert the new article
      const { data: insertedArticle, error: insertError } = await supabase
        .from('ai_news')
        .insert([
          {
            title: article.title,
            description: article.description,
            content: article.content,
            date: article.date,
            category: article.category,
            source: article.source,
            image_url: article.image_url,
            url: article.url,
            status: 'published',
            article_type: 'news'
          }
        ])
        .select('id')
        .single();
      
      if (insertError) {
        console.error(`Error inserting article "${article.title}":`, insertError);
        errors.push({
          title: article.title,
          error: insertError.message,
          details: insertError
        });
        continue;
      }
      
      console.log(`Successfully imported article: "${article.title}"`);
      successfulImports.push(insertedArticle.id);
      
      // Try to refresh the trending articles materialized view, but ignore errors
      try {
        // This is a common source of errors because it requires ownership of the materialized view
        // We will try but continue if it fails
        const { error: refreshError } = await supabase.rpc('refresh_trending_articles');
        
        if (refreshError) {
          console.warn("Could not refresh trending articles view:", refreshError);
          errors.push({
            title: article.title,
            error: refreshError.message,
            details: refreshError
          });
          // Continue with the import even if we couldn't refresh the view
        }
      } catch (e) {
        console.warn("Error refreshing materialized view:", e);
        // Continue with the import even if we couldn't refresh the view
      }
      
    } catch (error) {
      console.error(`Error processing article "${article.title}":`, error);
      errors.push({
        title: article.title,
        error: error.message
      });
    }
  }
  
  return {
    success: true,
    message: `Successfully imported ${successfulImports.length} out of ${articles.length} articles`,
    count: successfulImports.length,
    errors: errors
  };
}
