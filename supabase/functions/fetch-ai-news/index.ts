
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Enhanced mock data generator with more transparency about source data
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
  
  // Use predefined AI topics to make content more realistic
  const aiTopics = [
    'Large Language Models', 
    'Neural Networks', 
    'Computer Vision',
    'Reinforcement Learning',
    'GANs',
    'Transformers',
    'Robotics',
    'Self-Driving Cars',
    'AI Ethics',
    'AI Regulation',
    'Healthcare AI',
    'AI in Finance',
    'Explainable AI',
    'AI Research',
    'AI Tools',
    'Open Source AI',
    'AI Privacy',
    'AI Assistants',
    'Multimodal AI',
    'Edge AI'
  ];
  
  // Generate article titles based on real-world patterns
  const titlePatterns = [
    `New ${keyword} breakthrough could revolutionize FIELD`,
    `COMPANY unveils cutting-edge ${keyword} system`,
    `Researchers develop novel approach to ${keyword}`,
    `The future of FIELD: How ${keyword} is changing everything`,
    `PERSON announces groundbreaking work in ${keyword}`,
    `${keyword} adoption reaches new milestone`,
    `Study shows ${keyword} outperforms traditional methods in FIELD`,
    `COUNTRY invests billions in ${keyword} research`,
    `Ethical considerations for ${keyword} applications`,
    `How ${keyword} is transforming FIELD`
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
  
  console.log(`Generating ${count} mock articles for date: ${generationDate.toISOString().split('T')[0]}`);
  
  for (let i = 0; i < count; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
    const randomComplexity = complexities[Math.floor(Math.random() * complexities.length)];
    const randomTopic = aiTopics[Math.floor(Math.random() * aiTopics.length)];
    
    // Generate a more realistic title
    let titlePattern = titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
    titlePattern = titlePattern.replace('COMPANY', companies[Math.floor(Math.random() * companies.length)]);
    titlePattern = titlePattern.replace('PERSON', researchers[Math.floor(Math.random() * researchers.length)]);
    titlePattern = titlePattern.replace('FIELD', fields[Math.floor(Math.random() * fields.length)]);
    titlePattern = titlePattern.replace('COUNTRY', countries[Math.floor(Math.random() * countries.length)]);
    
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
    
    // Create more realistic content with paragraphs
    const paragraphs = [
      `This article discusses recent advancements in ${randomTopic} with a focus on ${randomCategory.replace('_', ' ')}.`,
      `Researchers at leading institutions have been exploring new approaches to solve challenges in ${fields[Math.floor(Math.random() * fields.length)]} using ${keyword}.`,
      `The technology demonstrates ${randomImpact} impact potential for industry applications, particularly in ${fields[Math.floor(Math.random() * fields.length)]}.`,
      `"This represents a significant step forward in our understanding of ${randomTopic}," said ${researchers[Math.floor(Math.random() * researchers.length)]}, who wasn't involved in the research.`,
      `Critics note that further validation is needed before widespread adoption, especially regarding ethical considerations and real-world performance.`
    ];
    
    const content = paragraphs.join('\n\n');
    
    // Generate a more descriptive summary
    const description = `${titlePattern} - New research explores applications in ${fields[Math.floor(Math.random() * fields.length)]} with potential ${randomImpact} impact.`;
    
    articles.push({
      id: uniqueId,
      title: titlePattern,
      description: description,
      content: content,
      date: formattedDate,
      published_at: new Date(articleDate.getTime() + Math.floor(Math.random() * 86400000)).toISOString(), // Random time during the day
      image_url: `https://picsum.photos/seed/${uniqueId}/800/600`,
      source: randomSource.name,
      source_credibility: randomSource.credibility,
      category: randomCategory,
      impact: randomImpact,
      technical_complexity: randomComplexity,
      url: `https://${randomSource.name}/article-${uniqueId}`,
      reading_time: Math.floor(Math.random() * 10) + 3, // 3-12 minute read time
      views: Math.floor(Math.random() * 1000) + 50, // 50-1050 views
      bookmarks: Math.floor(Math.random() * 100) + 5, // 5-105 bookmarks
      featured: i < 3, // First 3 articles are featured
      tags: [randomTopic, randomCategory.replace('_', ' '), keyword],
      author_id: null,
      article_type: 'news',
      status: 'published'
    });
  }
  
  console.log(`Successfully generated ${articles.length} mock articles`);
  return articles;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      keyword = "artificial intelligence", 
      limit = 100, // Default to generating 100 articles
      testMode = false, 
      skipDuplicates = true, 
      source = "event_registry", 
      dateOverride = null 
    } = await req.json();
    
    // Get Supabase client with admin privileges to write to the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`Processing request for ${keyword}, limit: ${limit}, testMode: ${testMode}, source: ${source}, dateOverride: ${dateOverride}`);
    
    // Generate mock articles
    const articles = generateMockArticles(keyword, limit, dateOverride);
    
    console.log(`Generated ${articles.length} mock articles`);
    
    let addedCount = 0;
    let duplicatesSkipped = 0;
    
    // If not in test mode, actually save the articles to the database
    if (!testMode) {
      for (const article of articles) {
        // Check if article already exists based on title (simple duplicate check)
        if (skipDuplicates) {
          const { data: existing, error: existingError } = await supabaseClient
            .from('ai_news')
            .select('id')
            .ilike('title', article.title)
            .maybeSingle();
            
          if (existingError) {
            console.error('Error checking for duplicates:', existingError);
          }
          
          if (existing) {
            console.log(`Skipping duplicate article: ${article.title}`);
            duplicatesSkipped++;
            continue;
          }
        }
        
        // Add the article to the database
        const { error: insertError } = await supabaseClient
          .from('ai_news')
          .insert({
            title: article.title,
            description: article.description,
            content: article.content,
            date: article.date,
            published_at: article.published_at,
            category: article.category,
            source: article.source,
            image_url: article.image_url,
            source_credibility: article.source_credibility,
            technical_complexity: article.technical_complexity,
            impact: article.impact,
            article_type: article.article_type,
            status: article.status,
            views: article.views,
            bookmarks: article.bookmarks,
            reading_time: article.reading_time,
            url: article.url,
            featured: article.featured,
            tags: article.tags
          });
          
        if (insertError) {
          console.error('Error inserting article:', insertError);
        } else {
          addedCount++;
        }
      }
      
      // Update the last_fetched_at timestamp for the news source
      const { error: updateError } = await supabaseClient
        .from('news_sources')
        .update({ 
          last_fetched_at: new Date().toISOString(),
          source_details: { 
            last_keyword: keyword,
            articles_count: addedCount,
            mock_generated: true,
            generation_date: new Date().toISOString()
          }
        })
        .eq('source_type', source);
        
      if (updateError) {
        console.error('Error updating news source last_fetched_at:', updateError);
      }
    }
    
    // Add more detailed information about the mock generation process
    const sourceDetails = {
      generationType: "Mock data generation",
      generatedFor: dateOverride || new Date().toISOString().split('T')[0],
      categories: "breakthrough_technologies, industry_applications, etc.",
      sources: "techcrunch.com, wired.com, etc.",
      generated_at: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        message: testMode 
          ? `Found ${articles.length} articles matching "${keyword}"` 
          : `Successfully added ${addedCount} articles, skipped ${duplicatesSkipped} duplicates`,
        count: testMode ? articles.length : addedCount,
        articles: articles,
        duplicatesSkipped: duplicatesSkipped,
        sourceDetails: sourceDetails
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'An error occurred during processing',
        error: String(error)
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
