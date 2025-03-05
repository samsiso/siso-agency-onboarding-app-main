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
      limit = 50, // [Analysis] Increased default limit from 10 to 50
      testMode = true, 
      source = "event_registry" 
    } = await req.json();
    
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
      
      console.log("Fetching articles from Event Registry with enhanced AI filtering");
      const eventRegistryArticles = await fetchFromEventRegistryWithAIFilter(keyword, limit);
      articles = eventRegistryArticles;
    } else if (source === "news_api") {
      if (!NEWS_API_KEY) {
        throw new Error("News API key is not configured");
      }
      
      console.log("Fetching articles from News API with enhanced AI filtering");
      const newsApiArticles = await fetchFromNewsAPIWithAIFilter(keyword, limit);
      articles = newsApiArticles;
    } else {
      throw new Error(`Invalid source: ${source}`);
    }
    
    console.log(`Fetched ${articles.length} AI-focused articles from ${source}`);
    
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
          message: `Successfully retrieved ${articles.length} AI-focused articles from ${source}`,
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

// [Analysis] Enhanced function to fetch AI-focused articles from Event Registry API
async function fetchFromEventRegistryWithAIFilter(keyword, limit) {
  try {
    console.log(`Fetching from Event Registry with advanced AI filtering: "${keyword}" and limit ${limit}`);
    
    // Build the Event Registry API URL with parameters
    const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
    
    // [Analysis] Enhanced request body with AI-specific filtering parameters
    const requestBody = {
      action: "getArticles",
      // Use multiple AI-related keywords with OR operator for broader coverage
      keyword: [
        "artificial intelligence", 
        "machine learning", 
        "deep learning", 
        "neural network", 
        "large language model",
        "AI model", 
        "generative AI",
        "AI research",
        "AI chip",
        "AI startup",
        "AI ethics",
        "computer vision",
        "NLP",
        "natural language processing",
        "reinforcement learning",
        "GPT",
        "LLM",
        "ChatGPT",
        "Gemini",
        "DALL-E",
        "Midjourney",
        "Stable Diffusion"
      ],
      keywordOper: "or", // Match any of these keywords
      
      // Add specific concept URIs for major AI entities and technologies
      conceptUri: [
        "http://en.wikipedia.org/wiki/OpenAI",
        "http://en.wikipedia.org/wiki/Artificial_intelligence",
        "http://en.wikipedia.org/wiki/Machine_learning",
        "http://en.wikipedia.org/wiki/Nvidia",
        "http://en.wikipedia.org/wiki/Meta_Platforms",
        "http://en.wikipedia.org/wiki/Google",
        "http://en.wikipedia.org/wiki/Microsoft",
        "http://en.wikipedia.org/wiki/Deep_learning",
        "http://en.wikipedia.org/wiki/Natural_language_processing",
        "http://en.wikipedia.org/wiki/Computer_vision",
        "http://en.wikipedia.org/wiki/Anthropic_(company)",
        "http://en.wikipedia.org/wiki/Stable_Diffusion",
        "http://en.wikipedia.org/wiki/Midjourney",
        "http://en.wikipedia.org/wiki/DALL-E",
        "http://en.wikipedia.org/wiki/GPT-4",
        "http://en.wikipedia.org/wiki/Claude_(chatbot)"
      ],
      conceptOper: "or", // Match any of these concepts
      
      // Add source filtering to prioritize tech publications
      sourceGroupUri: "tech/technology_news",
      
      // Set category filtering to focus on tech and business
      categoryUri: [
        "news/Technology",
        "news/Computing",
        "news/Business",
        "news/Science",
        "news/Artificial_Intelligence",
        "news/IT",
        "news/Innovation"
      ],
      categoryOper: "or",
      
      // Ignore certain categories to reduce noise
      ignoreCategoryUri: [
        "news/Sports",
        "news/Entertainment",
        "news/Lifestyle",
        "news/Weather",
        "news/Politics"
      ],
      
      // Ignore specific keywords that might create noise
      ignoreKeyword: [
        "scam",
        "fraud",
        "conspiracy",
        "hoax"
      ],
      
      // Set additional parameters for quality and freshness
      articlesPage: 1,
      articlesCount: limit,
      articlesSortBy: "date", // Sort by date to get newest articles
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1, // Get full article content
      resultType: "articles",
      dataType: ["news", "blog", "pr"], // Include press releases for company announcements
      apiKey: EVENT_REGISTRY_API_KEY,
      forceMaxDataTimeWindow: 31, // Limit to last month for freshness
      lang: "eng", // English articles only
      
      // Include additional metadata for better processing
      includeArticleConcepts: true,
      includeArticleCategories: true,
      includeArticleSentiment: true,
      isDuplicateFilter: "skipDuplicates", // Filter out duplicate content
      
      // Start from higher quality sources (but not too restrictive)
      startSourceRankPercentile: 0,
      endSourceRankPercentile: 80
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
    
    console.log(`Retrieved ${data.articles.results.length} raw articles from Event Registry`);
    
    // [Analysis] Enhanced article transformation with AI relevance scoring
    return data.articles.results.map(article => {
      // Extract concepts to determine AI relevance score
      const concepts = article.concepts || [];
      const aiConcepts = concepts.filter(c => 
        c.uri.includes("Artificial_intelligence") ||
        c.uri.includes("Machine_learning") ||
        c.uri.includes("OpenAI") ||
        c.uri.includes("Neural_network") ||
        c.uri.includes("Deep_learning") ||
        c.uri.includes("GPT") ||
        c.uri.includes("Claude") ||
        c.uri.includes("Nvidia") ||
        c.uri.includes("Meta") ||
        c.uri.includes("Google") ||
        c.uri.includes("Microsoft")
      );
      
      // Calculate AI relevance score (0-100) - lowered threshold for better inclusion
      const aiRelevanceScore = Math.min(100, aiConcepts.length * 15);
      
      // Determine impact based on concepts and sentiment
      let impact = "medium";
      if (aiRelevanceScore > 50 || article.sentiment > 0.5 || article.sentiment < -0.5) {
        impact = "high";
      } else if (aiRelevanceScore < 20 && !article.title.toLowerCase().includes("ai")) {
        impact = "low";
      }
      
      // Extract technical complexity from content
      const technicalTerms = [
        "algorithm", "neural network", "architecture", "parameters",
        "transformer", "fine-tuning", "training", "dataset"
      ];
      const content = article.body || article.title || "";
      const technicalTermCount = technicalTerms.reduce((count, term) => {
        return count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
      }, 0);
      
      const technicalComplexity = technicalTermCount > 5 ? "advanced" : 
                                 technicalTermCount > 2 ? "intermediate" : "basic";
      
      // Parse categories for better mapping
      const categories = article.categories || [];
      let category = "breakthrough_technologies"; // Default category
      
      if (categories.some(c => c.includes("Business") || c.includes("Economy"))) {
        category = "industry_applications";
      } else if (categories.some(c => c.includes("Research") || c.includes("Science"))) {
        category = "research_papers";
      } else if (categories.some(c => c.includes("Ethics") || c.includes("Policy"))) {
        category = "ai_ethics";
      }
      
      // Calculate reading time based on content length
      const wordCount = (article.body || "").split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        title: article.title,
        description: article.body ? article.body.substring(0, 300) + "..." : article.summary || "",
        content: article.body || article.summary || "",
        url: article.url || "",
        image_url: article.image || "",
        source: article.source?.title || extractDomainFromUrl(article.url) || "Event Registry",
        date: article.date || new Date().toISOString().split('T')[0],
        category,
        impact,
        technical_complexity: technicalComplexity,
        estimated_reading_time: readingTime,
        source_credibility: article.source?.ranking?.importanceRank < 30 ? "verified" : "standard",
        article_type: "news",
        // Include additional AI-specific metadata
        ai_relevance_score: aiRelevanceScore,
        ai_companies_mentioned: extractAICompanies(article.body || article.title || ""),
        technologies_mentioned: extractAITechnologies(article.body || article.title || "")
      };
    }).filter(article => {
      // [Analysis] More lenient filter to ensure we get enough AI-related content (lowered threshold)
      return (
        article.ai_relevance_score > 15 || // Lowered threshold for better inclusion
        article.title.toLowerCase().includes("ai") ||
        article.title.toLowerCase().includes("artificial intelligence") ||
        article.title.toLowerCase().includes("machine learning") ||
        article.ai_companies_mentioned.length > 0 ||
        article.technologies_mentioned.length > 0
      );
    });
    
  } catch (error) {
    console.error("Error fetching from Event Registry:", error);
    throw error;
  }
}

