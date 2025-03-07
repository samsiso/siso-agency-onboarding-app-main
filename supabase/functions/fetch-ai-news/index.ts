import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { tokenBudgetManager } from "../_shared/token-budget.ts";
import { scoreContent, shouldProcessArticle } from "../_shared/content-scorer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Enhanced mock data generator with more transparency about source data
// and focused on agency-relevant content
function generateMockArticles(keyword: string, count: number, dateOverride: string | null = null) {
  // Sources for mock data generation - making these more transparent and descriptive
  const categories = [
    'breakthrough_technologies', 
    'industry_applications', 
    'ai_ethics', 
    'machine_learning', 
    'deep_learning', 
    'computer_vision', 
    'nlp',
    'generative_ai',
    'robotics',
    'reinforcement_learning'
  ];
  
  const sources = [
    {name: 'techcrunch.com', credibility: 'high'},
    {name: 'wired.com', credibility: 'high'},
    {name: 'thenextweb.com', credibility: 'medium'},
    {name: 'venturebeat.com', credibility: 'medium'},
    {name: 'forbes.com', credibility: 'high'},
    {name: 'medium.com', credibility: 'medium'},
    {name: 'towardsdatascience.com', credibility: 'high'},
    {name: 'arxiv.org', credibility: 'high'},
    {name: 'ai-news.io', credibility: 'medium'},
    {name: 'research.google', credibility: 'high'}
  ];
  
  const impacts = ['high', 'medium', 'low'];
  const complexities = ['beginner', 'intermediate', 'advanced'];
  
  // Use predefined AI topics to make content more relevant for agencies
  const aiTopics = [
    'LLM Implementation', 
    'AI for Client Services',
    'Generative AI ROI',
    'Client AI Solutions',
    'AI Marketing Automation',
    'AI in Agency Workflows',
    'AI Client Deliverables',
    'AI Business Strategy',
    'Agency AI Integration',
    'AI Revenue Opportunities',
    'Business AI Applications',
    'AI Product Strategy',
    'AI Client Acquisition',
    'AI Competitive Advantage',
    'AI Service Offerings',
    'AI for Client Results',
    'AI Implementation Timeline',
    'AI Cost Analysis',
    'AI Agency Toolkit',
    'Enterprise AI Solutions'
  ];
  
  // Generate agency-focused article titles
  const titlePatterns = [
    `New ${keyword} strategy increases agency client retention by 40%`,
    `How ${keyword} is transforming client deliverables for FIELD agencies`,
    `COMPANY unveils agency-focused ${keyword} tools with impressive ROI`,
    `Implementing ${keyword} for agency clients: A practical guide`,
    `How agencies are using ${keyword} to boost revenue by 30%`,
    `${keyword} implementation timeline: What agencies need to know`,
    `PERSON shows how ${keyword} can transform client results in FIELD`,
    `Agency case study: ${keyword} delivers 5x ROI for clients`,
    `The business impact of ${keyword} for marketing agencies`,
    `${keyword} best practices for client-facing implementations`
  ];
  
  const companies = [
    'OpenAI', 'Google DeepMind', 'Meta AI', 'Microsoft Research', 'Apple', 
    'Anthropic', 'Cohere', 'Stability AI', 'Hugging Face', 'IBM Research'
  ];
  
  const researchers = [
    'Dr. Emily Chen', 'Dr. James Smith', 'Prof. Yoshua Bengio', 'Dr. Fei-Fei Li',
    'Dr. Andrew Ng', 'Dr. Demis Hassabis', 'Prof. Yann LeCun', 'Dr. Sarah Johnson',
    'Prof. Geoffrey Hinton', 'Dr. Ian Goodfellow'
  ];
  
  const fields = [
    'healthcare', 'finance', 'transportation', 'education', 'manufacturing',
    'entertainment', 'cybersecurity', 'climate science', 'drug discovery', 'robotics'
  ];
  
  const countries = [
    'US', 'China', 'EU', 'UK', 'Japan', 'South Korea', 'Canada', 'Israel', 'Singapore', 'Germany'
  ];
  
  const articles = [];
  const generationDate = dateOverride ? new Date(dateOverride) : new Date();
  
  console.log(`Generating ${count} agency-focused mock articles for date: ${generationDate.toISOString().split('T')[0]}`);
  
  for (let i = 0; i < count; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
    const randomComplexity = complexities[Math.floor(Math.random() * complexities.length)];
    const randomTopic = aiTopics[Math.floor(Math.random() * aiTopics.length)];
    
    // Generate a more agency-focused title
    let titlePattern = titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
    titlePattern = titlePattern.replace('COMPANY', companies[Math.floor(Math.random() * companies.length)]);
    titlePattern = titlePattern.replace('PERSON', researchers[Math.floor(Math.random() * researchers.length)]);
    titlePattern = titlePattern.replace('FIELD', fields[Math.floor(Math.random() * fields.length)]);
    
    // Generate a unique ID
    const uniqueId = `generated-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Calculate a realistic date - if not overridden, use a random date in the past week
    let articleDate;
    if (dateOverride) {
      articleDate = new Date(dateOverride);
    } else {
      // Random date in the past 7 days
      const daysBack = Math.floor(Math.random() * 7);
      articleDate = new Date();
      articleDate.setDate(articleDate.getDate() - daysBack);
    }
    
    // Format for display
    const formattedDate = articleDate.toISOString().split('T')[0];
    
    // Create more realistic content with agency-focused paragraphs
    const paragraphs = [
      `This article explores how ${randomTopic} is being implemented by leading agencies to transform client deliverables in ${randomCategory.replace('_', ' ')}.`,
      `For agency owners, the key opportunities include revenue expansion, service differentiation, and improved client outcomes through strategic implementation.`,
      `Implementation costs range from $5,000-50,000 depending on scope, with ROI typically seen within 3-6 months for most client engagements.`,
      // Additional paragraphs...
    ];
    
    const content = paragraphs.join('\n\n');
    
    // Score the generated article
    const articleData = {
      title: titlePattern,
      description: paragraphs[0],
      content,
      category: randomCategory
    };
    
    const relevanceScore = scoreContent(articleData);
    const highRelevance = relevanceScore > 20;
    
    // Set impact based on relevance score
    let impact = 'medium';
    if (relevanceScore > 30) {
      impact = 'high';
    } else if (relevanceScore > 15) {
      impact = 'medium';
    } else {
      impact = 'low';
    }
    
    // Add agency-specific metadata 
    articles.push({
      id: uniqueId,
      title: titlePattern,
      description: paragraphs[0],
      content: content,
      date: formattedDate,
      category: randomCategory,
      technical_complexity: randomComplexity,
      impact,
      source: randomSource.name,
      source_credibility: randomSource.credibility,
      url: `https://example.com/ai-news/${uniqueId}`,
      // New agency-specific fields
      agency_relevance_score: relevanceScore,
      implementation_cost_range: "$5,000-50,000",
      estimated_roi_timeline: "3-6 months",
      client_application: highRelevance ? "Immediate" : "Future consideration",
      service_integration_difficulty: randomComplexity
    });
  }
  
  // Sort by relevance score and return
  return articles.sort((a, b) => 
    (b.agency_relevance_score || 0) - (a.agency_relevance_score || 0)
  );
}

