
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
    
    // Start tracking fetch history if not in test mode
    let fetchHistoryId = null;
    const startTime = Date.now();
    
    if (!testMode) {
      // Create a new fetch history record
      const { data, error } = await supabase
        .from('news_fetch_history')
        .insert({
          source_type: source,
          status: 'pending',
          metadata: { 
            started_at: new Date().toISOString(),
            parameters: { keyword, limit, source, debug }
          }
        })
        .select();
        
      if (error) {
        console.error("Error creating fetch history record:", error);
      } else {
        fetchHistoryId = data[0].id;
        console.log(`Created fetch history record with ID: ${fetchHistoryId}`);
      }
    }
    
    // Fetch articles based on selected source
    let articles = [];
    let errorMessages = [];
    
    if (source === "event_registry") {
      if (!EVENT_REGISTRY_API_KEY) {
        throw new Error("Event Registry API key is not configured");
      }
      
      console.log("Fetching articles from Event Registry with enhanced AI filtering");
      const eventRegistryArticles = await fetchFromEventRegistry(keyword, limit, debug);
      articles = eventRegistryArticles;
    } else if (source === "news_api") {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }
      
      console.log("Fetching articles from News API with enhanced AI filtering");
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
    
    // Update fetch history record if available
    if (fetchHistoryId) {
      const executionTime = Date.now() - startTime;
      
      const { error } = await supabase
        .from('news_fetch_history')
        .update({
          status: importResults.success ? 'success' : 'error',
          articles_fetched: articles.length,
          articles_added: importResults.count,
          duplicates_skipped: (importResults.errors || []).filter(e => e.error && e.error.includes('duplicate')).length,
          execution_time_ms: executionTime,
          error_message: importResults.success ? null : importResults.message,
          metadata: { 
            completed_at: new Date().toISOString(),
            execution_time_ms: executionTime
          }
        })
        .eq('id', fetchHistoryId);
        
      if (error) {
        console.error("Error updating fetch history record:", error);
      }
    }
    
    // Update the last_fetched timestamp in the news_sources table
    const { error: sourceUpdateError } = await supabase
      .from('news_sources')
      .upsert([{
        source_type: source,
        last_fetched_at: new Date().toISOString()
      }]);
      
    if (sourceUpdateError) {
      console.error("Error updating news_sources record:", sourceUpdateError);
    }
    
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