// [Analysis] Enhanced function to fetch AI-focused articles from News API
async function fetchFromNewsAPIWithAIFilter(keyword, limit) {
  try {
    console.log(`Fetching from News API with advanced AI filtering: "${keyword}" and limit ${limit}`);
    
    // Build the News API URL with parameters
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // [Analysis] Create a more sophisticated query for AI news
    const aiQuery = encodeURIComponent(
      '("artificial intelligence" OR "machine learning" OR "deep learning" OR "neural network" OR "AI model" OR "large language model" OR "LLM" OR "generative AI" OR "GPT" OR "ChatGPT" OR "Claude" OR "Gemini" OR "DALL-E" OR "Midjourney" OR "Stable Diffusion" OR "AI chip" OR "AI startup") AND (OpenAI OR Anthropic OR Nvidia OR Microsoft OR Google OR Meta OR AI OR technology OR research OR development OR breakthrough OR innovation)'
    );
    
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", aiQuery);
    url.searchParams.append("from", fromDate);
    url.searchParams.append("to", toDate);
    url.searchParams.append("sortBy", "publishedAt"); // Sort by date to get newest articles
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
    
    console.log(`Retrieved ${data.articles.length} raw articles from News API`);
    
    // [Analysis] Enhanced transformation with AI relevance scoring
    return data.articles.map((article, index) => {
      // Calculate AI relevance score based on content
      const combinedText = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
      
      // Key AI terms to look for
      const aiTerms = [
        "artificial intelligence", "machine learning", "neural network", "deep learning", 
        "llm", "large language model", "gpt", "openai", "microsoft", "google", "meta", 
        "anthropic", "claude", "ai model", "transformer", "diffusion", "stable diffusion",
        "midjourney", "dall-e", "chatgpt", "gemini", "llama", "ai research", "nvidia"
      ];
      
      // Calculate score based on AI term frequency - adjusted for better inclusion
      const aiRelevanceScore = aiTerms.reduce((score, term) => {
        const matches = (combinedText.match(new RegExp(term, 'g')) || []).length;
        return score + (matches * 12); // Higher points per match
      }, 0);
      
      // Cap at 100
      const normalizedScore = Math.min(100, aiRelevanceScore);
      
      // Extract technical complexity
      const technicalTerms = [
        "algorithm", "parameters", "architecture", "embedding", "vector", 
        "training", "inference", "model", "dataset", "fine-tuning"
      ];
      
      const technicalTermCount = technicalTerms.reduce((count, term) => {
        return count + (combinedText.match(new RegExp(term, 'g')) || []).length;
      }, 0);
      
      const technicalComplexity = technicalTermCount > 5 ? "advanced" : 
                                 technicalTermCount > 2 ? "intermediate" : "basic";
      
      // Calculate reading time based on content length
      const content = article.content || article.description || "";
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      // Determine impact level
      const highImpactTerms = [
        "breakthrough", "revolutionary", "groundbreaking", "milestone", 
        "first ever", "record", "outperform", "state-of-the-art"
      ];
      
      const hasHighImpactTerms = highImpactTerms.some(term => combinedText.includes(term));
      const impact = hasHighImpactTerms || normalizedScore > 70 ? "high" : 
                    normalizedScore > 40 ? "medium" : "low";
      
      // Determine category based on content
      let category = "breakthrough_technologies"; // Default
      
      if (combinedText.includes("business") || combinedText.includes("industry") || 
          combinedText.includes("company") || combinedText.includes("market")) {
        category = "industry_applications";
      } else if (combinedText.includes("research") || combinedText.includes("paper") || 
                combinedText.includes("study") || combinedText.includes("university")) {
        category = "research_papers";
      } else if (combinedText.includes("ethics") || combinedText.includes("bias") || 
                combinedText.includes("regulation") || combinedText.includes("policy")) {
        category = "ai_ethics";
      }
      
      // Extract source credibility based on domain
      const source = article.source?.name || extractDomainFromUrl(article.url);
      const highCredibilitySources = [
        "nature.com", "science.org", "mit.edu", "stanford.edu", "ieee.org",
        "acm.org", "bbc.com", "reuters.com", "bloomberg.com", "nytimes.com",
        "washingtonpost.com", "theverge.com", "wired.com", "techcrunch.com",
        "venturebeat.com", "ai.googleblog.com", "ai.facebook.com", "blogs.microsoft.com"
      ];
      
      const sourceCredibility = highCredibilitySources.some(s => 
        (article.url || "").includes(s)) ? "verified" : "standard";
      
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
        source_credibility: sourceCredibility,
        article_type: "news",
        ai_relevance_score: normalizedScore,
        ai_companies_mentioned: extractAICompanies(combinedText),
        technologies_mentioned: extractAITechnologies(combinedText),
        featured: (index === 0) && (normalizedScore > 60) // Feature high-relevance articles
      };
    }).filter(article => {
      // [Analysis] More lenient filter to ensure we get enough AI-related content
      return article.ai_relevance_score > 20 || // Lowered threshold 
             article.ai_companies_mentioned.length > 0 ||
             article.technologies_mentioned.length > 0;
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

// [Analysis] Helper function to extract AI companies mentioned in content
function extractAICompanies(content) {
  if (!content) return [];
  
  const aiCompanies = [
    "OpenAI", "Google", "Microsoft", "Meta", "Anthropic", "Nvidia", "DeepMind",
    "Amazon", "Apple", "IBM", "Hugging Face", "Stability AI", "Cohere", "Inflection",
    "Tesla", "Baidu", "Tencent", "Alibaba", "SenseTime", "Midjourney", "Runway"
  ];
  
  return aiCompanies.filter(company => 
    new RegExp(`\\b${company}\\b`, 'i').test(content)
  );
}

// [Analysis] Helper function to extract AI technologies mentioned in content
function extractAITechnologies(content) {
  if (!content) return [];
  
  const aiTechnologies = [
    "GPT", "BERT", "Transformers", "LLM", "CNN", "GAN", "Diffusion", "RLHF", 
    "Computer Vision", "NLP", "Large Language Model", "Neural Network", "LLaMA",
    "Claude", "Mistral", "Gemini", "Stable Diffusion", "DALL-E", "ChatGPT", "Copilot"
  ];
  
  return aiTechnologies.filter(tech => 
    new RegExp(`\\b${tech}\\b`, 'i').test(content)
  );
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
        
        // If we have AI companies mentioned, store them as tags
        if (article.ai_companies_mentioned && article.ai_companies_mentioned.length > 0) {
          const tagInserts = article.ai_companies_mentioned.map(company => ({
            news_id: data.id,
            tag: company,
            created_at: new Date().toISOString()
          }));
          
          const { error: tagError } = await supabase
            .from('article_tags')
            .insert(tagInserts);
          
          if (tagError) {
            console.warn("Error inserting article tags:", tagError);
          }
        }
        
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