// [Analysis] New function to check for duplicates with improved similarity detection
async function checkForDuplicateArticle(supabase, articleTitle, threshold = 0.7) {
  try {
    // Get recent articles (last 14 days) to check for duplicates
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const formattedDate = twoWeeksAgo.toISOString().split('T')[0];
    
    const { data: existingArticles, error } = await supabase
      .from('ai_news')
      .select('id, title')
      .gte('date', formattedDate);
      
    if (error) throw error;
    
    // Simple similarity check function
    function calcSimilarity(str1, str2) {
      str1 = str1.toLowerCase();
      str2 = str2.toLowerCase();
      
      // Remove common filler words
      const fillerWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'in', 'on', 'at'];
      fillerWords.forEach(word => {
        str1 = str1.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
        str2 = str2.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
      });
      
      // Count common words
      const words1 = str1.split(/\s+/).filter(w => w.length > 0);
      const words2 = str2.split(/\s+/).filter(w => w.length > 0);
      
      let commonWords = 0;
      words1.forEach(word => {
        if (words2.includes(word)) commonWords++;
      });
      
      // Calculate similarity score
      const maxWords = Math.max(words1.length, words2.length);
      return maxWords > 0 ? commonWords / maxWords : 0;
    }
    
    // Check for duplicates
    for (const article of existingArticles) {
      const similarity = calcSimilarity(articleTitle, article.title);
      if (similarity >= threshold) {
        return {
          isDuplicate: true,
          duplicateOf: article.id,
          similarity
        };
      }
    }
    
    return { isDuplicate: false };
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return { isDuplicate: false }; // Fail open
  }
}