// [Analysis] Enhanced function to fetch articles from Event Registry API with better AI relevance detection
async function fetchFromEventRegistry(keyword, limit, debug = false) {
  try {
    console.log(`Fetching from Event Registry with enhanced AI filtering: "${keyword}" and limit ${limit}`);
    
    // Build the Event Registry API URL with parameters
    const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
    
    // [Analysis] Enhanced request body with more specific AI-related keywords and parameters 
    const aiKeywords = [
      "artificial intelligence", "ai", "machine learning", "neural network", 
      "deep learning", "llm", "large language model", "chatgpt", "gpt", 
      "openai", "anthropic", "claude", "ai ethics", "ai research", 
      "ai development", "ai strategy", "ai policy", "computer vision",
      "natural language processing", "reinforcement learning", "robotics ai",
      "generative ai", "ai assistant", "ai model", "foundation model",
      "transformer model", "gpt-4", "llama", "gemini"
    ];
    
    // Create a combined keyword query
    const keywordQuery = aiKeywords.join(" OR ");
    
    const requestBody = {
      action: "getArticles",
      keyword: keywordQuery,
      
      // Set additional parameters for quality and freshness
      articlesPage: 1,
      articlesCount: limit * 2, // Fetch more to allow for filtering
      articlesSortBy: "date", // Sort by date to get newest articles
      articlesSortByAsc: false,
      articleBodyLen: -1, // Get full article content
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
    
    // Transform and filter articles with enhanced AI relevance scoring
    const transformedArticles = data.articles.results.map(article => {
      // Extract concepts to determine AI relevance
      const concepts = article.concepts || [];
      
      // [Analysis] Enhanced list of AI terms to check for
      const aiTerms = {
        core: ["artificial intelligence", "ai", "machine learning", "neural network", "deep learning", 
              "llm", "large language model", "chatgpt", "gpt", "openai", "gemini", "anthropic"],
        technical: ["transformer", "parameter", "training", "fine-tuning", "reinforcement learning",
                  "computer vision", "natural language processing", "nlp", "algorithm", "vector",
                  "embedding", "token", "tokenizer", "prompt engineering", "model"],
        applications: ["generative ai", "ai assistant", "ai model", "ai tool", "ai system",
                     "ai-powered", "ai solution", "ai application"],
        companies: ["openai", "anthropic", "google deepmind", "microsoft ai", "meta ai", "stability ai",
                  "hugging face", "nvidia ai", "cohere", "claude"]
      };
      
      // Combine all terms for checking
      const allAiTerms = [...aiTerms.core, ...aiTerms.technical, ...aiTerms.applications, ...aiTerms.companies];
      
      // Extract text for analysis
      const title = article.title?.toLowerCase() || "";
      const body = article.body?.toLowerCase() || "";
      const combinedText = title + " " + body;
      
      // [Analysis] Calculate an enhanced AI relevance score (0-100) with weighted categories
      let aiRelevanceScore = 0;
      
      // Check title for AI terms (higher weight for title matches)
      aiTerms.core.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 20;
        if (body.includes(term)) aiRelevanceScore += 5;
      });
      
      aiTerms.technical.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 15;
        if (body.includes(term)) aiRelevanceScore += 3;
      });
      
      aiTerms.applications.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 15;
        if (body.includes(term)) aiRelevanceScore += 3;
      });
      
      aiTerms.companies.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 10;
        if (body.includes(term)) aiRelevanceScore += 2;
      });
      
      // [Analysis] Additional heuristics for AI relevance
      
      // Count how many AI terms appear
      const termCount = allAiTerms.filter(term => combinedText.includes(term)).length;
      aiRelevanceScore += Math.min(20, termCount * 2); // Up to 20 points for term diversity
      
      // Check for term proximity (terms appearing close together)
      const termProximity = checkTermProximity(combinedText, allAiTerms);
      aiRelevanceScore += termProximity * 10; // Up to 10 points for term proximity
      
      // Cap at 100
      aiRelevanceScore = Math.min(100, aiRelevanceScore);
      
      // Determine impact based on title and content
      let impact = "medium";
      const highImpactTerms = ["revolutionary", "breakthrough", "major", "groundbreaking", "transformative"];
      const lowImpactTerms = ["minor", "incremental", "small", "modest"];
      
      if (highImpactTerms.some(term => title.includes(term))) {
        impact = "high";
      } else if (lowImpactTerms.some(term => title.includes(term))) {
        impact = "low";
      }
      
      // Determine technical complexity based on content
      const technicalTerms = ["algorithm", "neural network", "parameters", "training", "dataset", 
                             "tensor", "vector", "gradient", "optimization", "architecture"];
      const technicalCount = technicalTerms.reduce((count, term) => {
        return count + ((body.match(new RegExp(term, 'g')) || []).length);
      }, 0);
      
      // [Analysis] Better technical complexity determination
      let technicalComplexity;
      if (technicalCount > 8) {
        technicalComplexity = "advanced";
      } else if (technicalCount > 4) {
        technicalComplexity = "intermediate";
      } else {
        technicalComplexity = "basic";
      }
      
      // [Analysis] Enhanced category determination with more specific AI categories
      let category = determineEnhancedCategory(title, body, concepts);
      
      // Calculate reading time based on content length
      const wordCount = (body.match(/\S+/g) || []).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // [Analysis] Determine source credibility more accurately
      let sourceCred = "standard";
      const credibleAiSources = [
        "arxiv", "ai.googleblog", "openai.com", "deepmind", "distill.pub", "ai.facebook.com",
        "microsoft research", "nature", "science", "ieee", "mit technology review",
        "stanford.edu", "berkeley.edu", "oxford.ac.uk", "cam.ac.uk", "anthropic.com",
        "ai.meta.com", "huggingface.co", "nvidia.com/ai"
      ];
      
      const sourceUrl = article.source?.uri || article.url || "";
      if (credibleAiSources.some(s => sourceUrl.includes(s))) {
        sourceCred = "verified";
      }
      
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
        source_credibility: sourceCred,
        article_type: "news",
        ai_relevance_score: aiRelevanceScore
      };
    });
    
    // [Analysis] Filter articles based on enhanced AI relevance score
    // Sort by AI relevance score and take the top 'limit' articles
    const filteredArticles = transformedArticles
      .filter(article => article.ai_relevance_score > 30) // Higher threshold for better AI focus
      .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
      .slice(0, limit);
    
    console.log(`Filtered to ${filteredArticles.length} articles with high AI relevance`);
    return filteredArticles;
    
  } catch (error) {
    console.error("Error fetching from Event Registry:", error);
    throw error;
  }
}

