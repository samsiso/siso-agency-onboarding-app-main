
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
      testMode = false, // [Analysis] Changed default to false to ensure articles are imported
      source = "event_registry",
      debug = true // [Analysis] Added debug flag and enabled it by default
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
      } else {
        console.log("No articles found, check API parameters and filters");
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
    // but with LOWER threshold for AI relevance to get more results
    const aiKeywords = [
      "artificial intelligence", "ai", "machine learning", "neural network", 
      "deep learning", "llm", "large language model", "chatgpt", "gpt", 
      "openai", "anthropic", "claude", "ai ethics", "ai research", 
      "ai development", "ai strategy", "ai policy", "computer vision",
      "natural language processing", "reinforcement learning", "robotics ai",
      "generative ai", "ai assistant", "ai model", "foundation model",
      "transformer model", "gpt-4", "llama", "gemini"
    ];
    
    // [Analysis] Simplified keyword query to match more articles
    let keywordQuery = keyword;
    if (keyword === "artificial intelligence") {
      // Use broader terms for the default query
      keywordQuery = "AI OR artificial intelligence OR machine learning";
    }
    
    const requestBody = {
      action: "getArticles",
      keyword: keywordQuery,
      
      // Set additional parameters for quality and freshness
      articlesPage: 1,
      articlesCount: limit * 3, // [Analysis] Fetch more to allow for filtering
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
      console.log("Event Registry API raw response structure:", Object.keys(data));
      if (data.articles) {
        console.log("Articles count:", data.articles.results?.length || 0);
      }
    }
    
    // Check if the response contains articles
    if (!data.articles || !data.articles.results) {
      console.warn("No articles found in Event Registry response");
      if (debug && data) {
        console.log("Response data:", JSON.stringify(data, null, 2).substring(0, 1000) + "...");
      }
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
      
      // Generate key takeaways based on article content if body length is sufficient
      let keyTakeaways = [];
      if (body && body.length > 200) {
        // Extract sentences that might contain key points
        const sentences = body.split(/[.!?]+/).filter(s => s.trim().length > 30);
        
        // Look for sentences with indicators of important information
        const importantPhrases = [
          "important", "significant", "key", "critical", "essential", "major",
          "breakthrough", "discovery", "finding", "result", "concluded", "suggests",
          "according to", "researchers", "scientists", "study shows", "demonstrates"
        ];
        
        const potentialTakeaways = sentences.filter(s => 
          importantPhrases.some(phrase => s.toLowerCase().includes(phrase))
        );
        
        // Extract up to 5 key takeaways
        keyTakeaways = potentialTakeaways
          .slice(0, Math.min(5, potentialTakeaways.length))
          .map(s => s.trim());
          
        // If we couldn't find good sentences based on important phrases,
        // just use the first few sentences that are of reasonable length
        if (keyTakeaways.length < 3 && sentences.length > 3) {
          const additionalSentences = sentences
            .filter(s => s.length > 50 && s.length < 200)
            .slice(0, 3 - keyTakeaways.length);
            
          keyTakeaways = [...keyTakeaways, ...additionalSentences];
        }
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
        ai_relevance_score: aiRelevanceScore,
        key_takeaways: keyTakeaways
      };
    });
    
    // Log the number of articles with high AI relevance for debugging
    const highRelevanceCount = transformedArticles.filter(a => a.ai_relevance_score > 50).length;
    const mediumRelevanceCount = transformedArticles.filter(a => a.ai_relevance_score > 20 && a.ai_relevance_score <= 50).length;
    const lowRelevanceCount = transformedArticles.filter(a => a.ai_relevance_score <= 20).length;
    
    console.log(`AI relevance distribution: High: ${highRelevanceCount}, Medium: ${mediumRelevanceCount}, Low: ${lowRelevanceCount}`);
    
    // [Analysis] Use a lower AI relevance threshold to get more results (20 instead of 30)
    const filteredArticles = transformedArticles
      .filter(article => article.ai_relevance_score > 15) // Lower threshold for better results
      .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
      .slice(0, limit);
    
    console.log(`Filtered to ${filteredArticles.length} articles with AI relevance > 15`);
    
    // If we still have no articles, include some with lower relevance as a fallback
    if (filteredArticles.length === 0 && transformedArticles.length > 0) {
      console.log("No articles with sufficient AI relevance found, including some with lower relevance");
      const fallbackArticles = transformedArticles
        .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
        .slice(0, Math.min(10, transformedArticles.length));
        
      console.log(`Adding ${fallbackArticles.length} fallback articles with lower relevance scores`);
      return fallbackArticles;
    }
    
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
    // Using OR instead of AND to get more results
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
    url.searchParams.append("apiKey", NEWS_API_KEY);
    
    // Log request for debugging
    if (debug) {
      console.log("News API request:", url.toString().replace(NEWS_API_KEY, "API_KEY_REDACTED"));
    }
    
    // Make the request to News API
    const response = await fetch(url.toString());
    
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
      console.log("News API raw response structure:", Object.keys(data));
      console.log(`News API returned ${data.totalResults} results, status: ${data.status}`);
      if (data.articles && data.articles.length > 0) {
        console.log("Sample article:", JSON.stringify(data.articles[0], null, 2));
      }
    }
    
    // Check if the response contains articles
    if (!data.articles || data.articles.length === 0) {
      console.warn("No articles found in News API response");
      return [];
    }
    
    console.log(`Retrieved ${data.articles.length} raw articles from News API`);
    
    // Transform the articles to the common format
    const transformedArticles = data.articles.map(article => {
      // Extract text for analysis
      const title = article.title?.toLowerCase() || "";
      const description = article.description?.toLowerCase() || "";
      const content = article.content?.toLowerCase() || "";
      const combinedText = title + " " + description + " " + content;
      
      // [Analysis] Similar AI relevance scoring as Event Registry
      const aiTerms = [
        "artificial intelligence", "ai", "machine learning", "neural network", 
        "deep learning", "llm", "large language model", "chatgpt", "gpt",
        "transformer", "model", "generative", "algorithm"
      ];
      
      // Calculate AI relevance score - simpler for News API
      let aiRelevanceScore = 0;
      
      // Check for AI terms in title and content
      aiTerms.forEach(term => {
        if (title.includes(term)) aiRelevanceScore += 15;
        if (description.includes(term)) aiRelevanceScore += 5;
        if (content.includes(term)) aiRelevanceScore += 3;
      });
      
      // Count unique AI terms for term diversity
      const uniqueTermsCount = aiTerms.filter(term => combinedText.includes(term)).length;
      aiRelevanceScore += uniqueTermsCount * 5;
      
      // Cap at 100
      aiRelevanceScore = Math.min(100, aiRelevanceScore);
      
      // Determine impact and technical complexity
      let impact = "medium";
      let technicalComplexity = "intermediate";
      
      // Set impact based on title keywords
      if (title.includes("breakthrough") || title.includes("revolutionary")) {
        impact = "high";
      }
      
      // Set technical complexity based on content keywords
      const technicalTerms = ["algorithm", "architecture", "parameters", "training", "framework"];
      if (technicalTerms.some(term => combinedText.includes(term))) {
        technicalComplexity = "advanced";
      }
      
      // Determine category based on content
      const categoryMapping = [
        { terms: ["chatgpt", "gpt", "llm", "language model"], category: "language_models" },
        { terms: ["robot", "automation", "manufacturing"], category: "robotics_automation" },
        { terms: ["business", "industry", "enterprise", "company"], category: "industry_applications" },
        { terms: ["research", "paper", "breakthrough", "scientist"], category: "breakthrough_technologies" },
        { terms: ["global", "country", "nation", "worldwide"], category: "international_developments" }
      ];
      
      let category = "breakthrough_technologies"; // Default category
      
      // Find the best matching category
      let maxMatches = 0;
      categoryMapping.forEach(mapping => {
        const matches = mapping.terms.filter(term => combinedText.includes(term)).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          category = mapping.category;
        }
      });
      
      // Extract domain from URL for source
      const sourceUrl = article.url || "";
      const source = article.source?.name || extractDomainFromUrl(sourceUrl) || "Unknown";
      
      // Calculate reading time
      const wordCount = ((article.content || "") + (article.description || "")).split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // Generate key takeaways from the content and description
      let keyTakeaways = [];
      if (article.description) {
        keyTakeaways.push(article.description);
      }
      
      if (article.content) {
        // Extract some sentences from content
        const contentSentences = (article.content || "")
          .split(/[.!?]+/)
          .filter(s => s.trim().length > 30)
          .slice(0, 2);
          
        keyTakeaways = [...keyTakeaways, ...contentSentences];
      }
      
      // Ensure we have at least one takeaway
      if (keyTakeaways.length === 0 && title) {
        keyTakeaways = [title];
      }
      
      return {
        title: article.title,
        description: article.description || "",
        content: article.content || article.description || "",
        url: article.url || "",
        image_url: article.urlToImage || "",
        source: source,
        date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        category: category,
        impact: impact,
        technical_complexity: technicalComplexity,
        estimated_reading_time: readingTime,
        source_credibility: "standard",
        article_type: "news",
        ai_relevance_score: aiRelevanceScore,
        key_takeaways: keyTakeaways
      };
    });
    
    // Filter articles by AI relevance
    const filteredArticles = transformedArticles
      .filter(article => article.ai_relevance_score > 20) // Lower threshold for News API
      .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
      .slice(0, limit);
      
    console.log(`Filtered to ${filteredArticles.length} articles with AI relevance > 20`);
    
    // If we still have no articles, include some with lower relevance
    if (filteredArticles.length === 0 && transformedArticles.length > 0) {
      console.log("No articles with sufficient AI relevance found, including some with lower relevance");
      return transformedArticles
        .sort((a, b) => b.ai_relevance_score - a.ai_relevance_score)
        .slice(0, Math.min(10, transformedArticles.length));
    }
    
    return filteredArticles;
    
  } catch (error) {
    console.error("Error fetching from News API:", error);
    throw error;
  }
}

