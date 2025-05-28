
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { tokenBudgetManager } from "../_shared/token-budget.ts";

// [Analysis] Configure CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Framework] Create a client to access the database
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// [Analysis] Check if token budget allows for analysis
async function checkTokenBudget(): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabaseClient
      .from('api_token_usage')
      .select('tokens_used')
      .eq('date', today)
      .single();
      
    if (error && error.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error("Error checking token budget:", error);
      return true; // Fail open
    }
    
    const currentUsage = data?.tokens_used || 0;
    return tokenBudgetManager.hasEnoughBudget(currentUsage, 'analyze');
  } catch (error) {
    console.error("Error checking token budget:", error);
    return true; // Fail open
  }
}

// [Analysis] Track token usage in database
async function trackTokenUsage(operation: string, tokenCost: number): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current usage for today
    const { data, error } = await supabaseClient
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
      await supabaseClient
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
      
      await supabaseClient
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

// [Framework] Generate agency-focused analysis using rule-based approach when API calls are limited
function generateRuleBasedAnalysis(title: string, content: string, category: string): any {
  console.log("Using rule-based analysis to conserve API tokens");
  
  // Keywords to look for with associated business implications
  const keyTerms: Record<string, any> = {
    "client": {
      market_impact: "Could significantly enhance client deliverables and satisfaction",
      business_implications: "Potential to improve client retention and expand services",
      implementation_details: { technical_complexity: "Medium" }
    },
    "revenue": {
      market_impact: "Direct impact on agency revenue streams and growth potential",
      business_implications: "May create new revenue opportunities for AI-focused agencies",
      implementation_details: { technical_complexity: "Medium" }
    },
    "automation": {
      market_impact: "Streamlining of agency workflows and operational efficiency",
      business_implications: "Cost reduction through process automation and improved margins",
      implementation_details: { technical_complexity: "Medium-High" }
    },
    "marketing": {
      market_impact: "Evolution of marketing strategies and client campaigns",
      business_implications: "New service offerings for marketing agencies",
      implementation_details: { technical_complexity: "Medium" }
    },
    "enterprise": {
      market_impact: "Significant changes in enterprise client relationship management",
      business_implications: "Opportunity to target larger clients with AI solutions",
      implementation_details: { technical_complexity: "High" }
    },
    "chatgpt": {
      market_impact: "Conversational AI becoming accessible to all businesses",
      business_implications: "Opportunity for chatbot implementation services",
      implementation_details: { technical_complexity: "Low-Medium" }
    },
    "llm": {
      market_impact: "Language models reshaping content creation and analysis",
      business_implications: "Content strategy services using LLM technology",
      implementation_details: { technical_complexity: "Medium" }
    }
  };
  
  // Starter template for the analysis
  const analysis = {
    market_impact: "This technology could impact how agencies deliver AI services",
    technical_predictions: [
      "Adoption will increase among service-based businesses",
      "Integration with existing agency tools will be critical",
      "Client expectation for AI solutions will grow"
    ],
    related_technologies: ["AI", "Machine Learning"],
    business_implications: "Agencies may need to develop new skills to remain competitive",
    key_points: [
      "Technology shifts affecting agency operations",
      "Potential new service offerings",
      "Competitive differentiation opportunity"
    ],
    confidence_score: 70,
    agency_relevance_score: 65,
    implementation_timeline: {
      short_term: ["Evaluate potential applications"],
      medium_term: ["Pilot implementation with select clients"],
      long_term: ["Scale successful approaches across client base"]
    },
    market_opportunity: {
      score: 60,
      description: "Moderate opportunity for agencies to develop new services",
      potential_revenue_impact: "Could increase revenue through new service offerings",
      target_client_industries: ["Marketing", "E-commerce", "SaaS"]
    },
    competitive_analysis: {
      current_adoption: "Early stages",
      market_leaders: ["Leading digital agencies"],
      differentiation_opportunities: ["Early adoption", "Specialized expertise"]
    },
    client_messaging: {
      value_propositions: ["Improved efficiency", "Better results", "Competitive advantage"],
      key_selling_points: ["Cutting-edge technology", "Proven frameworks"],
      objection_handling: {
        "cost": "Focus on ROI and long-term benefits",
        "complexity": "Emphasize managed implementation approach"
      },
      case_study_ideas: ["Client success stories", "Before/after metrics"]
    },
    implementation_details: {
      resource_requirements: ["Technical team", "Strategy team"],
      technical_complexity: "Medium",
      integration_challenges: ["Learning curve", "Client systems integration"],
      tech_stack_recommendations: ["Modern AI tools", "API-first platforms"]
    },
    cost_benefit_analysis: {
      estimated_implementation_cost: "Medium",
      potential_roi_metrics: ["Efficiency gains", "Revenue increase"],
      time_to_value: "3-6 months",
      scalability_factors: ["Reusable components", "Templated approaches"]
    }
  };
  
  // Refine based on title, content and category
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Adjust agency relevance based on category
  if (category === 'industry_applications') {
    analysis.agency_relevance_score = 85;
    analysis.market_opportunity.score = 80;
  } else if (category === 'breakthrough_technologies') {
    analysis.agency_relevance_score = 75;
    analysis.market_opportunity.score = 70;
  }
  
  // Check for key terms and update analysis
  Object.entries(keyTerms).forEach(([term, implications]) => {
    if (titleLower.includes(term)) {
      // Term in title is more significant
      analysis.market_impact = implications.market_impact;
      analysis.business_implications = implications.business_implications;
      analysis.implementation_details.technical_complexity = implications.implementation_details.technical_complexity;
      analysis.related_technologies.push(term);
      analysis.agency_relevance_score += 10;
      analysis.market_opportunity.score += 10;
    } else if (contentLower.includes(term)) {
      // Term in content
      analysis.related_technologies.push(term);
      analysis.agency_relevance_score += 5;
    }
  });
  
  // Ensure related technologies are unique
  analysis.related_technologies = [...new Set(analysis.related_technologies)];
  
  // Cap scores at 100
  analysis.agency_relevance_score = Math.min(analysis.agency_relevance_score, 100);
  analysis.market_opportunity.score = Math.min(analysis.market_opportunity.score, 100);
  
  return analysis;
}

