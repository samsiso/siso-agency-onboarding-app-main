
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { XMLParser } from 'https://esm.sh/fast-xml-parser@4.2.7';

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Use environment variables for API credentials
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

// [Analysis] We use Event Registry API for news fetching with good article metadata
const EVENT_REGISTRY_API_KEY = Deno.env.get('EVENT_REGISTRY_API_KEY') ?? '';
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY') ?? '';

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// [Analysis] Get articles from Event Registry API
async function fetchArticlesFromEventRegistry(keyword: string, limit: number) {
  try {
    console.log(`Fetching articles from Event Registry for keyword: ${keyword}, limit: ${limit}`);
    
    const url = 'http://eventregistry.org/api/v1/article/getArticles';
    
    // Calculate date range for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    console.log(`Date range: ${formattedStartDate} to ${formattedEndDate}`);

    // [Analysis] Request with comprehensive filtering for AI-related news only
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
      dateStart: formattedStartDate,
      dateEnd: formattedEndDate,
      keywordLoc: "title,body",
      keywordOper: "or"
    };

    // Make API request to Event Registry
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Event Registry API failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.articles?.results?.length || 0} articles from Event Registry API`);
    
    // [Analysis] Transform the response to our standardized article format
    if (data.articles && data.articles.results) {
      return data.articles.results.map((article: any) => {
        // Extract image if available
        let imageUrl = null;
        if (article.image) {
          imageUrl = article.image;
        }
        
        // Format the date properly
        let date = new Date();
        if (article.date) {
          date = new Date(article.date);
        }
        
        // Clean up and extract source
        let source = 'Event Registry';
        if (article.source && article.source.title) {
          source = article.source.title;
        }

        // Map categories to our predefined ones
        let category = 'breakthrough_technologies';
        if (article.categories) {
          if (article.categories.includes('robotics') || article.categories.includes('automation')) {
            category = 'robotics_automation';
          } else if (article.categories.includes('language') || article.categories.includes('nlp')) {
            category = 'language_models';
          } else if (article.categories.includes('industry') || article.categories.includes('business')) {
            category = 'industry_applications';
          } else if (article.categories.includes('international') || article.categories.includes('global')) {
            category = 'international_developments';
          }
        }

        return {
          title: article.title,
          description: article.description || article.body || article.title,
          content: article.body || article.description || '',
          date: formatDate(date),
          url: article.url || null,
          source: source,
          image_url: imageUrl,
          category: category
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching from Event Registry API:', error);
    throw error;
  }
}

// [Analysis] Get articles from News API as an alternative source
async function fetchArticlesFromNewsAPI(keyword: string, limit: number) {
  try {
    console.log(`Fetching articles from News API for keyword: ${keyword}, limit: ${limit}`);
    
    // Calculate date for 7 days ago
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const fromDate = formatDate(weekAgo);
    const toDate = formatDate(today);
    
    console.log(`Date range: ${fromDate} to ${toDate}`);

    // Construct the News API URL with parameters
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&from=${fromDate}&to=${toDate}&sortBy=publishedAt&pageSize=${limit}&language=en&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`News API failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.articles?.length || 0} articles from News API`);
    
    // Transform News API format to our standardized article format
    if (data.articles && data.articles.length > 0) {
      return data.articles.map((article: any) => {
        // Format the date properly
        let date = new Date();
        if (article.publishedAt) {
          date = new Date(article.publishedAt);
        }

        // Map to a category based on content analysis
        let category = 'breakthrough_technologies';
        const contentLower = (article.content || article.description || '').toLowerCase();
        
        if (contentLower.includes('robot') || contentLower.includes('automat')) {
          category = 'robotics_automation';
        } else if (contentLower.includes('language') || contentLower.includes('llm') || contentLower.includes('chat')) {
          category = 'language_models';
        } else if (contentLower.includes('business') || contentLower.includes('industry') || contentLower.includes('company')) {
          category = 'industry_applications';
        } else if (contentLower.includes('country') || contentLower.includes('national') || contentLower.includes('global')) {
          category = 'international_developments';
        }

        return {
          title: article.title,
          description: article.description || article.title,
          content: article.content || article.description || '',
          date: formatDate(date),
          url: article.url || null,
          source: article.source?.name || 'News API',
          image_url: article.urlToImage || null,
          category: category
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching from News API:', error);
    throw error;
  }
}

// [Analysis] Async function to check if an article already exists based on title (since URLs might be null)
async function checkArticleExists(title: string) {
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('id')
      .eq('title', title)
      .limit(1);
    
    if (error) {
      console.error('Error checking for duplicate article:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Unexpected error during duplicate check:', error);
    return false;
  }
}

// [Analysis] Update the news_sources table with the last fetched timestamp
async function updateNewsSourceTimestamp(sourceType: 'event_registry' | 'news_api') {
  try {
    const { error } = await supabase
      .from('news_sources')
      .upsert({
        source_type: sourceType,
        last_fetched_at: new Date().toISOString(),
      }, {
        onConflict: 'source_type'
      });
    
    if (error) {
      console.error('Error updating news source timestamp:', error);
    }
  } catch (error) {
    console.error('Unexpected error updating source timestamp:', error);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { keyword, limit, testMode, source } = await req.json();
    
    // Set defaults if not provided
    const searchKeyword = keyword || 'artificial intelligence';
    const articleLimit = limit || 10;
    const articleSource = source || 'event_registry';
    const isTestMode = testMode === true; // Explicit boolean check
    
    console.log(`Processing request with parameters:`, { 
      keyword: searchKeyword, 
      limit: articleLimit, 
      source: articleSource,
      testMode: isTestMode 
    });

    // Fetch articles from the specified source
    let fetchedArticles: any[] = [];
    
    if (articleSource === 'event_registry') {
      fetchedArticles = await fetchArticlesFromEventRegistry(searchKeyword, articleLimit);
    } else {
      fetchedArticles = await fetchArticlesFromNewsAPI(searchKeyword, articleLimit);
    }
    
    console.log(`Retrieved ${fetchedArticles.length} articles`);

    // If in test mode, just return the articles without inserting
    if (isTestMode) {
      console.log('Test mode enabled. Returning articles without database insertion.');
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully retrieved ${fetchedArticles.length} articles in test mode`,
          count: fetchedArticles.length,
          articles: fetchedArticles
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process and insert articles
    let importedCount = 0;
    const errors: any[] = [];
    
    for (const article of fetchedArticles) {
      try {
        // Check if article already exists
        const exists = await checkArticleExists(article.title);
        if (exists) {
          console.log(`Article "${article.title}" already exists. Skipping.`);
          continue;
        }

        // [Analysis] Prepare article data for insertion
        const articleData = {
          title: article.title,
          description: article.description,
          content: article.content,
          date: article.date,
          category: article.category,
          article_type: 'news',
          source: article.source,
          source_credibility: 'verified',
          technical_complexity: 'intermediate',
          impact: 'medium',
          image_url: article.image_url,
          url: article.url,
          status: 'published'
        };

        // Insert the article
        console.log(`Inserting article: ${article.title}`);
        const { error } = await supabase.from('ai_news').insert([articleData]);

        if (error) {
          console.error(`Failed to insert article "${article.title}":`, error);
          
          // Special case for materialized view error
          if (error.message && error.message.includes('materialized view mv_trending_articles')) {
            console.warn(`Materialized view permission issue detected. Recording error but continuing.`);
            errors.push({
              title: article.title,
              error: error.message,
              details: error
            });
            continue;
          }
          
          throw error;
        }

        importedCount++;
        console.log(`Successfully imported article: ${article.title}`);
      } catch (error) {
        console.error(`Error processing article "${article.title}":`, error);
        errors.push({
          title: article.title,
          error: error.message || 'Unknown error',
          details: error
        });
      }
    }

    // Update the news source timestamp
    await updateNewsSourceTimestamp(articleSource as 'event_registry' | 'news_api');

    // Return the response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${importedCount} out of ${fetchedArticles.length} articles`,
        count: importedCount,
        errors: errors,
        articles: fetchedArticles
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: error.toString(),
        stack: error.stack || 'No stack trace available'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
