
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const EVENT_REGISTRY_API_KEY = Deno.env.get('EVENT_REGISTRY_API_KEY') ?? '';
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY') ?? '';

interface NewsArticle {
  title: string;
  description: string;
  content?: string;
  url?: string;
  date: string;
  source?: string;
  category?: string;
  image_url?: string;
}

// [Analysis] Handle news sources APIs with consistent error handling
const fetchEventRegistryNews = async (keyword: string, articlesCount: number) => {
  console.log(`Fetching from Event Registry: ${keyword}, count: ${articlesCount}`);
  
  if (!EVENT_REGISTRY_API_KEY) {
    throw new Error('EVENT_REGISTRY_API_KEY is not defined');
  }
  
  const apiUrl = 'https://eventregistry.org/api/v1/article/getArticles';

  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const requestBody = {
      action: "getArticles",
      keyword: keyword,
      articlesPage: 1,
      articlesCount: articlesCount,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      articlesArticleBodyLen: -1,
      resultType: "articles",
      dataType: ["news", "blog"],
      apiKey: EVENT_REGISTRY_API_KEY,
      lang: "eng",
      dateStart: weekAgo,
      dateEnd: today
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error fetching from Event Registry: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.articles || !data.articles.results) {
      console.log('No articles found in Event Registry response');
      return [];
    }
    
    console.log(`Received ${data.articles.results.length} articles from Event Registry`);
    
    return data.articles.results.map((article: any) => ({
      title: article.title,
      description: article.body || article.summary || '',
      content: article.body || article.summary || '',
      url: article.url || null,
      date: article.date || new Date().toISOString(),
      source: article.source?.title || 'Event Registry',
      category: determineCategory(article.title, article.body || ''),
      image_url: article.image || null
    }));
  } catch (error) {
    console.error('Error fetching from Event Registry:', error);
    throw error;
  }
};

// [Analysis] Add support for NewsAPI as an alternative source
const fetchNewsAPI = async (keyword: string, articlesCount: number) => {
  console.log(`Fetching from News API: ${keyword}, count: ${articlesCount}`);
  
  if (!NEWS_API_KEY) {
    throw new Error('NEWS_API_KEY is not defined');
  }
  
  try {
    // We'll use the 'everything' endpoint to get a broad range of news
    const encodedKeyword = encodeURIComponent(keyword);
    const pageSize = Math.min(articlesCount, 100); // API limits to 100 per request
    
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodedKeyword}&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&language=en&sortBy=publishedAt`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`News API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`News API returned status: ${data.status}`);
    }
    
    console.log(`Received ${data.articles?.length || 0} articles from News API`);
    
    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description || '',
      content: article.content || article.description || '',
      url: article.url || null,
      date: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'News API',
      category: determineCategory(article.title, article.description || ''),
      image_url: article.urlToImage || null
    }));
  } catch (error) {
    console.error('Error fetching from News API:', error);
    throw error;
  }
};

// [Analysis] Determine the appropriate category based on content analysis
const determineCategory = (title: string, content: string) => {
  const text = (title + ' ' + content).toLowerCase();
  
  const categoryKeywords = {
    'breakthrough_technologies': ['breakthrough', 'groundbreaking', 'revolutionary', 'cutting-edge', 'state-of-the-art', 'advanced', 'next-gen'],
    'industry_applications': ['industry', 'business', 'enterprise', 'commercial', 'market', 'corporate', 'company', 'industrial'],
    'research_developments': ['research', 'study', 'researchers', 'scientists', 'paper', 'science', 'discovery', 'academic'],
    'ai_ethics': ['ethics', 'ethical', 'bias', 'privacy', 'trust', 'fairness', 'governance', 'discrimination'],
    'future_of_ai': ['future', 'prediction', 'outlook', 'vision', 'horizon', 'roadmap', 'coming', 'soon'],
    'ai_startups': ['startup', 'venture', 'funding', 'seed', 'investment', 'series a', 'founder', 'entrepreneur'],
    'ai_policy': ['policy', 'regulation', 'law', 'compliance', 'government', 'legal', 'framework', 'guidelines']
  };
  
  // Score each category based on keyword matches
  const scores = Object.entries(categoryKeywords).map(([category, keywords]) => {
    const score = keywords.reduce((sum, keyword) => {
      return sum + (text.includes(keyword) ? 1 : 0);
    }, 0);
    return { category, score };
  });
  
  // Sort by score and get the highest scoring category
  scores.sort((a, b) => b.score - a.score);
  
  // Default to breakthrough_technologies if no clear category
  return scores[0].score > 0 ? scores[0].category : 'breakthrough_technologies';
};

