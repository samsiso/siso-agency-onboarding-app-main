import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { supabaseClient } from "../_shared/supabase-client.ts";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const openAIKey = Deno.env.get("OPENAI_API_KEY");

// [Analysis] Type definitions for better code organization and error checking
interface RequestBody {
  date?: string;
  forceRefresh?: boolean;
}

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  category: string;
  impact: string;
}

interface SummaryResponse {
  success: boolean;
  summary?: string;
  key_points?: string[];
  practical_applications?: string[];
  industry_impacts?: Record<string, string>;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Framework] Check for existing summary first
async function getExistingSummary(supabase: any, date: string): Promise<any> {
  try {
    const { data: existingSummary, error: fetchError } = await supabase
      .from("ai_news_daily_summaries")
      .select("*")
      .eq("date", date)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error checking for existing summary:", fetchError);
      return { error: fetchError };
    }
    
    return { data: existingSummary };
  } catch (error) {
    console.error("Unexpected error in getExistingSummary:", error);
    return { error };
  }
}

// [Framework] Fetch articles for summary generation
async function fetchArticles(supabase: any, date: string): Promise<{ data?: NewsArticle[], error?: Error }> {
  try {
    const { data: articles, error: articlesError } = await supabase
      .from("ai_news")
      .select("*")
      .eq("date", date)
      .eq("status", "published")
      .order("created_at", { ascending: false });
      
    if (articlesError) {
      return { error: new Error(`Error fetching news articles: ${articlesError.message}`) };
    }
    
    if (!articles || articles.length === 0) {
      return { error: new Error(`No published articles found for ${date}`) };
    }
    
    console.log(`Found ${articles.length} articles for ${date}`);
    
    // Prepare articles data
    const articlesData = articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source,
      category: article.category,
      impact: article.impact
    }));
    
    return { data: articlesData };
  } catch (error) {
    console.error("Unexpected error in fetchArticles:", error);
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// [Analysis] Generate a placeholder summary when OpenAI is unavailable
function generatePlaceholderSummary(date: string, articleCount: number): any {
  return {
    summary: `Daily AI News Summary for ${date}. ${articleCount} articles published covering various AI topics and industry developments.`,
    key_points: [
      "Multiple articles published about AI advancements and implementations",
      "Coverage spans different AI applications and technologies across sectors",
      "Various industries represented in today's AI news coverage",
      "Technical and business perspectives on AI developments included",
      "Latest AI research and commercial applications featured"
    ],
    practical_applications: [
      "Stay informed about the latest AI developments in your industry",
      "Consider how these technologies might apply to your organization's challenges",
      "Watch for emerging trends across AI applications to inform strategy",
      "Identify potential partners or technologies worth exploring further"
    ],
    industry_impacts: {
      "technology": "Ongoing advancements in AI capabilities and infrastructure",
      "business": "Potential productivity improvements through AI adoption and integration",
      "research": "New findings contributing to AI development and capabilities",
      "healthcare": "Applications of AI in improving patient care and outcomes",
      "education": "Developments in AI tools for personalized learning and education"
    },
    generated_with: "placeholder"
  };
}

// [Framework] Call OpenAI API to generate summary
async function callOpenAI(prompt: string): Promise<{ data?: any, error?: Error }> {
  if (!openAIKey) {
    return { error: new Error("OpenAI API key not available") };
  }
  
  try {
    console.log("Sending request to OpenAI...");
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // [Analysis] Using gpt-4o-mini for faster, cost-effective summarization
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
    return { data: openAIData };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// [Framework] Parse the OpenAI response into structured summary data
function parseOpenAIResponse(responseContent: string): any {
  try {
    // Extract JSON from the response (handling potential markdown formatting)
    const jsonMatch = responseContent.match(/```json\n([\s\S]*)\n```/) || 
                      responseContent.match(/```\n([\s\S]*)\n```/) ||
                      [null, responseContent];
                      
    const jsonString = jsonMatch[1] || responseContent;
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error("Error parsing OpenAI response:", parseError);
    console.log("Raw response:", responseContent);
    
    // Attempt to extract data using regex as a fallback
    const summary = responseContent.match(/summary["\s:]+([^"]+)/i)?.[1] || 
                    `AI News Summary`;
                    
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
      
    return {
      summary,
      key_points: keyPoints.length > 0 ? keyPoints : ["Important AI developments reported today"],
      practical_applications: applications.length > 0 ? applications : ["Stay informed on AI advancements"],
      industry_impacts: { "technology": "Ongoing progress in AI capabilities" }
    };
  }
}

// [Framework] Save the summary to the database
async function saveSummary(supabase: any, date: string, summaryData: any, articleCount: number, generatedWith: string): Promise<{ error?: Error }> {
  try {
    const { error: insertError } = await supabase
      .from("ai_news_daily_summaries")
      .insert({
        date,
        summary: summaryData.summary,
        key_points: summaryData.key_points,
        practical_applications: summaryData.practical_applications,
        industry_impacts: summaryData.industry_impacts,
        generated_with: generatedWith,
        article_count: articleCount
      });
      
    if (insertError) {
      console.error("Error saving summary:", insertError);
      return { error: new Error(`Failed to save summary: ${insertError.message}`) };
    }
    
    return {};
  } catch (error) {
    console.error("Error in saveSummary:", error);
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// [Framework] Main function to generate a daily summary
async function generateDailySummary(date: string, forceRefresh: boolean = false): Promise<SummaryResponse> {
  try {
    // Initialize Supabase client
    const supabase = supabaseClient || createClient(supabaseUrl!, supabaseKey!);
    
    // Check if we already have a summary for this date
    if (!forceRefresh) {
      const { data: existingSummary, error } = await getExistingSummary(supabase, date);
      
      if (error) {
        console.warn("Error checking for existing summary, proceeding with generation:", error);
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
    const { data: articles, error: articlesError } = await fetchArticles(supabase, date);
    
    if (articlesError) {
      return {
        success: false,
        error: articlesError.message
      };
    }
    
    // Check if OpenAI API key is available
    if (!openAIKey) {
      console.warn("OpenAI API key not available. Using placeholder summary.");
      
      // Generate a basic summary without OpenAI
      const placeholderSummary = generatePlaceholderSummary(date, articles.length);
      
      // Save the placeholder summary
      const { error: saveError } = await saveSummary(
        supabase, 
        date, 
        placeholderSummary, 
        articles.length, 
        "placeholder"
      );
      
      if (saveError) {
        console.error("Error saving placeholder summary:", saveError);
      }
      
      return {
        success: true,
        summary: placeholderSummary.summary,
        key_points: placeholderSummary.key_points,
        practical_applications: placeholderSummary.practical_applications,
        industry_impacts: placeholderSummary.industry_impacts,
        error: "AI-enhanced summary unavailable. Using basic summary instead."
      };
    }
    
    // Use OpenAI to generate the summary
    const prompt = `
You are an AI news analyst specializing in artificial intelligence trends. 
Analyze these ${articles.length} articles about AI from ${date} and create a comprehensive summary:

${JSON.stringify(articles, null, 2)}

Please provide:
1. A concise executive summary (2-3 paragraphs) of today's AI news
2. 5-7 key points highlighting the most important developments
3. 3-5 practical applications for professionals in different industries
4. Industry impact assessment (technology, business, healthcare, education, etc.)

Format your response as JSON with these keys: 
summary (string), key_points (array), practical_applications (array), industry_impacts (object with industry names as keys and impact descriptions as values)
`;

    // Call OpenAI API
    const { data: openAIData, error: openAIError } = await callOpenAI(prompt);
    
    if (openAIError) {
      console.error("Error calling OpenAI:", openAIError);
      
      // Fall back to placeholder if OpenAI fails
      const placeholderSummary = generatePlaceholderSummary(date, articles.length);
      await saveSummary(supabase, date, placeholderSummary, articles.length, "error_fallback");
      
      return {
        success: true,
        summary: placeholderSummary.summary,
        key_points: placeholderSummary.key_points,
        practical_applications: placeholderSummary.practical_applications,
        industry_impacts: placeholderSummary.industry_impacts,
        error: `Generated fallback summary due to API error: ${openAIError.message}`
      };
    }
    
    const responseContent = openAIData.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the JSON response
    const summaryData = parseOpenAIResponse(responseContent);
    
    // Save the summary to the database
    const { error: saveError } = await saveSummary(
      supabase, 
      date, 
      summaryData, 
      articles.length, 
      "openai"
    );
    
    if (saveError) {
      console.warn("Error saving summary, but returning generated data:", saveError);
    }
    
    return {
      success: true,
      summary: summaryData.summary,
      key_points: summaryData.key_points,
      practical_applications: summaryData.practical_applications,
      industry_impacts: summaryData.industry_impacts
    };
  } catch (error) {
    console.error("Error generating daily summary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// [Framework] Main handler for HTTP requests
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
      console.warn("Failed to parse request body, using defaults");
    }
    
    // Get the date parameter, defaulting to today
    const targetDate = requestBody.date || new Date().toISOString().split('T')[0];
    const forceRefresh = requestBody.forceRefresh || false;
    
    console.log(`Generating summary for date: ${targetDate}, force refresh: ${forceRefresh}`);
    
    // Generate the summary
    const result = await generateDailySummary(targetDate, forceRefresh);
    
    // Return appropriate response
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
    console.error("Unhandled error in generate-daily-summary:", error);
    
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