// [Framework] Enhanced article analysis function with OpenAI integration focusing on agency needs
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // [Analysis] Parse request for article data
    const { articleId, title, content, sections, source, category } = await req.json();
    
    console.log('Received analyze request for article:', { articleId, title, hasContent: !!content, sectionsCount: sections?.length });
    
    if (!articleId || !title) {
      throw new Error("Missing required fields - articleId and title must be provided");
    }
    
    console.log(`Processing enhanced agency-focused analysis for article: ${articleId}`);
    
    // [Framework] First check if analysis already exists to avoid reprocessing
    try {
      const { data: existingAnalysis, error: checkError } = await supabaseClient
        .from("ai_news")
        .select("id, ai_analysis, has_ai_analysis")
        .eq("id", articleId)
        .single();
        
      console.log('Checking for existing analysis:', existingAnalysis?.ai_analysis ? 'Found' : 'Not found');
        
      if (!checkError && existingAnalysis && existingAnalysis.ai_analysis && 
          Object.keys(existingAnalysis.ai_analysis).length > 0) {
        console.log("Analysis already exists, returning cached result");
        return new Response(
          JSON.stringify({
            success: true,
            message: "Returning existing analysis",
            analysis: existingAnalysis.ai_analysis,
            articleId,
            cached: true
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
      }
    } catch (checkError) {
      console.log("Error checking for existing analysis:", checkError);
      // Continue with analysis generation if check fails
    }
    
    // [Analysis] Check if we have enough budget for OpenAI analysis
    const hasBudget = await checkTokenBudget();
    let analysis;
    
    if (hasBudget) {
      // [Analysis] Get OpenAI API key and process with AI
      const openAIKey = Deno.env.get("OPENAI_API_KEY");
      
      if (!openAIKey) {
        console.log("OpenAI API key not configured, using rule-based analysis");
        analysis = generateRuleBasedAnalysis(title, content || "", category || "unknown");
      } else {
        console.log("Using OpenAI for enhanced agency analysis");
        
        try {
          // [Analysis] Prepared prompts are moved to implementation to save tokens
          // Constructing a more focused prompt to save tokens
          const prompt = `
            Analyze this AI news article from an agency owner perspective:
            
            Title: ${title}
            Content: ${content ? (content.length > 1500 ? content.substring(0, 1500) + "..." : content) : ""}
            Category: ${category || "AI Technology"}
            
            Focus on practical business implications, implementation considerations, and revenue opportunities for agencies serving clients.
            
            Format as JSON with these keys: market_impact, technical_predictions (array), related_technologies (array), business_implications, key_points (array), agency_relevance_score (0-100), implementation_timeline (object with short/medium/long term arrays), market_opportunity (object), competitive_analysis (object), client_messaging (object), implementation_details (object), cost_benefit_analysis (object)
          `;
          
          // [Analysis] Call OpenAI API with reduced parameters to save tokens
          const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openAIKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini", // [Analysis] Using faster model for quicker responses and token savings
              messages: [
                {
                  role: "system",
                  content: "You are an AI business strategist for agencies. Return only valid JSON."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 1000, // Reduced token usage
            }),
          });
          
          if (!openAIResponse.ok) {
            const errorData = await openAIResponse.text();
            console.error("OpenAI API error:", errorData);
            throw new Error(`OpenAI API error: ${errorData}`);
          }
          
          // [Analysis] Process the OpenAI response
          const openAIData = await openAIResponse.json();
          
          try {
            const responseContent = openAIData.choices[0].message.content;
            
            if (responseContent.includes("{") && responseContent.includes("}")) {
              const jsonStart = responseContent.indexOf("{");
              const jsonEnd = responseContent.lastIndexOf("}") + 1;
              const jsonStr = responseContent.substring(jsonStart, jsonEnd);
              analysis = JSON.parse(jsonStr);
            } else {
              throw new Error("Response does not contain valid JSON");
            }
          } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            analysis = generateRuleBasedAnalysis(title, content || "", category || "unknown");
          }
          
          // Track token usage
          await trackTokenUsage('analyze', tokenBudgetManager.ANALYSIS_ESTIMATE);
        } catch (aiError) {
          console.error("Error with OpenAI analysis:", aiError);
          analysis = generateRuleBasedAnalysis(title, content || "", category || "unknown");
        }
      }
    } else {
      // Use rule-based analysis to save tokens
      console.log("Token budget exceeded, using rule-based analysis");
      analysis = generateRuleBasedAnalysis(title, content || "", category || "unknown");
    }
    
    // [Analysis] Update the article with the enhanced analysis results
    try {
      console.log("Updating article with analysis:", {
        articleId,
        hasAnalysis: true
      });
      
      const { data: updatedArticle, error: updateError } = await supabaseClient
        .from("ai_news")
        .update({
          has_ai_analysis: true,
          ai_analysis: analysis,
          analysis_date: new Date().toISOString()
        })
        .eq("id", articleId)
        .select();
      
      if (updateError) {
        console.error("Error updating article with analysis:", updateError);
        throw updateError;
      }
      
      console.log("Enhanced agency analysis successfully stored in database");
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message || "Unknown database error"}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Article analyzed successfully with enhanced agency focus",
        analysis: analysis,
        articleId
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in analyze-article function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