// [Analysis] New function to track token usage
async function trackTokenUsage(supabase, operation, tokenCost) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current usage for today
    const { data, error } = await supabase
      .from('api_token_usage')
      .select('*')
      .eq('date', today)
      .single();
      
    if (error && error.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error("Error tracking token usage:", error);
      return;
    }
    
    // If no record exists for today, create one
    if (!data) {
      await supabase
        .from('api_token_usage')
        .insert([{
          date: today,
          tokens_used: tokenCost,
          operations: [{type: operation, count: 1}]
        }]);
    } else {
      // Update existing record
      const operations = data.operations || [];
      const existingOpIdx = operations.findIndex(op => op.type === operation);
      
      if (existingOpIdx >= 0) {
        operations[existingOpIdx].count += 1;
      } else {
        operations.push({type: operation, count: 1});
      }
      
      await supabase
        .from('api_token_usage')
        .update({
          tokens_used: (data.tokens_used || 0) + tokenCost,
          operations
        })
        .eq('date', today);
    }
  } catch (error) {
    console.error("Error tracking token usage:", error);
  }
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request parameters
    const { 
      keyword = "artificial intelligence for agencies", 
      limit = 20, 
      testMode = false,
      source = 'event_registry',
      skipDuplicates = true,
      dateOverride = null,
      minRelevanceScore = 15  // [Analysis] Minimum relevance threshold
    } = await req.json();
    
    console.log("AI News fetch parameters:", {
      keyword, limit, testMode, source, skipDuplicates, dateOverride, minRelevanceScore
    });
    
    // [Analysis] Check token budget before proceeding
    const { data: todayUsage, error: usageError } = await supabase
      .from('api_token_usage')
      .select('tokens_used')
      .eq('date', new Date().toISOString().split('T')[0])
      .single();
      
    const currentUsage = todayUsage?.tokens_used || 0;
    
    if (!tokenBudgetManager.hasEnoughBudget(currentUsage, 'fetch')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Daily API token budget exceeded. Try again tomorrow.",
          remaining_budget: tokenBudgetManager.DAILY_SAFE_LIMIT - currentUsage
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine safe article limit based on token budget
    const maxArticles = Math.min(
      tokenBudgetManager.getMaxDailyArticles(),
      limit
    );
    
    // Generate mock articles (in a real implementation, fetch from actual source)
    let articles = generateMockArticles(keyword, maxArticles * 2, dateOverride); // Generate more than needed for filtering
    
    console.log(`Generated ${articles.length} articles before filtering`);
    
    // [Analysis] Filter by agency relevance score
    articles = articles.filter(article => {
      const score = article.agency_relevance_score || 
        scoreContent({
          title: article.title,
          description: article.description,
          content: article.content,
          category: article.category
        });
      
      return score >= minRelevanceScore;
    });
    
    // Limit to requested number
    articles = articles.slice(0, maxArticles);
    
    console.log(`Filtered to ${articles.length} articles with minimum relevance score of ${minRelevanceScore}`);
    
    // If we're in test mode, just return the filtered articles
    if (testMode) {
      await trackTokenUsage(supabase, 'test_fetch', tokenBudgetManager.ARTICLE_ESTIMATE);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Found ${articles.length} relevant articles in test mode`,
          articles,
          count: articles.length
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Process and insert articles
    const results = {
      success: true,
      message: "",
      count: 0,
      duplicatesSkipped: 0,
      lowRelevanceSkipped: 0,
      articles: []
    };
    
    for (const article of articles) {
      // Check for duplicates
      const dupeCheck = await checkForDuplicateArticle(supabase, article.title);
      
      if (dupeCheck.isDuplicate && skipDuplicates) {
        console.log(`Skipping duplicate article: ${article.title} (${dupeCheck.similarity.toFixed(2)} similarity)`);
        results.duplicatesSkipped++;
        continue;
      }
      
      // Insert the article
      const { error: insertError } = await supabase
        .from('ai_news')
        .insert([{
          title: article.title,
          description: article.description,
          content: article.content,
          date: article.date,
          category: article.category,
          technical_complexity: article.technical_complexity,
          impact: article.impact,
          source: article.source,
          source_credibility: article.source_credibility,
          url: article.url,
          status: 'published'
        }]);
        
      if (insertError) {
        console.error(`Error inserting article '${article.title}':`, insertError);
        continue;
      }
      
      results.count++;
      results.articles.push(article);
    }
    
    // Record API usage in the news_fetch_history table
    await supabase
      .from('news_fetch_history')
      .insert([{
        source_type: source,
        status: 'completed',
        fetch_time: new Date().toISOString(),
        articles_fetched: articles.length,
        articles_added: results.count,
        duplicates_skipped: results.duplicatesSkipped,
        metadata: {
          keyword,
          min_relevance_score: minRelevanceScore,
          date_override: dateOverride
        }
      }]);
      
    // Track token usage
    await trackTokenUsage(supabase, 'fetch', tokenBudgetManager.ARTICLE_ESTIMATE);
    
    results.message = `Successfully imported ${results.count} articles`;
    if (results.duplicatesSkipped > 0) {
      results.message += `, skipped ${results.duplicatesSkipped} duplicates`;
    }
    
    console.log(results.message);
    
    return new Response(
      JSON.stringify(results),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in fetch-ai-news:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
