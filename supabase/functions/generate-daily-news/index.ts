
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";

// [Analysis] Using environment variables for security and flexibility
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// [Analysis] Using service role for admin operations on the database
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// [Plan] This function will create a summary from processed videos and articles
serve(async (req: Request) => {
  console.log("[generate-daily-news] Function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body to get date
    let targetDate: string;
    
    try {
      const { date } = await req.json();
      targetDate = date || new Date().toISOString().split('T')[0]; // Default to today
      console.log(`[generate-daily-news] Processing for date: ${targetDate}`);
    } catch (e) {
      // If no body provided, use today's date
      targetDate = new Date().toISOString().split('T')[0];
      console.log(`[generate-daily-news] No date provided, using default: ${targetDate}`);
    }
    
    // Check if we already have a daily news post for the target date
    const { data: existingPost, error: checkError } = await supabaseAdmin
      .from('ai_news')
      .select('id, title')
      .eq('date', targetDate)
      .eq('article_type', 'daily_brief')
      .maybeSingle();

    if (checkError) {
      console.error(`[generate-daily-news] Error checking existing posts: ${checkError.message}`);
      throw checkError;
    }

    if (existingPost) {
      console.log(`[generate-daily-news] Daily news already exists for ${targetDate}: ${existingPost.id}`);
      return new Response(
        JSON.stringify({
          message: `Daily news already exists for ${targetDate}`,
          postId: existingPost.id,
          title: existingPost.title
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get news articles and processed video segments from that day
    const [articlesResponse, videoSegmentsResponse] = await Promise.all([
      // Regular articles
      supabaseAdmin
        .from('ai_news')
        .select('id, title, description, content, category, impact, technical_complexity, created_at')
        .eq('date', targetDate)
        .neq('article_type', 'daily_brief')
        .order('created_at', { ascending: false }),
        
      // Processed video segments
      supabaseAdmin
        .from('ai_news_video_segments')
        .select('id, title, description, transcript_text, topic_tags, technical_complexity')
        .eq('created_at::date', targetDate)
    ]);

    if (articlesResponse.error) {
      console.error(`[generate-daily-news] Error fetching articles: ${articlesResponse.error.message}`);
      throw articlesResponse.error;
    }

    if (videoSegmentsResponse.error) {
      console.error(`[generate-daily-news] Error fetching video segments: ${videoSegmentsResponse.error.message}`);
      throw videoSegmentsResponse.error;
    }

    const articles = articlesResponse.data || [];
    const videoSegments = videoSegmentsResponse.data || [];
    
    console.log(`[generate-daily-news] Found ${articles.length} articles and ${videoSegments.length} video segments`);

    // Generate a combined set of content sorted by estimated importance
    const allContent = [
      ...articles.map(a => ({
        ...a,
        source_type: 'article',
        importance_score: calculateImportanceScore(a)
      })),
      ...videoSegments.map(v => ({
        ...v, 
        source_type: 'video',
        importance_score: calculateImportanceScore(v)
      }))
    ].sort((a, b) => b.importance_score - a.importance_score);

    if (allContent.length === 0) {
      console.log(`[generate-daily-news] No content found for ${targetDate}`);
      return new Response(
        JSON.stringify({
          message: `No articles or video segments found for ${targetDate} to generate a daily brief`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Top content for the day (limit to 10 most important items)
    const topContent = allContent.slice(0, 10);
    
    // [Analysis] Extract categories and their frequencies for the table of contents
    const categories = topContent.reduce((acc: Record<string, number>, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Find default banner template for daily briefs
    const { data: template, error: templateError } = await supabaseAdmin
      .from('banner_templates')
      .select('id')
      .eq('is_default', true)
      .eq('template_type', 'daily_brief')
      .maybeSingle();
      
    if (templateError) {
      console.error(`[generate-daily-news] Error fetching banner template: ${templateError.message}`);
      throw templateError;
    }

    // Format date for title
    const displayDate = new Date(targetDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    // Generate the summary content
    const contentSummary = generateContentSummary(topContent);
    const topicHighlights = generateTopicHighlights(topContent);
    
    // Create table of contents from categories
    const tableOfContents = Object.entries(categories).map(([category, count], index) => ({
      title: category,
      anchor: `section-${index + 1}`,
      items: count
    }));

    // [Analysis] Create detailed content structure for the daily brief
    const fullContent = `
# AI News Daily Brief: ${displayDate}

## Today's Highlights

${contentSummary}

## Key Topics

${topicHighlights}

## Featured Articles

${topContent.map((item, index) => `
### ${index + 1}. ${item.title}

${item.description || ''}

**Source**: ${item.source_type === 'article' ? 'Published Article' : 'Video Content'}
**Category**: ${item.category || 'Uncategorized'}
**Impact**: ${item.impact || 'Medium'}
${item.technical_complexity ? `**Technical Complexity**: ${item.technical_complexity}` : ''}
`).join('\n')}
`;

    // Create the daily news post
    const dailyNewsPost = {
      title: `AI News Daily Brief: ${displayDate}`,
      description: `A comprehensive summary of the top AI news stories and developments from ${displayDate}.`,
      content: fullContent,
      date: targetDate,
      category: 'daily_brief',
      article_type: 'daily_brief',
      status: 'published',
      source: 'SISO AI',
      source_credibility: 'verified',
      banner_template_id: template?.id || null,
      technical_complexity: 'intermediate',
      impact: 'high',
      reading_time: Math.ceil(fullContent.length / 1000), // Rough estimate of reading time in minutes
      table_of_contents: tableOfContents,
      sources: topContent.map(item => ({
        id: item.id,
        title: item.title,
        type: item.source_type
      }))
    };

    // Insert the daily news post
    const { data: insertedPost, error: insertError } = await supabaseAdmin
      .from('ai_news')
      .insert(dailyNewsPost)
      .select()
      .single();

    if (insertError) {
      console.error(`[generate-daily-news] Error inserting daily news: ${insertError.message}`);
      throw insertError;
    }

    console.log(`[generate-daily-news] Successfully created daily brief for ${targetDate} with ID ${insertedPost.id}`);

    // Generate and store AI summary for the daily brief
    try {
      const summary = generateBriefSummary(topContent, displayDate);
      
      await supabaseAdmin.from('ai_news_summaries').insert({
        news_id: insertedPost.id,
        summary: summary
      });

      console.log(`[generate-daily-news] Created summary for daily brief ID ${insertedPost.id}`);
    } catch (summaryError) {
      console.error(`[generate-daily-news] Error creating summary: ${summaryError.message}`);
      // Continue even if summary creation fails
    }

    return new Response(
      JSON.stringify({
        message: `Daily news generated for ${targetDate}`,
        post: insertedPost,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`[generate-daily-news] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// [Analysis] Calculate importance score based on content attributes
function calculateImportanceScore(item: any): number {
  let score = 0;
  
  // Impact-based score
  if (item.impact === 'high') score += 5;
  else if (item.impact === 'medium') score += 3;
  else if (item.impact === 'low') score += 1;
  
  // Technical complexity
  if (item.technical_complexity === 'advanced') score += 3;
  else if (item.technical_complexity === 'intermediate') score += 2;
  else if (item.technical_complexity === 'beginner') score += 1;
  
  // Content length (longer content might be more substantial)
  if (item.content?.length > 1000 || item.transcript_text?.length > 1000) score += 2;
  else if (item.content?.length > 500 || item.transcript_text?.length > 500) score += 1;
  
  // Presence of tags indicates well-categorized content
  if (item.topic_tags && item.topic_tags.length > 0) score += 1;
  
  // Prioritize articles slightly over video segments as they're typically more curated
  if (item.source_type === 'article') score += 1;
  
  return score;
}

// [Analysis] Generate a concise summary of the day's content
function generateContentSummary(items: any[]): string {
  // Get categories with their counts
  const categoryCount = items.reduce((acc: Record<string, number>, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const categorySummary = Object.entries(categoryCount)
    .map(([category, count]) => `${count} ${count === 1 ? 'story' : 'stories'} in ${category}`)
    .join(', ');
  
  return `Today we're covering ${items.length} top AI developments across various domains, including ${categorySummary}. The content includes both published articles and video analyses from leading AI channels.`;
}

// [Analysis] Generate topic highlights from the top items
function generateTopicHighlights(items: any[]): string {
  // Extract key themes from the content
  const keyThemes = items.reduce((themes: Set<string>, item) => {
    if (item.category) themes.add(item.category);
    if (item.topic_tags && Array.isArray(item.topic_tags)) {
      item.topic_tags.forEach((tag: string) => themes.add(tag));
    }
    return themes;
  }, new Set<string>());
  
  const themesList = Array.from(keyThemes).slice(0, 5); // Top 5 themes
  
  return `
- ${themesList.join('\n- ')}
  `;
}

// [Analysis] Generate a concise overall summary of the daily brief
function generateBriefSummary(items: any[], date: string): string {
  const topCategories = items.reduce((acc: Record<string, number>, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(topCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
  
  return `This daily AI news brief for ${date} covers ${items.length} significant developments across ${Object.keys(topCategories).length} categories, with particular focus on ${sortedCategories.join(', ')}. The brief includes both written articles and video content analysis, offering a comprehensive overview of the day's most important AI news and technical advances.`;
}