// [Analysis] Helper to extract domain from URL
function extractDomainFromUrl(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

// [Analysis] Helper to determine the category of an article
function determineEnhancedCategory(title, body, concepts) {
  const combinedText = (title + ' ' + body).toLowerCase();
  
  // Check for specific categories based on keywords
  const categoryMappings = [
    {
      category: 'language_models',
      keywords: ['llm', 'language model', 'chatgpt', 'gpt', 'chat ai', 'chatbot', 'llama', 'claude', 'mistral', 'text generation', 'transformer', 'attention mechanism']
    },
    {
      category: 'breakthrough_technologies',
      keywords: ['breakthrough', 'research', 'paper', 'science', 'discovery', 'novel', 'innovation', 'cutting-edge', 'state-of-the-art', 'sota', 'advancement']
    },
    {
      category: 'robotics_automation',
      keywords: ['robot', 'robotics', 'automation', 'autonomous', 'self-driving', 'drone', 'manufacturing', 'industrial ai', 'mechanical', 'factory']
    },
    {
      category: 'industry_applications',
      keywords: ['business', 'enterprise', 'industry', 'company', 'corporate', 'commercial', 'application', 'solution', 'product', 'service', 'market', 'customer']
    },
    {
      category: 'international_developments',
      keywords: ['global', 'international', 'country', 'nation', 'worldwide', 'regulation', 'policy', 'government', 'law', 'china', 'europe', 'usa', 'india']
    }
  ];

  // Count keyword matches for each category
  const scores = {};
  categoryMappings.forEach(mapping => {
    scores[mapping.category] = 0;
    mapping.keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        scores[mapping.category] += 1;
        
        // Extra points if the keyword appears in the title
        if (title.toLowerCase().includes(keyword)) {
          scores[mapping.category] += 2;
        }
      }
    });
  });
  
  // Add points based on concepts from Event Registry if available
  if (concepts && concepts.length > 0) {
    concepts.forEach(concept => {
      const conceptName = concept.uri || concept.name || "";
      if (!conceptName) return;
      
      const lowerConcept = conceptName.toLowerCase();
      
      // Map concepts to categories
      if (lowerConcept.includes('language') || lowerConcept.includes('gpt') || lowerConcept.includes('chat')) {
        scores['language_models'] += 3;
      } else if (lowerConcept.includes('robot') || lowerConcept.includes('automat')) {
        scores['robotics_automation'] += 3;
      } else if (lowerConcept.includes('business') || lowerConcept.includes('industry') || lowerConcept.includes('market')) {
        scores['industry_applications'] += 3;
      } else if (lowerConcept.includes('research') || lowerConcept.includes('science') || lowerConcept.includes('tech')) {
        scores['breakthrough_technologies'] += 3;
      } else if (lowerConcept.includes('global') || lowerConcept.includes('country') || lowerConcept.includes('govern')) {
        scores['international_developments'] += 3;
      }
    });
  }

  // Find the category with the highest score
  let bestCategory = 'breakthrough_technologies'; // Default
  let highestScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