// [Analysis] Process news articles for database storage with improved duplicate checking
const processAndStoreArticles = async (
  articleData: NewsArticle[], 
  supabase: any, 
  testMode = false
) => {
  const articlesResults: any[] = [];
  const errors: any[] = [];
  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  
  // [Analysis] Create a record in news_fetch_history
  const { data: fetchRecord, error: fetchRecordError } = await supabase
    .from('news_fetch_history')
    .insert({
      source_type: 'api',
      status: 'processing',
      articles_fetched: articleData.length,
    })
    .select()
    .single();
    
  if (fetchRecordError) {
    console.error('Error creating fetch record:', fetchRecordError);
  }
  
  const fetchId = fetchRecord?.id;
  
  console.log(`Processing ${articleData.length} articles, test mode: ${testMode}`);
  
  for (const article of articleData) {
    try {
      if (!article.title) {
        console.warn('Skipping article with no title');
        skippedCount++;
        continue;
      }
      
      // [Analysis] Check for duplicates by title instead of URL since URL could be null
      // This is more reliable for determining unique content
      const { data: existingArticles, error: existingError } = await supabase
        .from('ai_news')
        .select('id, title')
        .eq('title', article.title)
        .limit(1);
        
      if (existingError) {
        console.error('Error checking for existing article:', existingError);
        errors.push({
          title: article.title,
          error: 'Error checking for duplicates',
          details: existingError
        });
        continue;
      }
      
      if (existingArticles && existingArticles.length > 0) {
        console.log(`Article already exists: ${article.title}`);
        skippedCount++;
        continue;
      }
      
      if (!testMode) {
        // Set date to ISO format if needed
        let date = article.date;
        if (date && !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // If it's a full ISO timestamp, extract just the date part
          if (date.includes('T')) {
            date = date.split('T')[0];
          } else {
            // Try to parse and format as YYYY-MM-DD
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
              date = dateObj.toISOString().split('T')[0];
            } else {
              // Fallback to today's date
              date = new Date().toISOString().split('T')[0];
            }
          }
        }
        
        // [Analysis] Insert the article into the database
        const { data: insertedArticle, error: insertError } = await supabase
          .from('ai_news')
          .insert({
            title: article.title,
            description: article.description || '',
            content: article.content || article.description || '',
            date: date,
            source: article.source || 'Unknown',
            category: article.category || 'breakthrough_technologies',
            image_url: article.image_url || null,
            article_type: 'news',
            url: article.url || null,
            status: 'published',
            impact: 'medium', // Default impact, we'll calculate this in the hook
            technical_complexity: 'intermediate', // Default complexity, we'll calculate this in the hook
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error inserting article:', insertError);
          errors.push({
            title: article.title,
            error: insertError.message,
            details: insertError
          });
          continue;
        }
        
        // [Analysis] Try to handle materialized view refresh errors gracefully
        try {
          // Call the function to refresh trending articles
          await supabase.rpc('refresh_trending_articles');
        } catch (refreshError: any) {
          // Just log the error but don't fail the import
          console.warn('Error refreshing trending articles, continuing with import:', refreshError.message);
          errors.push({
            title: article.title,
            error: refreshError.message,
            details: refreshError
          });
          // We continue with the process - this is non-fatal
        }
        
        console.log(`Article inserted: ${article.title} [${insertedArticle.id}]`);
        articlesResults.push(insertedArticle);
        addedCount++;
      } else {
        // In test mode, just return the article data
        console.log(`Test mode: would insert ${article.title}`);
        articlesResults.push(article);
      }
    } catch (error: any) {
      console.error(`Error processing article "${article.title}":`, error);
      errors.push({
        title: article.title,
        error: error.message,
        details: error
      });
    }
  }
  
  // [Analysis] Update the fetch history record with results
  if (fetchId && !testMode) {
    await supabase
      .from('news_fetch_history')
      .update({
        status: errors.length > 0 ? 'completed_with_errors' : 'completed',
        articles_added: addedCount,
        articles_updated: updatedCount,
        duplicates_skipped: skippedCount,
        metadata: {
          errors_count: errors.length,
          last_error: errors.length > 0 ? errors[errors.length - 1].error : null
        }
      })
      .eq('id', fetchId);
  }
  
  return {
    articlesAdded: addedCount,
    articlesUpdated: updatedCount,
    skipped: skippedCount,
    errors,
    articles: articlesResults
  };
};

