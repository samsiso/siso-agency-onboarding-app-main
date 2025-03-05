
// [Analysis] Edge function to fetch AI news from various sources and store in Supabase
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

// [Analysis] CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// [Analysis] Configurable log level to control debug output
const LOG_LEVEL = 'debug'; // 'debug', 'info', 'warn', 'error'

// [Analysis] Custom logger with levels
const logger = {
  debug: (...args: any[]) => {
    if (LOG_LEVEL === 'debug') console.log('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (['debug', 'info'].includes(LOG_LEVEL)) console.log('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(LOG_LEVEL)) console.log('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  }
};

// [Analysis] Function to fetch AI news from Event Registry API with enhanced error handling and flexibility
async function fetchFromEventRegistry(keyword = "artificial intelligence", fromDate: string | null = null, toDate: string | null = null) {
  try {
    // Get API key from environment
    const apiKey = Deno.env.get("EVENT_REGISTRY_API_KEY");
    if (!apiKey) {
      throw new Error("EVENT_REGISTRY_API_KEY is not set");
    }

    // [Analysis] Expand keywords to get more results
    const keywords = keyword.split(',').map(k => k.trim());
    const keywordQuery = keywords.map(k => `"${k}"`).join(" OR ");
    
    logger.info(`Fetching articles with keywords: ${keywordQuery}`);
    
    // [Analysis] Construct date parameters if provided
    let dateParams = {};
    if (fromDate && toDate) {
      dateParams = {
        dateStart: fromDate,
        dateEnd: toDate
      };
      logger.info(`Date range: ${fromDate} to ${toDate}`);
    }
    
    // [Analysis] Build request body
    const requestBody = {
      action: "getArticles",
      keyword: keywordQuery,
      articlesPage: 1,
      articlesCount: 100,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: "articles",
      dataType: ["news", "blog"],
      apiKey: apiKey,
      forceMaxDataTimeWindow: 31,
      ...dateParams
    };

    logger.debug("Event Registry request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://eventregistry.org/api/v1/article/getArticles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    logger.debug(`Event Registry response status: ${response.status}`);
    logger.info(`Total articles found: ${data.articles?.results?.length || 0}`);

    if (!data.articles || !data.articles.results) {
      logger.warn("No articles found or unexpected API response format");
      return [];
    }

    // [Analysis] Map articles to a more usable format
    return data.articles.results.map((article: any) => {
      // [Analysis] Extract date in YYYY-MM-DD format
      const date = new Date(article.date);
      const formattedDate = date.toISOString().split('T')[0];
      
      return {
        title: article.title,
        description: article.body || article.description || "",
        content: article.body || article.description || "",
        date: formattedDate,
        image_url: article.image,
        url: article.url,
        source: article.source?.title || "Event Registry",
      };
    });
  } catch (error) {
    logger.error("Error fetching from Event Registry:", error);
    throw error;
  }
}

// [Analysis] Function to fetch AI news from News API with enhanced error handling
async function fetchFromNewsAPI(keyword = "artificial intelligence", fromDate: string | null = null, toDate: string | null = null) {
  try {
    // Get API key from environment
    const apiKey = Deno.env.get("NEWS_API_KEY");
    if (!apiKey) {
      throw new Error("NEWS_API_KEY is not set");
    }

    // [Analysis] Build URL with parameters
    let url = new URL("https://newsapi.org/v2/everything");
    
    // [Analysis] Expand keywords to get more results
    const keywords = keyword.split(',').map(k => k.trim());
    const keywordQuery = keywords.join(" OR ");
    
    url.searchParams.append("q", keywordQuery);
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("language", "en");
    url.searchParams.append("pageSize", "100");
    
    // [Analysis] Add date parameters if provided
    if (fromDate) {
      url.searchParams.append("from", fromDate);
    }
    if (toDate) {
      url.searchParams.append("to", toDate);
    }
    
    logger.info(`Fetching News API with keywords: ${keywordQuery}`);
    logger.debug(`News API URL: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    logger.debug(`News API response status: ${response.status}`);
    logger.info(`Total articles found: ${data.articles?.length || 0}`);

    if (!data.articles) {
      logger.warn("No articles found or unexpected API response format");
      return [];
    }

    // [Analysis] Map articles to a more usable format
    return data.articles.map((article: any) => {
      // [Analysis] Extract date in YYYY-MM-DD format
      const date = new Date(article.publishedAt);
      const formattedDate = date.toISOString().split('T')[0];
      
      return {
        title: article.title,
        description: article.description || "",
        content: article.content || article.description || "",
        date: formattedDate,
        image_url: article.urlToImage,
        url: article.url,
        source: article.source?.name || "News API",
      };
    });
  } catch (error) {
    logger.error("Error fetching from News API:", error);
    throw error;
  }
}

// [Analysis] Process batch to insert articles into the database with better error handling
async function processBatch(supabase: any, articles: any[], testMode: boolean, existingArticleUrls: Set<string>) {
  const results = {
    inserted: 0,
    skipped: 0,
    errors: [] as string[],
  };

  // [Analysis] Skip processing if test mode is enabled
  if (testMode) {
    logger.info("Test mode enabled - not inserting articles");
    return results;
  }

  // [Analysis] Process articles in smaller batches to avoid timeouts
  const batchSize = 10;
  const batches = [];
  
  for (let i = 0; i < articles.length; i += batchSize) {
    batches.push(articles.slice(i, i + batchSize));
  }
  
  logger.info(`Processing ${batches.length} batches of articles`);

  for (const batch of batches) {
    // [Analysis] Filter out articles with existing URLs
    const newArticles = batch.filter((article: any) => !article.url || !existingArticleUrls.has(article.url));
    
    if (newArticles.length === 0) {
      logger.info("All articles in this batch already exist - skipping");
      results.skipped += batch.length;
      continue;
    }

    // [Analysis] Prepare articles for insertion with required fields
    const articlesToInsert = newArticles.map((article: any) => {
      // [Analysis] Generate category based on content analysis
      let category = 'industry_applications';
      const content = (article.content || article.description || '').toLowerCase();
      
      if (content.includes('breakthrough') || content.includes('discovery') || content.includes('innovation')) {
        category = 'breakthrough_technologies';
      } else if (content.includes('language model') || content.includes('llm') || content.includes('gpt')) {
        category = 'language_models';
      } else if (content.includes('robot') || content.includes('automation')) {
        category = 'robotics_automation';
      } else if (content.includes('international') || content.includes('global') || content.includes('country')) {
        category = 'international_developments';
      }

      return {
        title: article.title,
        description: article.description || "",
        content: article.content || article.description || "",
        date: article.date,
        category: category,
        source: article.source,
        image_url: article.image_url,
        url: article.url,
        status: 'published',
        technical_complexity: getComplexity(article.content || article.description || ""),
        impact: getImpact(article.title, article.content || article.description || ""),
        reading_time: calculateReadingTime(article.content || article.description || ""),
      };
    });

    try {
      logger.debug(`Inserting ${articlesToInsert.length} articles`);
      
      // [Analysis] Insert articles into the database
      const { data, error } = await supabase
        .from('ai_news')
        .insert(articlesToInsert)
        .select();

      if (error) {
        logger.error("Error inserting batch:", error);
        results.errors.push(`Batch error: ${error.message}`);
      } else {
        logger.info(`Successfully inserted ${data.length} articles`);
        results.inserted += data.length;
        results.skipped += (newArticles.length - data.length);
      }
    } catch (error) {
      logger.error("Exception processing batch:", error);
      results.errors.push(`Batch exception: ${error.message || 'Unknown error'}`);
    }
  }

  return results;
}

// [Analysis] Function to fetch existing article URLs to avoid duplicates
async function fetchExistingArticleUrls(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('url')
      .not('url', 'is', null);
    
    if (error) {
      logger.error("Error fetching existing URLs:", error);
      return new Set();
    }
    
    const urls = new Set(data.map((item: any) => item.url));
    logger.info(`Fetched ${urls.size} existing article URLs`);
    return urls;
  } catch (error) {
    logger.error("Exception fetching existing URLs:", error);
    return new Set();
  }
}

// [Analysis] Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  // [Analysis] Approximate reading time based on words (average 200 words per minute)
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// [Analysis] Helper function to determine technical complexity
function getComplexity(content: string): string {
  const technicalTerms = [
    'machine learning', 'neural network', 'deep learning', 'algorithm',
    'reinforcement learning', 'transformer', 'generative adversarial', 'convolutional',
    'recurrent neural', 'lstm', 'attention mechanism', 'embedding',
    'gradient descent', 'backpropagation', 'hyperparameter', 'optimization'
  ];
  
  const contentLower = content.toLowerCase();
  let termCount = 0;
  
  for (const term of technicalTerms) {
    if (contentLower.includes(term)) {
      termCount++;
    }
  }
  
  if (termCount >= 4) {
    return 'advanced';
  } else if (termCount >= 2) {
    return 'intermediate';
  } else {
    return 'basic';
  }
}

// [Analysis] Helper function to determine impact level
function getImpact(title: string, content: string): string {
  const highImpactTerms = [
    'revolutionary', 'breakthrough', 'groundbreaking', 'milestone',
    'transformative', 'disruption', 'paradigm shift', 'unprecedented',
    'game-changer', 'radical', 'landmark', 'major advance'
  ];
  
  const combined = (title + ' ' + content).toLowerCase();
  
  for (const term of highImpactTerms) {
    if (combined.includes(term)) {
      return 'high';
    }
  }
  
  // [Analysis] Check for moderate impact terms
  const moderateImpactTerms = [
    'improve', 'enhance', 'upgrade', 'advance', 'progress',
    'development', 'innovation', 'new approach'
  ];
  
  for (const term of moderateImpactTerms) {
    if (combined.includes(term)) {
      return 'medium';
    }
  }
  
  return 'low';
}

// [Analysis] Check if a date exists in the database
async function checkDateExistence(supabase: any, date: string) {
  try {
    const { data, error, count } = await supabase
      .from('ai_news')
      .select('id', { count: 'exact' })
      .eq('date', date)
      .eq('status', 'published');
    
    if (error) {
      logger.error(`Error checking date ${date}:`, error);
      return { exists: false, count: 0 };
    }
    
    return { exists: count > 0, count };
  } catch (error) {
    logger.error(`Exception checking date ${date}:`, error);
    return { exists: false, count: 0 };
  }
}

// [Analysis] Get a list of empty dates in a month
async function getEmptyDates(supabase: any, year: number, month: number) {
  try {
    // Generate all dates in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const allDates = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      allDates.push(dateStr);
    }
    
    // Check which dates have no articles
    const emptyDates = [];
    
    for (const date of allDates) {
      const { exists, count } = await checkDateExistence(supabase, date);
      if (!exists || count < 3) { // Consider dates with fewer than 3 articles as "empty"
        emptyDates.push({ date, count });
      }
    }
    
    logger.info(`Found ${emptyDates.length} empty or sparse dates in ${year}-${month}`);
    return emptyDates;
  } catch (error) {
    logger.error(`Exception getting empty dates:`, error);
    return [];
  }
}

// [Analysis] Main function to handle HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { 
      keyword = "artificial intelligence",
      limit = 20,
      testMode = false,
      source = "event_registry",
      fromDate = null,
      toDate = null,
      year = null,
      month = null,
      fillEmptyDates = false,
      debug = false
    } = await req.json();
    
    if (debug) {
      logger.debug("Request body:", { keyword, limit, testMode, source, fromDate, toDate, year, month, fillEmptyDates });
    }

    // [Analysis] Special logic for filling empty dates
    if (fillEmptyDates && year && month) {
      const emptyDates = await getEmptyDates(supabase, year, month);
      logger.info(`Found ${emptyDates.length} empty dates to fill`);
      
      if (emptyDates.length === 0) {
        return new Response(
          JSON.stringify({
            success: true,
            message: `No empty dates found for ${year}-${month}`,
            dates: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Fetch existing article URLs to avoid duplicates
      const existingUrls = await fetchExistingArticleUrls(supabase);
      
      const results = [];
      
      for (const { date, count } of emptyDates) {
        logger.info(`Processing empty date: ${date} (current count: ${count})`);
        
        // Fetch articles specific to this date
        let articles = [];
        try {
          if (source === 'event_registry' || source === 'both') {
            const erArticles = await fetchFromEventRegistry(keyword, date, date);
            articles = [...articles, ...erArticles];
          }
          
          if (source === 'news_api' || source === 'both') {
            const naArticles = await fetchFromNewsAPI(keyword, date, date);
            articles = [...articles, ...naArticles];
          }
          
          logger.info(`Fetched ${articles.length} articles for date ${date}`);
          
          // Process batch for this date
          const result = await processBatch(supabase, articles, testMode, existingUrls);
          
          results.push({
            date,
            previousCount: count,
            fetched: articles.length,
            inserted: result.inserted,
            skipped: result.skipped,
            errors: result.errors
          });
          
          // Add new URLs to the existing set
          articles.forEach(article => {
            if (article.url) {
              existingUrls.add(article.url);
            }
          });
        } catch (error) {
          logger.error(`Error processing date ${date}:`, error);
          results.push({
            date,
            error: error.message || 'Unknown error',
            fetched: 0,
            inserted: 0,
            skipped: 0
          });
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Processed ${emptyDates.length} empty dates for ${year}-${month}`,
          results
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Proceed with regular fetch logic
    let articles = [];
    
    // Fetch articles from the selected source
    if (source === 'event_registry' || source === 'both') {
      const erArticles = await fetchFromEventRegistry(keyword, fromDate, toDate);
      articles = [...articles, ...erArticles];
      logger.info(`Fetched ${erArticles.length} articles from Event Registry`);
    }
    
    if (source === 'news_api' || source === 'both') {
      const naArticles = await fetchFromNewsAPI(keyword, fromDate, toDate);
      articles = [...articles, ...naArticles];
      logger.info(`Fetched ${naArticles.length} articles from News API`);
    }
    
    // Limit the number of articles if needed
    if (limit && articles.length > limit) {
      articles = articles.slice(0, limit);
      logger.info(`Limited articles to ${limit}`);
    }

    // If test mode is on, just return the articles without inserting
    if (testMode) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully retrieved ${articles.length} articles from ${source}`,
          count: articles.length,
          articles,
          errors: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch existing article URLs to avoid duplicates
    const existingUrls = await fetchExistingArticleUrls(supabase);
    
    // Process articles in batches
    const result = await processBatch(supabase, articles, false, existingUrls);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: result.inserted > 0 
          ? `Successfully inserted all ${result.inserted} articles.` 
          : "No new articles to insert.",
        count: result.inserted,
        errors: result.errors,
        articles
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // [Analysis] Improved error reporting
    logger.error("Error in main function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An unknown error occurred",
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
