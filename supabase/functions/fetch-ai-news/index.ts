
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.13'
import { corsHeaders } from '../_shared/cors.ts'

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const eventRegistryApiKey = Deno.env.get('EVENT_REGISTRY_API_KEY') ?? ''

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper to categorize articles based on content
function categorizeArticle(article: any) {
  const title = article.title?.toLowerCase() || '';
  const body = article.body?.toLowerCase() || '';
  const combinedText = title + ' ' + body;
  
  // Define category patterns
  const categories = {
    'ai_research': ['neural networks', 'deep learning', 'machine learning', 'ai research', 'reinforcement learning', 'researchers', 'study', 'paper'],
    'generative_ai': ['generative ai', 'text-to-image', 'diffusion', 'stable diffusion', 'midjourney', 'dall-e', 'text generation'],
    'llms': ['large language model', 'llm', 'gpt', 'chatgpt', 'claude', 'gemini', 'mistral', 'llama'],
    'ai_tools': ['ai tool', 'productivity', 'workflow', 'integration', 'software', 'platform', 'saas'],
    'ai_ethics': ['ethics', 'bias', 'fairness', 'transparency', 'accountability', 'regulation', 'governance'],
    'startups': ['startup', 'funding', 'investment', 'venture capital', 'series a', 'series b', 'acquisition'],
    'business': ['business', 'enterprise', 'company', 'corporate', 'industry', 'market'],
    'policy': ['policy', 'regulation', 'law', 'government', 'compliance', 'legal'],
    'education': ['education', 'learning', 'training', 'course', 'curriculum', 'student', 'teacher'],
  };
  
  // Check which category has the most matches
  let bestCategory = 'general';
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(categories)) {
    const matches = keywords.filter(keyword => combinedText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

// Helper to extract relevant tags from article
function extractTags(article: any) {
  const concepts = article.concepts || [];
  return concepts
    .filter((concept: any) => concept.type === 'keyword' || concept.type === 'entity')
    .slice(0, 10)
    .map((concept: any) => concept.name || '');
}

// Helper to determine technical complexity
function determineTechnicalComplexity(article: any) {
  const text = (article.title + ' ' + article.body || '').toLowerCase();
  
  const technicalTerms = [
    'neural network', 'algorithm', 'transformer', 'attention mechanism', 'gradient descent',
    'backpropagation', 'optimization', 'diffusion model', 'fine-tuning', 'parameter',
    'tokenization', 'vector', 'embedding', 'inference', 'latent space', 'multimodal',
    'architecture', 'framework', 'implementation', 'coefficient', 'regression'
  ];
  
  const technicalCount = technicalTerms.filter(term => text.includes(term)).length;
  
  if (technicalCount > 5) return 'advanced';
  if (technicalCount > 2) return 'intermediate';
  return 'beginner';
}

// Helper to determine impact level
function determineImpactLevel(article: any) {
  const text = (article.title + ' ' + article.body || '').toLowerCase();
  
  // Keywords indicating high impact
  const highImpactTerms = [
    'breakthrough', 'revolutionary', 'major advancement', 'game-changing', 'landmark',
    'significant', 'disruption', 'transform', 'paradigm shift', 'dramatic'
  ];
  
  // Check for high impact terms
  const hasHighImpact = highImpactTerms.some(term => text.includes(term));
  
  return hasHighImpact ? 'high' : 'moderate';
}

async function fetchNewsFromEventRegistry(keyword: string, limit: number) {
  console.log(`Fetching news for keyword: ${keyword}, limit: ${limit}`);
  
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 7); // Get articles from past week
  
  const dateStart = pastDate.toISOString().split('T')[0];
  const dateEnd = today.toISOString().split('T')[0];
  
  try {
    const url = `http://eventregistry.org/api/v1/article/getArticles`;
    
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
      lang: "eng",
      dateStart: dateStart,
      dateEnd: dateEnd,
      apiKey: eventRegistryApiKey,
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`EventRegistry API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.articles?.results || [];
  } catch (error) {
    console.error('Error fetching news from EventRegistry:', error);
    throw error;
  }
}

async function storeArticlesInDatabase(articles: any[]) {
  if (!articles || articles.length === 0) {
    return { success: false, message: "No articles to store" };
  }
  
  const transformedArticles = articles.map(article => {
    const category = categorizeArticle(article);
    const tags = extractTags(article);
    const technicalComplexity = determineTechnicalComplexity(article);
    const impact = determineImpactLevel(article);
    
    // Format article date
    const date = new Date(article.date || new Date());
    const formattedDate = date.toISOString().split('T')[0];
    
    return {
      title: article.title || 'Untitled Article',
      description: article.body?.substring(0, 300) + '...' || 'No description available',
      content: article.body || '',
      image_url: article.image || null,
      source: article.source?.title || 'Unknown Source',
      date: formattedDate,
      category: category,
      impact: impact,
      technical_complexity: technicalComplexity,
      tags: tags,
      status: 'published', // Default to published
      article_type: 'news',
      source_credibility: 'verified',
      reading_time: Math.ceil((article.body?.length || 0) / 1000), // Rough estimate: 1000 chars per minute
    };
  });
  
  // Insert transformed articles into the database
  const { data, error } = await supabase
    .from('ai_news')
    .upsert(
      transformedArticles,
      {
        onConflict: 'title',
        ignoreDuplicates: true
      }
    );
  
  if (error) {
    console.error('Error storing articles in database:', error);
    throw error;
  }
  
  return { success: true, count: transformedArticles.length, message: `Successfully stored ${transformedArticles.length} articles` };
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (req.method === 'POST') {
      // Extract parameters from request body
      const { keyword = "artificial intelligence", limit = 20 } = await req.json();
      
      if (!eventRegistryApiKey) {
        return new Response(
          JSON.stringify({ success: false, message: "EVENT_REGISTRY_API_KEY is not set" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Fetch news articles from Event Registry API
      const articles = await fetchNewsFromEventRegistry(keyword, limit);
      console.log(`Fetched ${articles.length} articles from EventRegistry`);
      
      // Store articles in database
      const result = await storeArticlesInDatabase(articles);
      
      // Return success response
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      );
    }
  } catch (error) {
    console.error('Error in fetch-ai-news function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
