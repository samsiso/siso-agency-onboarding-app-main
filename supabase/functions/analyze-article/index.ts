
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { supabaseClient } from "../_shared/supabase-client.ts";

// [Analysis] Configure CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Framework] Enhanced article analysis function with OpenAI integration focusing on agency needs
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // [Analysis] Parse request for article data
    const { articleId, title, content, source, category } = await req.json();
    
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
        
      if (!checkError && existingAnalysis && existingAnalysis.ai_analysis) {
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
    
    // [Analysis] Get OpenAI API key from environment variables
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openAIKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    console.log("Using OpenAI for enhanced agency analysis");
    
    // [Analysis] Prepare prompt for article analysis with agency-focused structure
    const prompt = `
      Analyze this AI news article from an AI agency owner's perspective:
      
      Title: ${title}
      
      Content: ${content || ""}
      
      Source: ${source || "Unknown"}
      
      Category: ${category || "AI Technology"}
      
      Provide a structured analysis with the following JSON format that would be most valuable to AI agency owners:
      
      {
        "market_impact": "A detailed paragraph analyzing broader market implications",
        "technical_predictions": ["3-5 bullet points with technical predictions"],
        "related_technologies": ["Relevant technologies mentioned or implied"],
        "business_implications": "Strategic business implications for AI agencies",
        "key_points": ["5 most important takeaways for agency owners"],
        "confidence_score": 0-100 confidence score,
        "agency_relevance_score": 0-100 score on relevance to agency business,
        "implementation_timeline": {
          "short_term": ["Actions agencies can take now"],
          "medium_term": ["3-6 month opportunities"],
          "long_term": ["12+ month strategic considerations"]
        },
        "market_opportunity": {
          "score": 0-100 opportunity score,
          "description": "Description of the market opportunity",
          "potential_revenue_impact": "How this could affect agency revenue",
          "target_client_industries": ["Industries most impacted by this technology"]
        },
        "competitive_analysis": {
          "current_adoption": "Current state of adoption",
          "market_leaders": ["Companies leading in this space"],
          "differentiation_opportunities": ["How agencies can differentiate"]
        },
        "client_messaging": {
          "value_propositions": ["Key value propositions for clients"],
          "key_selling_points": ["Selling points for agency services"],
          "objection_handling": {
            "objection1": "How to handle this objection",
            "objection2": "How to handle this objection"
          },
          "case_study_ideas": ["Potential case study angles"]
        },
        "implementation_details": {
          "resource_requirements": ["Required expertise/resources"],
          "technical_complexity": "Easy/Medium/Hard implementation complexity",
          "integration_challenges": ["Potential challenges"],
          "tech_stack_recommendations": ["Recommended technologies"]
        },
        "cost_benefit_analysis": {
          "estimated_implementation_cost": "Low/Medium/High cost estimation",
          "potential_roi_metrics": ["Metrics to track ROI"],
          "time_to_value": "Estimated timeline to see results",
          "scalability_factors": ["Factors affecting scalability"]
        }
      }
      
      Ensure all analysis is actionable, practical, and specifically valuable for AI agency owners who need to advise clients and implement AI solutions.
    `;
    
    // [Analysis] Call OpenAI API for enhanced analysis with balanced parameters for quality/speed
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // [Analysis] Using faster model for quicker responses
        messages: [
          {
            role: "system",
            content: "You are an AI business strategist for AI agencies. You analyze news to extract actionable business insights, market opportunities, and strategic guidance for agency owners who need to implement AI solutions for clients."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // [Analysis] Lower temperature for more consistent, business-focused responses
        max_tokens: 1500, // [Analysis] Increased token limit for more comprehensive analysis
      }),
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }
    
    // [Analysis] Process and parse the OpenAI response
    const openAIData = await openAIResponse.json();
    console.log("Received enhanced agency analysis from OpenAI");
    
    let analysis;
    try {
      // [Analysis] Extract JSON from OpenAI response
      const responseContent = openAIData.choices[0].message.content;
      
      // [Framework] Parse JSON, handling potential formatting issues
      if (responseContent.includes("{") && responseContent.includes("}")) {
        const jsonStart = responseContent.indexOf("{");
        const jsonEnd = responseContent.lastIndexOf("}") + 1;
        const jsonStr = responseContent.substring(jsonStart, jsonEnd);
        analysis = JSON.parse(jsonStr);
      } else {
        // [Analysis] Fallback to text parsing if JSON structure is missing
        analysis = {
          market_impact: "Analysis of market impact unavailable at this time.",
          technical_predictions: ["Prediction data could not be extracted"],
          related_technologies: ["AI"],
          business_implications: "Business implications analysis unavailable at this time.",
          agency_relevance_score: 50,
          implementation_timeline: {
            short_term: ["Evaluate potential applications"],
            medium_term: ["Monitor market developments"],
            long_term: ["Prepare strategic adoption plan"]
          },
          market_opportunity: {
            score: 50,
            description: "Potential market opportunity worth exploring",
            potential_revenue_impact: "Moderate potential impact on agency revenue",
            target_client_industries: ["Technology", "Marketing", "Finance"]
          }
        };
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      
      // [Analysis] Provide fallback analysis when parsing fails
      analysis = {
        market_impact: "Unable to parse analysis results.",
        technical_predictions: ["Analysis results unavailable"],
        related_technologies: ["AI"],
        business_implications: "Unable to extract business implications at this time.",
        agency_relevance_score: 30,
        implementation_timeline: {
          short_term: ["Review the technology mentioned"],
          medium_term: ["Monitor for developments"],
          long_term: ["Reassess potential integration"]
        }
      };
    }
    
    // [Analysis] Update the article with the enhanced analysis results
    try {
      console.log("Updating article with enhanced agency analysis:", { articleId, hasAnalysis: true });
      
      // [Analysis] Update directly to the ai_news table with the analysis data
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
