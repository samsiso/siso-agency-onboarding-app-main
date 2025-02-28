import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EVENT_REGISTRY_API_KEY = Deno.env.get('EVENT_REGISTRY_API_KEY')!;

// [Analysis] Initialize Supabase with service role to allow write operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// [Analysis] Serve HTTP requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting fetch-ai-news edge function');
    
    // [Analysis] Parse request body
    const { keyword, limit, testMode } = await req.json();
    
    console.log(`Parameters: keyword=${keyword}, limit=${limit}, testMode=${testMode}`);

    // [Analysis] Validate parameters
    if (!keyword) {
      throw new Error('Missing keyword parameter');
    }

    // [Analysis] Update source timestamp before fetching to ensure we record activity
    await updateDataSourceTimestamp('event_registry');

    // [Analysis] Fetch articles from Event Registry API
    console.log('Fetching articles from Event Registry API...');
    const articles = await fetchArticlesFromEventRegistry(keyword, limit || 10);
    
    console.log(`Fetched ${articles.length} articles from Event Registry API`);

    // [Analysis] In test mode, just return the articles without importing
    if (testMode) {
      console.log('Test mode: returning articles without importing');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully fetched articles in test mode',
          count: articles.length,
          articles,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // [Analysis] Import articles to database
    console.log('Starting import of articles to database...');
    let importedCount = 0;
    const errors = [];
    const processedArticles = [];

    for (const article of articles) {
      try {
        // [Analysis] Transform and validate article
        const processedArticle = transformArticle(article);
        
        // [Analysis] Check if article already exists using title instead of URL
        const existingArticle = await checkArticleExists(processedArticle.title);
        
        if (existingArticle) {
          console.log(`Article already exists: ${processedArticle.title.substring(0, 30)}...`);
          continue;
        }

        // [Analysis] Insert article into database
        const { data, error } = await supabase
          .from('ai_news')
          .insert([processedArticle]);

        if (error) {
          console.error(`Error inserting article: ${error.message}`, error);
          errors.push({
            title: processedArticle.title,
            error: error.message,
            details: error
          });
          continue;
        }

        console.log(`Successfully imported article: ${processedArticle.title.substring(0, 30)}...`);
        importedCount++;
        processedArticles.push(processedArticle);
      } catch (err) {
        console.error(`Error processing article: ${err.message}`);
        errors.push({
          article: article?.title || 'Unknown',
          error: err.message
        });
      }
    }

    // [Analysis] Log import results
    await logImportResults('event_registry', {
      keyword,
      totalFetched: articles.length,
      imported: importedCount,
      errors: errors.length,
    });

    // [Analysis] Return success response
    console.log(`Import complete. Imported ${importedCount} articles. Errors: ${errors.length}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${importedCount} out of ${articles.length} articles`,
        count: importedCount,
        errors: errors.length > 0 ? errors : undefined,
        articles: processedArticles,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // [Analysis] Handle all uncaught errors
    console.error(`Unhandled error: ${error.message}`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error: ${error.message}`,
        error: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// [Analysis] Check if article already exists based on title
async function checkArticleExists(title: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('id')
      .eq('title', title)
      .maybeSingle();

    if (error) {
      console.error(`Error checking if article exists: ${error.message}`);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(`Error in checkArticleExists: ${error.message}`);
    return false;
  }
}

// [Analysis] Transform raw article data to match database schema
function transformArticle(article: any) {
  // [Analysis] Extract domain from URL for source
  let source = article.source || 'EventRegistry';
  if (article.url) {
    try {
      const urlObj = new URL(article.url);
      source = urlObj.hostname.replace('www.', '');
    } catch (e) {
      // Keep original source if URL parsing fails
      console.log(`Failed to parse URL: ${article.url}, using original source`);
    }
  }

  // [Analysis] Determine article category
  let category = 'breakthrough_technologies'; // Default category
  const title = article.title || '';
  const body = article.body || article.content || article.summary || '';
  
  if (title.toLowerCase().includes('language model') || 
      body.toLowerCase().includes('language model') ||
      title.toLowerCase().includes('llm') || 
      body.toLowerCase().includes('llm') ||
      title.toLowerCase().includes('gpt') || 
      body.toLowerCase().includes('gpt')) {
    category = 'language_models';
  } else if (title.toLowerCase().includes('robot') || 
      body.toLowerCase().includes('robot') ||
      title.toLowerCase().includes('automation') || 
      body.toLowerCase().includes('automation')) {
    category = 'robotics_automation';
  } else if (title.toLowerCase().includes('industry') || 
      body.toLowerCase().includes('industry') ||
      title.toLowerCase().includes('business') || 
      body.toLowerCase().includes('business')) {
    category = 'industry_applications';
  }

  // [Analysis] Generate description if not present
  let description = article.description || article.summary || '';
  if (!description && body) {
    // Take first 150 characters as description
    description = body.substring(0, 150) + '...';
  }

  // [Analysis] Clean up and standardize content
  const content = article.body || article.content || description || '';

  // [Analysis] Format date properly
  const date = article.date || article.dateTime || article.published || new Date().toISOString();
  
  // [Analysis] Calculate reading time
  const wordCount = (content.match(/\S+/g) || []).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // [Analysis] Return properly structured article object
  return {
    title: article.title || 'Untitled AI Article',
    description: description,
    content: content,
    date: typeof date === 'string' ? date : new Date(date).toISOString(),
    category: category,
    article_type: 'news',
    status: 'published',
    source: source,
    source_credibility: 'verified',
    featured: false,
    technical_complexity: 'intermediate',
    impact: 'medium',
    reading_time: readingTime,
    views: 0,
    bookmarks: 0,
    url: article.url || null, // Handle null URLs
    image_url: article.image || article.imageUrl || article.urlToImage || '',
  };
}

// [Analysis] Fetch articles from Event Registry API with improved error handling
async function fetchArticlesFromEventRegistry(keyword: string, limit: number) {
  console.log(`Event Registry API request: keyword=${keyword}, limit=${limit}`);
  
  try {
    const apiUrl = 'https://eventregistry.org/api/v1/article/getArticles';
    
    // [Analysis] Set up request parameters to enhance AI news coverage
    const requestBody = {
      action: 'getArticles',
      keyword: keyword,
      articlesPage: 1,
      articlesCount: limit,
      articlesSortBy: 'date',
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1, // Get full article body when available
      resultType: 'articles',
      dataType: ['news', 'blog'],
      lang: 'eng',
      apiKey: EVENT_REGISTRY_API_KEY,
    };

    // [Analysis] Make API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Event Registry API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Event Registry API response data structure:', Object.keys(data));

    // [Analysis] Process and extract articles
    if (!data.articles || !data.articles.results) {
      console.error('Unexpected API response structure:', data);
      return [];
    }

    // [Analysis] Map articles to consistent format
    const articles = data.articles.results.map((article: any) => {
      return {
        title: article.title,
        description: article.body || article.summary,
        content: article.body,
        source: article.source?.title || 'EventRegistry',
        url: article.url,
        image: article.image,
        date: article.dateTime,
        category: 'breakthrough_technologies', // Default category, refined later
      };
    });

    return articles;
  } catch (error) {
    console.error(`Error fetching from Event Registry: ${error.message}`);
    throw error; // Re-throw to be handled by the main function
  }
}

// [Analysis] Update last_fetched_at timestamp for the data source
async function updateDataSourceTimestamp(sourceType: string) {
  try {
    const { data, error } = await supabase
      .from('news_sources')
      .upsert({
        source_type: sourceType,
        last_fetched_at: new Date().toISOString(),
      }, { onConflict: 'source_type' });

    if (error) {
      console.error(`Error updating news source timestamp: ${error.message}`);
    } else {
      console.log(`Updated last_fetched_at for ${sourceType}`);
    }
  } catch (error) {
    console.error(`Error in updateDataSourceTimestamp: ${error.message}`);
  }
}

// [Analysis] Log import results for analytics
async function logImportResults(sourceType: string, results: any) {
  try {
    const { error } = await supabase
      .from('news_fetch_history')
      .insert([{
        source_type: sourceType,
        fetch_time: new Date().toISOString(),
        keyword: results.keyword,
        total_fetched: results.totalFetched,
        imported_count: results.imported,
        error_count: results.errors,
      }]);

    if (error) {
      console.error(`Error logging import results: ${error.message}`);
    }
  } catch (error) {
    console.error(`Error in logImportResults: ${error.message}`);
  }
}