// [Analysis] Function to save articles to the database with better error handling and insertion logic
async function saveArticlesToDatabase(articles) {
  try {
    if (!articles || articles.length === 0) {
      return { 
        success: true, 
        message: "No articles to save", 
        count: 0 
      };
    }
    
    console.log(`Attempting to save ${articles.length} articles to database`);
    
    // Map articles to the database schema
    const articlesToInsert = articles.map(article => {
      const today = new Date().toISOString().split('T')[0];
      
      return {
        title: article.title,
        description: article.description || "",
        content: article.content || article.description || "",
        date: article.date || today,
        url: article.url || null,
        image_url: article.image_url || null,
        source: article.source || "Unknown",
        category: article.category || "breakthrough_technologies",
        status: "published",
        article_type: "news",
        technical_complexity: article.technical_complexity || "intermediate",
        impact: article.impact || "medium",
        source_credibility: article.source_credibility || "standard",
        key_takeaways: article.key_takeaways || [],
        reading_time: article.estimated_reading_time || 5,
        publish_date: today,
        created_at: new Date().toISOString()
      };
    });
    
    // Collect insertion results and errors
    const results = {
      success: true,
      message: "",
      count: 0,
      errors: []
    };
    
    // Insert articles in batches to avoid potential RPC errors with large payloads
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < articlesToInsert.length; i += batchSize) {
      batches.push(articlesToInsert.slice(i, i + batchSize));
    }
    
    console.log(`Inserting articles in ${batches.length} batches of up to ${batchSize} articles each`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} articles`);
      
      try {
        const { data, error } = await supabase
          .from('ai_news')
          .insert(batch)
          .select('id');
          
        if (error) {
          console.error(`Error inserting batch ${i+1}:`, error);
          results.errors.push({ 
            batch: i + 1, 
            error: error.message,
            articleCount: batch.length
          });
          
          // Try inserting one by one to salvage articles that don't have issues
          console.log(`Attempting individual inserts for batch ${i+1}`);
          for (let j = 0; j < batch.length; j++) {
            try {
              const { data: singleData, error: singleError } = await supabase
                .from('ai_news')
                .insert([batch[j]])
                .select('id');
                
              if (singleError) {
                console.error(`Error inserting article ${j+1} in batch ${i+1}:`, singleError);
                results.errors.push({ 
                  batch: i + 1, 
                  article: j + 1,
                  error: singleError.message 
                });
              } else if (singleData && singleData.length > 0) {
                results.count++;
              }
            } catch (itemError) {
              console.error(`Exception inserting article ${j+1} in batch ${i+1}:`, itemError);
              results.errors.push({ 
                batch: i + 1, 
                article: j + 1,
                error: itemError.message 
              });
            }
          }
        } else if (data) {
          results.count += data.length;
          console.log(`Successfully inserted ${data.length} articles from batch ${i+1}`);
        }
      } catch (batchError) {
        console.error(`Exception processing batch ${i+1}:`, batchError);
        results.errors.push({ 
          batch: i + 1, 
          error: batchError.message,
          articleCount: batch.length
        });
        
        // Continue with other batches despite errors
      }
    }
    
    // Set success message based on results
    if (results.count === 0 && results.errors.length > 0) {
      results.success = false;
      results.message = `Failed to insert any articles. ${results.errors.length} errors occurred.`;
    } else if (results.count < articlesToInsert.length) {
      results.message = `Partially successful: Inserted ${results.count} out of ${articlesToInsert.length} articles. ${results.errors.length} errors occurred.`;
    } else {
      results.message = `Successfully inserted all ${results.count} articles.`;
    }
    
    return results;
    
  } catch (error) {
    console.error("Error in saveArticlesToDatabase:", error);
    return {
      success: false,
      message: `Database error: ${error.message}`,
      count: 0,
      errors: [{ error: error.message }]
    };
  }
}