// [Analysis] Helper function to check term proximity (terms appearing close together)
function checkTermProximity(text, terms) {
  // Convert text to lowercase and split into sentences
  const sentences = text.toLowerCase().split(/[.!?]+/);
  
  // Count how many sentences contain multiple AI terms
  let multiTermSentences = 0;
  
  sentences.forEach(sentence => {
    let termCount = 0;
    terms.forEach(term => {
      if (sentence.includes(term)) {
        termCount++;
      }
    });
    
    if (termCount >= 2) {
      multiTermSentences++;
    }
  });
  
  // Return a score between 0 and 1 based on term proximity
  return Math.min(1, multiTermSentences / 10);
}

// [Analysis] Enhanced function to fetch articles from News API with better AI relevance detection
async function fetchFromNewsAPI(keyword, limit, debug = false) {
  try {
    console.log(`Fetching from News API with enhanced AI filtering: "${keyword}" and limit ${limit}`);
    
    // Build the News API URL with parameters
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // [Analysis] Create a more comprehensive AI query with multiple terms
    const aiQueryTerms = [
      "artificial intelligence", "ai", "machine learning", "neural network", 
      "deep learning", "llm", "large language model", "chatgpt", "gpt", 
      "generative ai", "openai", "anthropic", "claude", "ai ethics"
    ];
    
    // Join terms with OR for better results
    const aiQuery = encodeURIComponent(aiQueryTerms.map(term => `"${term}"`).join(" OR "));
    
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", aiQuery);
    url.searchParams.append("from", fromDate);
    url.searchParams.append("to", toDate);
    url.searchParams.append("sortBy", "relevancy"); // Changed to relevancy first for better AI focus
    url.searchParams.append("language", "en");
    url.searchParams.append("pageSize", (limit * 2).toString()); // Fetch more for filtering
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
    
    // Transform and filter articles for better AI relevance
    const transformedArticles = data.articles.map((article, index) => {
      // Combine title and description for text analysis
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = article.content?.toLowerCase() || '';
      const combinedText = `${title} ${description} ${content}`;
      
      // [Analysis] Enhanced AI terms categorization
      const aiTerms = {
        core: ["artificial intelligence", "ai", "machine learning", "neural network", "deep learning", 
              "llm", "large language model", "chatgpt", "gpt", "openai", "gemini", "anthropic"],
        technical: ["transformer", "parameter", "training", "fine-tuning", "reinforcement learning",
                  "computer vision", "natural language processing", "nlp", "algorithm", "vector",
                  "embedding", "token", "tokenizer", "prompt engineering", "model"],
        applications: ["generative ai", "ai assistant", "ai model", "ai tool", "ai system",
                     "ai-powered", "ai solution", "ai application"],
        companies: ["openai", "anthropic", "google deepmind", "microsoft ai", "meta ai", "stability ai",
                  "hugging face", "nvidia ai", "cohere", "claude"]
      };
      
      // Combine all terms for checking
      const allAiTerms = [...aiTerms.core, ...aiTerms.technical, ...aiTerms.applications, ...aiTerms.companies];
      
      // [Analysis] Calculate an enhanced AI relevance score (0-100) with weighted categories
      let aiRelevanceScore = 0;
      
      // Check title for AI terms (higher weight for title matches)
      aiTerms.core.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 20;
        if (combinedText.includes(term)) aiRelevanceScore += 5;
      });
      
      aiTerms.technical.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 15;
        if (combinedText.includes(term)) aiRelevanceScore += 3;
      });
      
      aiTerms.applications.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 15;
        if (combinedText.includes(term)) aiRelevanceScore += 3;
      });
      
      aiTerms.companies.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 10;
        if (combinedText.includes(term)) aiRelevanceScore += 2;
      });
      
      // Count how many AI terms appear
      const termCount = allAiTerms.filter(term => combinedText.includes(term)).length;
      aiRelevanceScore += Math.min(20, termCount * 2); // Up to 20 points for term diversity
      
      // Check for term proximity (terms appearing close together)
      const termProximity = checkTermProximity(combinedText, allAiTerms);
      aiRelevanceScore += termProximity * 10; // Up to 10 points for term proximity
      
      // Cap at 100
      aiRelevanceScore = Math.min(100, aiRelevanceScore);
      
      // Determine category based on content with enhanced specificity
      let category = determineEnhancedCategory(title, description, []);
      
      // Determine impact based on title
      let impact = "medium";
      const highImpactTerms = ["revolutionary", "breakthrough", "major", "groundbreaking", "transformative"];
      const lowImpactTerms = ["minor", "incremental", "small", "modest"];
      
      if (highImpactTerms.some(term => title.includes(term))) {
        impact = "high";
      } else if (lowImpactTerms.some(term => title.includes(term))) {
        impact = "low";
      }
      
      // Calculate reading time based on content length
      const contentText = article.content || article.description || "";
      const wordCount = contentText.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // Determine technical complexity
      const technicalTerms = ["algorithm", "neural network", "parameters", "training", "dataset", 
                             "tensor", "vector", "gradient", "optimization", "architecture"];
      const technicalCount = technicalTerms.reduce((count, term) => {
        return count + ((combinedText.match(new RegExp(term, 'g')) || []).length);
      }, 0);
      
      let technicalComplexity;
      if (technicalCount > 8) {
        technicalComplexity = "advanced";
      } else if (technicalCount > 4) {
        technicalComplexity = "intermediate";
      } else {
        technicalComplexity = "basic";
      }
      
      // Extract domain for source with credibility check
      const source = article.source?.name || extractDomainFromUrl(article.url);
      
      // Determine source credibility
      let sourceCred = "standard";
      const credibleAiSources = [
        "arxiv", "ai.googleblog", "openai.com", "deepmind", "distill.pub", "ai.facebook.com",
        "microsoft research", "nature", "science", "ieee", "mit technology review",
        "stanford.edu", "berkeley.edu", "oxford.ac.uk", "cam.ac.uk", "anthropic.com",
        "ai.meta.com", "huggingface.co", "nvidia.com/ai"
      ];
      
      const sourceUrl = article.url || "";
      if (credibleAiSources.some(s => sourceUrl.includes(s))) {
        sourceCred = "verified";
      }
      
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
        technical_complexity: technicalComplexity,
        estimated_reading_time: readingTime,
        source_credibility: sourceCred,
        article_type: "news",
        ai_relevance_score: aiRelevanceScore,
        featured: (index === 0) // Feature first article
      };
    });
    
    // [Analysis] Filter articles based on enhanced AI relevance score
    // Sort by AI relevance score and take the top 'limit' articles
    const filteredArticles = transformedArticles
      .filter(article => article.ai_relevance_score > 30) // Higher threshold for better AI focus
      .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
      .slice(0, limit);
    
    console.log(`Filtered to ${filteredArticles.length} articles with high AI relevance`);
    return filteredArticles;
    
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

