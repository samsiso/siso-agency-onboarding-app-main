
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openAIKey = Deno.env.get("OPENAI_API_KEY");

interface RequestBody {
  date?: string;
  forceRefresh?: boolean;
}

// [Framework] Generate a daily summary of news articles
async function generateDailySummary(date: string, forceRefresh: boolean = false): Promise<{
  success: boolean;
  summary?: string;
  key_points?: string[];
  practical_applications?: string[];
  industry_impacts?: Record<string, string>;
  error?: string;
}> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if we already have a summary for this date
    if (!forceRefresh) {
      const { data: existingSummary, error: fetchError } = await supabase
        .from("ai_news_daily_summaries")
        .select("*")
        .eq("date", date)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error checking for existing summary:", fetchError);
      } else if (existingSummary) {
        console.log(`Using existing summary for ${date}`);
        return {
          success: true,
          summary: existingSummary.summary,
          key_points: existingSummary.key_points || [],
          practical_applications: existingSummary.practical_applications || [],
          industry_impacts: existingSummary.industry_impacts || {}
        };
      }
    }
    
    // Fetch today's news articles
    const { data: articles, error: articlesError } = await supabase
      .from("ai_news")
      .select("*")
      .eq("date", date)
      .eq("status", "published")
      .order("created_at", { ascending: false });
      
    if (articlesError) {
      throw new Error(`Error fetching news articles: ${articlesError.message}`);
    }
    
    if (!articles || articles.length === 0) {
      return {
        success: false,
        error: `No published articles found for ${date}`
      };
    }
    
    console.log(`Found ${articles.length} articles for ${date}`);
    
    // Prepare articles data for OpenAI
    const articlesData = articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source,
      category: article.category,
      impact: article.impact
    }));
    
    // Check if OpenAI API key is available
    if (!openAIKey) {
      console.warn("OpenAI API key not available. Using placeholder summary.");
      
      // Generate a basic summary without OpenAI
      const placeholderSummary = {
        summary: `Daily AI News Summary for ${date}. ${articles.length} articles published covering various AI topics.`,
        key_points: [
          "Multiple articles published about AI advancements",
          "Coverage spans different AI applications and technologies",
          "Various industries represented in today's news"
        ],
        practical_applications: [
          "Stay informed about the latest AI developments",
          "Consider how these technologies might apply to your work",
          "Watch for emerging trends across AI applications"
        ],
        industry_impacts: {
          "technology": "Ongoing advancements in AI capabilities",
          "business": "Potential productivity improvements through AI adoption",
          "research": "New findings contributing to AI development"
        }
      };
      
      // Save the placeholder summary
      const { error: insertError } = await supabase
        .from("ai_news_daily_summaries")
        .insert({
          date,
          summary: placeholderSummary.summary,
          key_points: placeholderSummary.key_points,
          practical_applications: placeholderSummary.practical_applications,
          industry_impacts: placeholderSummary.industry_impacts,
          generated_with: "placeholder"
        });
        
      if (insertError) {
        console.error("Error saving placeholder summary:", insertError);
      }
      
      return {
        success: true,
        ...placeholderSummary
      };
    }
    
    // Use OpenAI to generate the summary
    const prompt = `
You are an AI news analyst specializing in artificial intelligence trends. 
Analyze these ${articles.length} articles about AI from ${date} and create a comprehensive summary:

${JSON.stringify(articlesData, null, 2)}

Please provide:
1. A concise executive summary (2-3 paragraphs) of today's AI news
2. 5-7 key points highlighting the most important developments
3. 3-5 practical applications for professionals in different industries
4. Industry impact assessment (technology, business, healthcare, education, etc.)

Format your response as JSON with these keys: 
summary (string), key_points (array), practical_applications (array), industry_impacts (object with industry names as keys and impact descriptions as values)
`;

    console.log("Sending request to OpenAI...");
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI analyst that summarizes artificial intelligence news and identifies key trends, applications, and implications."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || openAIResponse.statusText}`);
    }
    
    const openAIData = await openAIResponse.json();
    const responseContent = openAIData.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the JSON response
    let summaryData;
    try {
      // Extract JSON from the response (handling potential markdown formatting)
      const jsonMatch = responseContent.match(/```json\n([\s\S]*)\n```/) || 
                        responseContent.match(/```\n([\s\S]*)\n```/) ||
                        [null, responseContent];
                        
      const jsonString = jsonMatch[1] || responseContent;
      summaryData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", responseContent);
      
      // Attempt to extract data using regex as a fallback
      const summary = responseContent.match(/summary["\s:]+([^"]+)/i)?.[1] || 
                      `AI News Summary for ${date}`;
                      
      const keyPointsMatch = responseContent.match(/key_points["\s:]+\[([\s\S]*?)\]/i)?.[1] || "";
      const keyPoints = keyPointsMatch
        .split(/,\s*"/)
        .map(p => p.replace(/^"/, "").replace(/"$/, "").trim())
        .filter(p => p.length > 0);
        
      const applicationsMatch = responseContent.match(/practical_applications["\s:]+\[([\s\S]*?)\]/i)?.[1] || "";
      const applications = applicationsMatch
        .split(/,\s*"/)
        .map(p => p.replace(/^"/, "").replace(/"$/, "").trim())
        .filter(p => p.length > 0);
        
      summaryData = {
        summary,
        key_points: keyPoints.length > 0 ? keyPoints : ["Important AI developments reported today"],
        practical_applications: applications.length > 0 ? applications : ["Stay informed on AI advancements"],
        industry_impacts: { "technology": "Ongoing progress in AI capabilities" }
      };
    }
    
    // Save the summary to the database
    const { error: insertError } = await supabase
      .from("ai_news_daily_summaries")
      .insert({
        date,
        summary: summaryData.summary,
        key_points: summaryData.key_points,
        practical_applications: summaryData.practical_applications,
        industry_impacts: summaryData.industry_impacts,
        generated_with: "openai",
        article_count: articles.length
      });
      
    if (insertError) {
      console.error("Error saving summary:", insertError);
    }
    
    return {
      success: true,
      ...summaryData
    };
  } catch (error) {
    console.error("Error generating daily summary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse the request
    let requestBody: RequestBody = {};
    
    try {
      requestBody = await req.json();
    } catch (e) {
      // If parsing fails, use default empty object
    }
    
    // Get the date parameter, defaulting to today
    const targetDate = requestBody.date || new Date().toISOString().split('T')[0];
    const forceRefresh = requestBody.forceRefresh || false;
    
    console.log(`Generating summary for date: ${targetDate}, force refresh: ${forceRefresh}`);
    
    // Generate the summary
    const result = await generateDailySummary(targetDate, forceRefresh);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: result.success ? 200 : 500
      }
    );
  } catch (error) {
    console.error("Error in generate-daily-summary:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
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