// [Analysis] Main handler for fetching news from selected sources
const fetchAiNews = async (keyword: string, limit: number, testMode: boolean, source: 'event_registry' | 'news_api' = 'event_registry') => {
  try {
    console.log(`Starting AI news fetch from ${source}...`, { keyword, limit, testMode });
    
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    
    // [Analysis] Track which API is being used
    let apiSource = '';
    let articles: NewsArticle[] = [];
    
    if (source === 'event_registry') {
      apiSource = 'Event Registry';
      articles = await fetchEventRegistryNews(keyword, limit);
    } else if (source === 'news_api') {
      apiSource = 'News API';
      articles = await fetchNewsAPI(keyword, limit);
    } else {
      throw new Error(`Unknown source: ${source}`);
    }
    
    console.log(`Fetched ${articles.length} articles from ${apiSource}`);
    
    if (articles.length === 0) {
      return {
        success: true,
        message: `No articles found for query "${keyword}" from ${apiSource}`,
        count: 0,
        articles: []
      };
    }
    
    const result = await processAndStoreArticles(articles, supabase, testMode);
    
    // [Analysis] Update the news_sources table to track last fetch time
    if (!testMode) {
      const { error: sourceUpdateError } = await supabase
        .from('news_sources')
        .upsert({
          name: apiSource,
          url: source === 'event_registry' ? 'https://eventregistry.org' : 'https://newsapi.org',
          last_fetched_at: new Date().toISOString(),
          source_type: source,
          is_active: true
        }, { 
          onConflict: 'name',
          ignoreDuplicates: false
        });
        
      if (sourceUpdateError) {
        console.error('Error updating news_sources:', sourceUpdateError);
      }
    }
    
    return {
      success: true,
      message: testMode 
        ? `Found ${articles.length} articles from ${apiSource} (test mode)` 
        : `Successfully imported ${result.articlesAdded} out of ${articles.length} articles from ${apiSource}`,
      count: testMode ? articles.length : result.articlesAdded,
      errors: result.errors,
      articles: testMode ? articles : result.articles
    };
  } catch (error: any) {
    console.error('Error in fetchAiNews:', error);
    return {
      success: false,
      message: `Error fetching AI news: ${error.message}`,
      count: 0,
      errors: [{ error: error.message, details: error }],
      articles: []
    };
  }
};

serve(async (req) => {
  try {
    const { keyword = 'artificial intelligence', limit = 10, testMode = false, source = 'event_registry' } = await req.json();
    
    console.log('Request received:', { keyword, limit, testMode, source });
    
    const result = await fetchAiNews(keyword, limit, testMode, source);
    
    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error handling request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error: ${error.message}`,
        count: 0,
        errors: [{ error: error.message, stack: error.stack }],
        articles: []
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
