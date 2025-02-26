
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.13";

// Configure Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateOptions {
  date?: string;
  videoIds?: string[];
  templateId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request
    const options: GenerateOptions = await req.json().catch(() => ({}));
    console.log("Generate options:", options);

    if (!options.date && !options.videoIds) {
      throw new Error("Either date or videoIds must be provided");
    }

    if (options.date) {
      // Generate daily news summary for the specified date
      const result = await generateDailyNewsSummary(options.date, options.templateId);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (options.videoIds && options.videoIds.length > 0) {
      // Generate news from specific videos
      const result = await generateNewsFromVideos(options.videoIds, options.templateId);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error("Invalid options provided");
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to generate daily news summary for a specific date
async function generateDailyNewsSummary(dateStr: string, templateId?: string) {
  console.log(`Generating daily news summary for ${dateStr}...`);
  
  // Check if we already have a daily brief for this date
  const { data: existingBrief } = await supabase
    .from('ai_news')
    .select('id')
    .eq('date', dateStr)
    .eq('article_type', 'daily_brief')
    .maybeSingle();
    
  if (existingBrief) {
    console.log(`Daily brief already exists for ${dateStr}`);
    return { id: existingBrief.id, status: 'exists', dateStr };
  }
  
  // Get processed videos for this date
  const { data: processedVideos, error } = await supabase
    .from('ai_news_video_processing')
    .select(`
      video_id,
      transcript,
      youtube_videos!inner(
        title,
        viewCount,
        channel_id,
        date
      )
    `)
    .eq('status', 'completed')
    .eq('youtube_videos.date', dateStr)
    .order('youtube_videos.viewCount', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error(`Error fetching processed videos for date ${dateStr}:`, error);
    throw error;
  }
  
  if (!processedVideos || processedVideos.length === 0) {
    console.log(`No processed videos found for date ${dateStr}`);
    return { status: 'no_videos', dateStr };
  }
  
  console.log(`Found ${processedVideos.length} processed videos for date ${dateStr}`);
  
  // Get default template if not specified
  if (!templateId) {
    const { data: defaultTemplate } = await supabase
      .from('banner_templates')
      .select('id')
      .eq('is_default', true)
      .eq('template_type', 'daily_brief')
      .single();
      
    templateId = defaultTemplate?.id;
  }
  
  // Generate summary content using OpenAI
  const videoSummaries = processedVideos.map(v => {
    const video = v.youtube_videos;
    // Truncate transcript to avoid token limits
    const truncatedTranscript = v.transcript ? 
      v.transcript.slice(0, 500) + '...' : 
      'No transcript available';
      
    return `
      Title: ${video.title}
      Views: ${video.viewCount || 0}
      Excerpt: ${truncatedTranscript}
    `;
  }).join('\n\n');
  
  const summaryContent = await generateAISummary(dateStr, videoSummaries);
  
  // Create the daily brief article
  const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const articleData = {
    title: `AI Daily Brief: ${formattedDate}`,
    description: summaryContent.summary,
    content: summaryContent.content,
    date: dateStr,
    category: 'daily_updates',
    article_type: 'daily_brief',
    template_type: 'daily_brief',
    status: 'published',
    technical_complexity: 'intermediate',
    impact: 'medium',
    source: 'SISO AI News',
    source_credibility: 'verified',
    reading_time: 5,
    key_takeaways: summaryContent.keyTakeaways,
    banner_template_id: templateId
  };
  
  const { data: newArticle, error: insertError } = await supabase
    .from('ai_news')
    .insert([articleData])
    .select()
    .single();
    
  if (insertError) {
    console.error("Error creating daily brief:", insertError);
    throw insertError;
  }
  
  console.log(`Successfully created daily brief for ${dateStr} with ID ${newArticle.id}`);
  return { 
    id: newArticle.id, 
    status: 'created', 
    dateStr, 
    videoCount: processedVideos.length
  };
}

// Function to generate news from specific videos
async function generateNewsFromVideos(videoIds: string[], templateId?: string) {
  console.log(`Generating news from ${videoIds.length} videos...`);
  
  // Get processed videos
  const { data: processedVideos, error } = await supabase
    .from('ai_news_video_processing')
    .select(`
      video_id,
      transcript,
      youtube_videos!inner(
        title,
        viewCount,
        channel_id,
        date
      )
    `)
    .in('video_id', videoIds)
    .eq('status', 'completed');
  
  if (error) {
    console.error(`Error fetching processed videos:`, error);
    throw error;
  }
  
  if (!processedVideos || processedVideos.length === 0) {
    console.log(`No processed videos found for the specified IDs`);
    return { status: 'no_videos', videoIds };
  }
  
  console.log(`Found ${processedVideos.length} processed videos`);
  
  // Group videos by date to generate daily briefs
  const videosByDate: Record<string, typeof processedVideos> = {};
  for (const video of processedVideos) {
    const date = video.youtube_videos.date;
    if (!videosByDate[date]) videosByDate[date] = [];
    videosByDate[date].push(video);
  }
  
  const results = [];
  for (const [date, videos] of Object.entries(videosByDate)) {
    try {
      // Check if we already have a daily brief for this date
      const { data: existingBrief } = await supabase
        .from('ai_news')
        .select('id')
        .eq('date', date)
        .eq('article_type', 'daily_brief')
        .maybeSingle();
        
      if (existingBrief) {
        console.log(`Daily brief already exists for ${date}`);
        results.push({ date, id: existingBrief.id, status: 'exists' });
        continue;
      }
      
      // Generate summary content using OpenAI
      const videoSummaries = videos.map(v => {
        const video = v.youtube_videos;
        // Truncate transcript to avoid token limits
        const truncatedTranscript = v.transcript ? 
          v.transcript.slice(0, 500) + '...' : 
          'No transcript available';
          
        return `
          Title: ${video.title}
          Views: ${video.viewCount || 0}
          Excerpt: ${truncatedTranscript}
        `;
      }).join('\n\n');
      
      const summaryContent = await generateAISummary(date, videoSummaries);
      
      // Create the daily brief article
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const articleData = {
        title: `AI Daily Brief: ${formattedDate}`,
        description: summaryContent.summary,
        content: summaryContent.content,
        date: date,
        category: 'daily_updates',
        article_type: 'daily_brief',
        template_type: 'daily_brief',
        status: 'published',
        technical_complexity: 'intermediate',
        impact: 'medium',
        source: 'SISO AI News',
        source_credibility: 'verified',
        reading_time: 5,