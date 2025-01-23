import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { parse } from "https://deno.land/x/rss@1.0.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsItem {
  title: string;
  description: string;
  date: string;
  source: string;
  category: string;
  impact: string;
  image_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get active news sources
    const { data: sources, error: sourcesError } = await supabaseClient
      .from('news_sources')
      .select('*')
      .eq('is_active', true)
      .lt('last_fetched_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Only fetch if last fetch was more than 1 hour ago
      .order('last_fetched_at', { ascending: true })
      .limit(5); // Process 5 sources at a time

    if (sourcesError) throw sourcesError;

    const newsItems: NewsItem[] = [];

    for (const source of sources || []) {
      try {
        console.log(`Fetching news from ${source.name}`);

        switch (source.source_type) {
          case 'rss':
            const response = await fetch(source.url);
            const xml = await response.text();
            const feed = await parse(xml);
            
            const rssItems = feed.entries?.map(entry => ({
              title: entry.title?.value || '',
              description: entry.description?.value || '',
              date: entry.published || new Date().toISOString(),
              source: source.name,
              category: determineCategory(entry.title?.value || ''),
              impact: determineImpact(entry.title?.value || ''),
              image_url: extractImageUrl(entry.description?.value || '')
            })) || [];

            newsItems.push(...rssItems);
            break;

          case 'api':
            // Handle API sources (implement specific API integrations here)
            if (source.name.includes('newsapi')) {
              const apiResponse = await fetch(`${source.url}?apiKey=${source.api_key}`);
              const data = await apiResponse.json();
              
              const apiItems = data.articles?.map((article: any) => ({
                title: article.title,
                description: article.description,
                date: article.publishedAt,
                source: article.source.name,
                category: determineCategory(article.title),
                impact: determineImpact(article.title),
                image_url: article.urlToImage
              })) || [];

              newsItems.push(...apiItems);
            }
            break;
        }

        // Update last_fetched_at timestamp
        await supabaseClient
          .from('news_sources')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
        continue; // Continue with next source if one fails
      }
    }

    // Insert new items into ai_news table
    if (newsItems.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('ai_news')
        .insert(newsItems);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${sources?.length || 0} sources, found ${newsItems.length} news items` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-news:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Helper functions
function determineCategory(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('chatgpt') || lowerTitle.includes('openai')) return 'AI Assistants';
  if (lowerTitle.includes('machine learning') || lowerTitle.includes('neural')) return 'Machine Learning';
  if (lowerTitle.includes('robotics') || lowerTitle.includes('robot')) return 'Robotics';
  if (lowerTitle.includes('regulation') || lowerTitle.includes('policy')) return 'AI Policy';
  return 'General AI';
}

function determineImpact(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes('breakthrough') || 
    lowerTitle.includes('revolutionary') ||
    lowerTitle.includes('major')
  ) return 'high';
  
  if (
    lowerTitle.includes('improve') || 
    lowerTitle.includes('update') ||
    lowerTitle.includes('new feature')
  ) return 'medium';
  
  return 'low';
}

function extractImageUrl(description: string): string | undefined {
  const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}