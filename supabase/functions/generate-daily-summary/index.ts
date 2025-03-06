
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// [Analysis] Configure environment variables for API access
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const openAIKey = Deno.env.get("OPENAI_API_KEY");

// [Analysis] Type definitions for better code organization
interface RequestBody {
  date?: string;
  forceRefresh?: boolean;
  enhancedAnalysis?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateDailySummary(date: string, forceRefresh: boolean = false, enhancedAnalysis: boolean = false) {
  try {
    console.log(`⭐️ Starting daily summary generation for ${date}, force refresh: ${forceRefresh}, enhanced: ${enhancedAnalysis}`);
    console.log(`Environment check: SUPABASE_URL exists? ${supabaseUrl ? 'Yes' : 'No'}`);
    console.log(`Environment check: SUPABASE_SERVICE_ROLE_KEY exists? ${supabaseKey ? 'Yes' : 'No'}`);
    console.log(`Environment check: OPENAI_API_KEY exists? ${openAIKey ? 'Yes' : 'No'}`);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      throw new Error("Server configuration error: Missing Supabase credentials");
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if we already have a summary for this date
    if (!forceRefresh) {
      const { data: existingSummary, error } = await supabase
        .from('ai_news_daily_summaries')
        .select('*')
        .eq('date', date)
        .maybeSingle();
        
      if (!error && existingSummary) {
        console.log(`Using existing summary for ${date}`);
        
        // Only regenerate fallback summaries unless forced to
        if (!forceRefresh && (existingSummary.generated_with === 'error_fallback' || existingSummary.generated_with === 'placeholder')) {
          // Delete the existing fallback summary
          const { error: deleteError } = await supabase
            .from("ai_news_daily_summaries")
            .delete()
            .eq("date", date);
            
          if (deleteError) {
            console.warn("Failed to delete fallback summary:", deleteError);
          } else {
            console.log("Deleted existing fallback summary for regeneration");
          }
        } else {
          // Use the existing valid summary
          return {
            success: true,
            summary: existingSummary.summary,
            key_points: existingSummary.key_points || [],
            practical_applications: existingSummary.practical_applications || [],
            industry_impacts: existingSummary.industry_impacts || {},
            sentiment: existingSummary.sentiment,
            confidence_score: existingSummary.confidence_score,
            categorized_key_points: existingSummary.categorized_key_points,
            key_technologies: existingSummary.key_technologies,
            application_details: existingSummary.application_details,
            impact_severity: existingSummary.impact_severity,
            impact_trends: existingSummary.impact_trends,
            analysis_depth: existingSummary.analysis_depth
          };
        }
      }
    }
    
    // Fetch all published news articles for the date
    const { data: articles, error: articlesError } = await supabase
      .from("ai_news")
      .select("id, title, description, content, source, category, impact, technical_complexity, tags")
      .eq("date", date)
      .eq("status", "published");
      
    if (articlesError) {
      console.error("Error fetching news articles:", articlesError);
      throw new Error(`Failed to fetch articles: ${articlesError.message}`);
    }
    
    if (!articles || articles.length === 0) {
      console.warn(`No published articles found for ${date}`);
      throw new Error(`No published articles found for ${date}`);
    }
    
    console.log(`Found ${articles.length} articles for ${date}`);
    
    // Create a prompt that focuses on the enhanced analysis if requested
    const prompt = enhancedAnalysis ? `
As an AI analyst for agency owners, provide a comprehensive analysis of these ${articles.length} AI news articles from ${date}:

${JSON.stringify(articles.map(a => ({
  title: a.title,
  description: a.description,
  category: a.category,
  impact: a.impact,
  technical_complexity: a.technical_complexity,
  tags: a.tags
})), null, 2)}

Format your response as JSON with these keys:
- "summary": A concise 2-3 paragraph executive summary
- "sentiment": Overall sentiment of today's news - "positive", "negative", or "neutral"
- "confidence_score": A number between 0-100 indicating confidence in analysis
- "categorized_key_points": An object with categories as keys and arrays of string points as values
- "key_points": Array of 5 key points for agency owners (fallback if categorization fails)
- "practical_applications": Array of 3-4 actionable items for agencies
- "application_details": Matching array of more detailed explanations for each application
- "industry_impacts": Object with industry names as keys and impact descriptions as values
- "impact_severity": Object with same industry keys but "high", "medium", or "low" severity values
- "impact_trends": Object with industry keys and "up", "down", or "stable" values for trends
- "key_technologies": Array of objects, each containing:
  * "name": Technology name
  * "description": Brief description
  * "maturity": Development stage ("emerging", "growing", "mature")
  * "adoption_rate": Number from 0-100
- "analysis_depth": "comprehensive" (indicating this is an enhanced analysis)
` : `
As an AI analyst for agency owners, summarize these ${articles.length} AI news articles from ${date}:

${JSON.stringify(articles.map(a => ({
  title: a.title,
  description: a.description,
  category: a.category,
  impact: a.impact
})), null, 2)}

Create a concise summary FOR AGENCY OWNERS highlighting:
1. Executive summary (2-3 paragraphs) focusing on business implications
2. 5 key points that agency owners should know
3. 3-4 practical applications or action items for agency businesses
4. Brief impact assessment for different industries (marketing, tech, creative, consulting)

Format your response as JSON with these keys: 
"summary" (string), "key_points" (array of strings), "practical_applications" (array of strings), "industry_impacts" (object with industry names as keys and impact descriptions as values)
`;

    if (!openAIKey) {
      console.warn("OpenAI API key not available. Using placeholder summary.");
      
      // Generate a basic summary without OpenAI
      const placeholderSummary = enhancedAnalysis ? {
        summary: `Daily AI News Summary for ${date}. ${articles.length} articles published covering various AI topics relevant to agency owners.`,
        sentiment: "neutral",
        confidence_score: 50,
        key_points: [
          "Multiple AI developments affecting agency operations published today",
          "Several technological advancements that may impact client deliverables",
          "New AI tools relevant for marketing and creative agencies",
          "Potential shifts in AI implementation strategies for agencies",
          "Industry-wide AI adoption trends to monitor"
        ],
        categorized_key_points: {
          "business_impact": [
            "Multiple AI developments affecting agency operations published today",
            "Potential shifts in AI implementation strategies for agencies"
          ],
          "technology_trends": [
            "Several technological advancements that may impact client deliverables",
            "New AI tools relevant for marketing and creative agencies",
            "Industry-wide AI adoption trends to monitor"
          ]
        },
        practical_applications: [
          "Consider evaluating your agency's AI implementation strategy",
          "Monitor these developments for potential client opportunities",
          "Explore how these AI tools could enhance your service offerings",
          "Stay informed on how competitors may leverage these technologies"
        ],
        application_details: [
          "A strategic evaluation will help identify gaps and opportunities",
          "Client opportunities may arise from emerging capabilities",
          "Service enhancements could lead to competitive advantages",
          "Competitive intelligence can inform strategic planning"
        ],
        industry_impacts: {
          "marketing": "New AI capabilities that may affect campaign performance",
          "technology": "Technical shifts that could impact agency tech stacks",
          "creative": "AI tools that might enhance or challenge creative processes",
          "consulting": "Strategic considerations for agencies advising clients on AI"
        },
        impact_severity: {
          "marketing": "medium",
          "technology": "high",
          "creative": "medium",
          "consulting": "low"
        },
        impact_trends: {
          "marketing": "up",
          "technology": "up",
          "creative": "stable",
          "consulting": "up"
        },
        key_technologies: [
          {
            "name": "Generative AI",
            "description": "AI systems that can generate new content similar to human-created work",
            "maturity": "growing",
            "adoption_rate": 65
          },
          {
            "name": "Natural Language Processing",
            "description": "Technology enabling computers to understand and process human language",
            "maturity": "mature",
            "adoption_rate": 80
          },
          {
            "name": "Computer Vision",
            "description": "AI capability to interpret and understand visual information",
            "maturity": "growing",
            "adoption_rate": 70
          }
        ],
        analysis_depth: "comprehensive"
      } : {
        summary: `Daily AI News Summary for ${date}. ${articles.length} articles published covering various AI topics relevant to agency owners.`,
        key_points: [
          "Multiple AI developments affecting agency operations published today",
          "Several technological advancements that may impact client deliverables",
          "New AI tools relevant for marketing and creative agencies",
          "Potential shifts in AI implementation strategies for agencies",
          "Industry-wide AI adoption trends to monitor"
        ],
        practical_applications: [
          "Consider evaluating your agency's AI implementation strategy",
          "Monitor these developments for potential client opportunities",
          "Explore how these AI tools could enhance your service offerings",
          "Stay informed on how competitors may leverage these technologies"
        ],
        industry_impacts: {
          "marketing": "New AI capabilities that may affect campaign performance",
          "technology": "Technical shifts that could impact agency tech stacks",
          "creative": "AI tools that might enhance or challenge creative processes",
          "consulting": "Strategic considerations for agencies advising clients on AI"
        }
      };
      
      // Save the placeholder summary
      await saveSummary(supabase, date, placeholderSummary, articles.length, "placeholder");
      
      return {
        success: true,
        ...placeholderSummary,
        error: "AI-enhanced summary unavailable. Using basic summary instead."
      };
    }
    
    // Call OpenAI API with improved error handling
    console.log("Calling OpenAI API with prompt...");
    try {
      // [Framework] Improved logging for API debugging
      console.log(`Using OpenAI model: gpt-4o-mini`);
      
      const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // [Analysis] Using the correct model name
          messages: [
            {
              role: "system",
              content: "You are an AI analyst specializing in creating actionable summaries for agency owners."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: enhancedAnalysis ? 2000 : 1000 // Increase token limit for enhanced analysis
        })
      });
      
      // [Framework] Better error handling with response status and content logging
      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error("OpenAI API error:", openAIResponse.status, errorText);
        throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText.substring(0, 200)}`);
      }
      
      const openAIData = await openAIResponse.json();
      console.log("Successfully received OpenAI response");
      
      if (!openAIData.choices || !openAIData.choices[0]?.message?.content) {
        console.error("Response missing expected content:", JSON.stringify(openAIData).substring(0, 500));
        throw new Error("OpenAI response missing expected content");
      }
      
      // Parse the response content
      const responseContent = openAIData.choices[0].message.content;
      console.log("Raw OpenAI response:", responseContent.substring(0, 200) + "...");
      
      // Parse the JSON response with better error handling
      let summaryData;
      try {
        // Try to extract JSON if it's wrapped in markdown
        const jsonMatch = responseContent.match(/```json\n([\s\S]*)\n```/) || 
                        responseContent.match(/```\n([\s\S]*)\n```/) ||
                        [null, responseContent];
        
        summaryData = JSON.parse(jsonMatch[1] || responseContent);
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        // Create a basic structure from the text response
        summaryData = {
          summary: responseContent.substring(0, 500),
          key_points: responseContent.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).slice(0, 5),
          practical_applications: ["Review the latest AI developments with your team", "Consider how these trends affect your clients"],
          industry_impacts: { "agency": "Stay informed on these developments" }
        };
      }
      
      // Add analysis_depth field if enhanced
      if (enhancedAnalysis && !summaryData.analysis_depth) {
        summaryData.analysis_depth = "comprehensive";
      }
      
      // Save the summary
      await saveSummary(supabase, date, summaryData, articles.length, "openai");
      
      console.log("✅ Successfully generated and saved summary");
      
      return {
        success: true,
        ...summaryData
      };
    } catch (error) {
      console.error("Error generating summary with OpenAI:", error);
      
      // Fall back to placeholder if OpenAI fails
      const placeholderSummary = enhancedAnalysis ? {
        summary: `Daily AI News Summary for ${date}. ${articles.length} articles published covering various AI topics.`,
        sentiment: "neutral",
        confidence_score: 30,
        key_points: [
          "Multiple AI developments published today",
          "Several technological advancements in AI reported",
          "New AI tools and applications announced",
          "Potential business impacts across sectors",
          "Industry trends to monitor"
        ],
        categorized_key_points: {
          "business": [
            "Potential business impacts across sectors",
            "Industry trends to monitor"
          ],
          "technology": [
            "Multiple AI developments published today",
            "Several technological advancements in AI reported",
            "New AI tools and applications announced"
          ]
        },
        practical_applications: [
          "Stay informed about the latest AI developments",
          "Consider how these technologies might apply to your business",
          "Explore potential implementations for your clients"
        ],
        application_details: [
          "Maintaining awareness helps strategic decision-making",
          "Technology alignment with business needs is critical",
          "Client solutions may benefit from these advances"
        ],
        industry_impacts: {
          "marketing": "New capabilities for targeting and personalization",
          "technology": "Advances in AI infrastructure and tools",
          "creative": "New AI-powered creative tools and approaches",
          "consulting": "Emerging advisory opportunities around AI implementation"
        },
        impact_severity: {
          "marketing": "medium",
          "technology": "medium",
          "creative": "medium",
          "consulting": "low"
        },
        impact_trends: {
          "marketing": "up",
          "technology": "up",
          "creative": "stable",
          "consulting": "stable"
        },
        key_technologies: [
          {
            "name": "Large Language Models",
            "description": "Advanced AI systems trained on vast text datasets",
            "maturity": "growing",
            "adoption_rate": 50
          },
          {
            "name": "Computer Vision",
            "description": "AI systems that can interpret visual information",
            "maturity": "mature",
            "adoption_rate": 65
          }
        ],
        analysis_depth: "partial"
      } : {
        summary: `Daily AI News Summary for ${date}. ${articles.length} articles published covering various AI topics.`,
        key_points: [
          "Multiple AI developments published today",
          "Several technological advancements in AI reported",
          "New AI tools and applications announced",
          "Potential business impacts across sectors",
          "Industry trends to monitor"
        ],
        practical_applications: [
          "Stay informed about the latest AI developments",
          "Consider how these technologies might apply to your business",
          "Explore potential implementations for your clients"
        ],
        industry_impacts: {
          "marketing": "New capabilities for targeting and personalization",
          "technology": "Advances in AI infrastructure and tools",
          "creative": "New AI-powered creative tools and approaches",
          "consulting": "Emerging advisory opportunities around AI implementation"
        }
      };
      
      await saveSummary(supabase, date, placeholderSummary, articles.length, "error_fallback");
      
      return {
        success: true,
        ...placeholderSummary,
        error: `Generated fallback summary due to API error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  } catch (error) {
    console.error("Unhandled error in generateDailySummary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Save the summary to the database
async function saveSummary(supabase, date, summaryData, articleCount, generatedWith) {
  try {
    console.log(`Saving summary for ${date} with generation method: ${generatedWith}`);
    
    // First check if summary already exists
    const { data: existingSummary } = await supabase
      .from('ai_news_daily_summaries')
      .select('*')
      .eq('date', date)
      .maybeSingle();
    
    let saveOperation;
    
    // Prepare the data object with all the enhanced fields if they exist
    const summaryDataToSave = {
      summary: summaryData.summary,
      key_points: summaryData.key_points || [],
      practical_applications: summaryData.practical_applications || [],
      industry_impacts: summaryData.industry_impacts || {},
      generated_with: generatedWith,
      article_count: articleCount,
      updated_at: new Date().toISOString(),
      
      // Enhanced fields
      sentiment: summaryData.sentiment,
      confidence_score: summaryData.confidence_score,
      categorized_key_points: summaryData.categorized_key_points,
      key_technologies: summaryData.key_technologies,
      application_details: summaryData.application_details,
      impact_severity: summaryData.impact_severity,
      impact_trends: summaryData.impact_trends,
      analysis_depth: summaryData.analysis_depth
    };
    
    if (existingSummary) {
      // Update existing summary
      console.log(`Updating existing summary for ${date}`);
      saveOperation = supabase
        .from("ai_news_daily_summaries")
        .update(summaryDataToSave)
        .eq("date", date);
    } else {
      // Insert new summary
      console.log(`Inserting new summary for ${date}`);
      saveOperation = supabase
        .from("ai_news_daily_summaries")
        .insert({
          date,
          ...summaryDataToSave
        });
    }
    
    const { error: saveError } = await saveOperation;
      
    if (saveError) {
      console.error("Error saving summary:", saveError);
      throw new Error(`Failed to save summary: ${saveError.message}`);
    }
    
    console.log(`Successfully saved summary for ${date}`);
    return {};
  } catch (error) {
    console.error("Error in saveSummary:", error);
    throw error;
  }
}

// Main handler for HTTP requests
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
      console.log("Request body:", JSON.stringify(requestBody));
    } catch (e) {
      console.warn("Failed to parse request body, using defaults:", e);
    }
    
    // Get the date parameter, defaulting to today
    const targetDate = requestBody.date || new Date().toISOString().split('T')[0];
    const forceRefresh = requestBody.forceRefresh || false;
    const enhancedAnalysis = requestBody.enhancedAnalysis || false;
    
    console.log(`----- GENERATING SUMMARY -----`);
    console.log(`Date: ${targetDate}, Force refresh: ${forceRefresh}, Enhanced analysis: ${enhancedAnalysis}`);
    console.log(`OpenAI API key: ${openAIKey ? "Available" : "Not available"}`);
    console.log(`Supabase URL: ${supabaseUrl ? "Available" : "Not available"}`);
    console.log(`Supabase Key: ${supabaseKey ? "Available" : "Not available"}`);
    console.log(`---------------------------`);
    
    // Generate the summary
    const result = await generateDailySummary(targetDate, forceRefresh, enhancedAnalysis);
    
    console.log("Result:", JSON.stringify(result).substring(0, 300) + "...");
    
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