// [Analysis] Enhanced category determination with more AI-specific categories
function determineEnhancedCategory(title, content, apiCategories) {
  title = title.toLowerCase();
  content = content.toLowerCase();
  
  // Default category
  let category = "breakthrough_technologies";
  
  // Check for more specific AI categories
  const categoryIndicators = {
    "language_models": ["llm", "large language model", "chatgpt", "gpt", "transformer", "bert", "prompt", "text generation"],
    "robotics_automation": ["robot", "automation", "autonomous", "self-driving", "drone", "manufacturing"],
    "industry_applications": ["business", "company", "startup", "industry", "market", "enterprise", "corporate"],
    "research_papers": ["research", "study", "paper", "university", "researchers", "published", "journal"],
    "ai_ethics": ["ethics", "bias", "policy", "regulation", "governance", "safety", "responsible ai", "fairness"],
    "international_developments": ["china", "europe", "global", "international", "country", "nation", "worldwide"]
  };
  
  // Check for category indicators in the title and content
  for (const [cat, indicators] of Object.entries(categoryIndicators)) {
    if (indicators.some(indicator => title.includes(indicator)) || 
        indicators.some(indicator => content.includes(indicator))) {
      category = cat;
      break;
    }
  }
  
  // Try to use API categories if available
  if (apiCategories && apiCategories.length > 0) {
    const categoryStr = JSON.stringify(apiCategories).toLowerCase();
    
    if (categoryStr.includes("research") || categoryStr.includes("science")) {
      category = "research_papers";
    } else if (categoryStr.includes("business") || categoryStr.includes("economy")) {
      category = "industry_applications";
    } else if (categoryStr.includes("ethics") || categoryStr.includes("policy")) {
      category = "ai_ethics";
    } else if (categoryStr.includes("international") || categoryStr.includes("global")) {
      category = "international_developments";
    } else if (categoryStr.includes("robot") || categoryStr.includes("autonomous")) {
      category = "robotics_automation";
    } else if (categoryStr.includes("language") || categoryStr.includes("nlp")) {
      category = "language_models";
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
          errors.push({
            title: article.title,
            error: "Duplicate article"
          });
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
