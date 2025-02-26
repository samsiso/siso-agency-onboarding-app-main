
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';
import { corsHeaders } from '../_shared/cors.ts';

// [Analysis] Configure Supabase and edge function for news fetching
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract the request body
    const { keyword = "artificial intelligence", dateFrom, dateTo, limit = 20 } = await req.json();
    
    // Get API key from environment variable
    const eventRegistryApiKey = Deno.env.get('EVENT_REGISTRY_API_KEY');
    if (!eventRegistryApiKey) {
      throw new Error('EVENT_REGISTRY_API_KEY is not set in edge function secrets');
    }

    // Format dates properly
    const today = new Date();
    const defaultDateFrom = new Date(today);
    defaultDateFrom.setDate(today.getDate() - 3); // Default to 3 days ago
    
    const fromDate = dateFrom || defaultDateFrom.toISOString().split('T')[0];
    const toDate = dateTo || today.toISOString().split('T')[0];
    
    console.log(`Fetching news from ${fromDate} to ${toDate} for keyword: ${keyword}`);
    
    // EventRegistry API request
    const response = await fetch('http://eventregistry.org/api/v1/article/getArticles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getArticles',
        keyword: keyword,
        articlesPage: 1,
        articlesCount: limit,
        articlesSortBy: 'date',
        articlesSortByAsc: false,
        articlesArticleBodyLen: -1,
        resultType: 'articles',
        dataType: ['news', 'blog'],
        lang: 'eng',
        dateStart: fromDate,
        dateEnd: toDate,
        apiKey: eventRegistryApiKey,
      }),
    });

    const data = await response.json();
    
    if (!data.articles || !data.articles.results) {
      throw new Error('Failed to fetch articles from Event Registry API');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Process and store articles
    const articles = data.articles.results;
    console.log(`Fetched ${articles.length} articles, processing for storage...`);
    
    // Map API data to our schema
    const processedArticles = articles.map((article: any) => {
      // Determine impact level based on sentiment and social shares
      const sentimentScore = article.sentiment || 0;
      const socialScore = (article.shares?.facebook || 0) + (article.shares?.twitter || 0);
      
      let impact = 'medium';
      if (sentimentScore > 0.5 || socialScore > 1000) impact = 'high';
      if (sentimentScore < -0.5) impact = 'low';
      
      // Determine technical complexity based on concept weights and language
      const techConcepts = ['algorithm', 'machine learning', 'neural network', 'deep learning'];
      const techConceptsPresent = techConcepts.some(concept => 
        article.body?.toLowerCase().includes(concept)
      );
      
      let technicalComplexity = 'intermediate';
      if (techConceptsPresent && article.body?.length > 3000) {
        technicalComplexity = 'advanced';
      } else if (!techConceptsPresent && article.body?.length < 1500) {
        technicalComplexity = 'basic';
      }
      
      // Calculate reading time
      const wordCount = article.body?.split(/\s+/).length || 0;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        title: article.title,
        description: article.summary || article.body?.substring(0, 200) || '',
        content: article.body || article.summary || '',
        date: article.date.substring(0, 10), // YYYY-MM-DD format
        category: mapToCategory(article.categories),
        article_type: 'news',
        source: article.source.title,
        source_credibility: determineSourceCredibility(article.source.title),
        image_url: article.image || '',
        impact,
        technical_complexity: technicalComplexity,
        reading_time: readingTime,
        views: 0,
        bookmarks: 0,
        status: 'published',
      };
    });
    
    // Check for existing articles to avoid duplicates
    const titles = processedArticles.map((article: any) => article.title);
    const { data: existingArticles } = await supabase
      .from('ai_news')
      .select('title')
      .in('title', titles);
    
    const existingTitles = new Set(existingArticles?.map(a => a.title) || []);
    
    // Filter out duplicates
    const newArticles = processedArticles.filter((article: any) => 
      !existingTitles.has(article.title)
    );
    
    console.log(`Found ${newArticles.length} new articles to insert`);
    
    if (newArticles.length > 0) {
      const { data: insertedData, error } = await supabase
        .from('ai_news')
        .insert(newArticles)
        .select();
        
      if (error) {
        throw error;
      }
      
      console.log(`Successfully inserted ${insertedData?.length} articles`);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Inserted ${insertedData?.length} new AI news articles`,
          data: insertedData
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No new articles to insert',
          data: []
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
  } catch (error) {
    console.error('Error in fetch-ai-news:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper function to map article categories to our defined categories
function mapToCategory(categories: any): string {
  // [Analysis] Intelligent category mapping based on article content
  const categoryMapping: Record<string, string> = {
    'Technology': 'Tech Giants',
    'Science': 'Research',
    'Business': 'Business',
    'Politics': 'Policy',
    'Entertainment': 'Innovation',
  };
  
  if (!categories) return 'Tech Giants';
  
  // Look for AI-specific categories
  const aiRelatedTerms = [
    'artificial intelligence', 'machine learning', 'deep learning', 
    'neural networks', 'ai research'
  ];
  
  for (const cat of Object.keys(categories)) {
    if (aiRelatedTerms.some(term => cat.toLowerCase().includes(term))) {
      return 'Research';
    }
    
    // Map to our category if it exists
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (cat.includes(key)) {
        return value;
      }
    }
  }
  
  return 'Tech Giants'; // Default category
}

// Helper function to determine source credibility
function determineSourceCredibility(source: string): string {
  // [Analysis] Source credibility determination based on known reliable sources
  const verifiedSources = [
    'TechCrunch', 'Wired', 'MIT Technology Review', 'The Verge', 
    'VentureBeat', 'Ars Technica', 'IEEE Spectrum', 'Forbes',
    'Wall Street Journal', 'New York Times', 'BBC', 'Reuters', 'Bloomberg',
    'CNBC', 'Associated Press', 'Nature', 'Science'
  ];
  
  if (verifiedSources.some(vs => source.includes(vs))) {
    return 'verified';
  }
  
  return 'standard';
}
