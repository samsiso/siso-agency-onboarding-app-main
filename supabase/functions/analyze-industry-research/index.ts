// Import necessary types from Deno std
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Define types for the input
interface RequestBody {
  businessData: {
    businessName: string;
    appPurpose: string;
    industry: string;
    targetAudience: string;
  };
}

// Define types for industry research
interface IndustryResearch {
  industryTrends: string[];
  keyCompetitors: string[];
  userBehaviors: string[];
  marketGrowth: string;
  technologicalFactors: string[];
  recommendations: string[];
  opportunityAreas: string[];
  challengesToAddress: string[];
}

/**
 * Generate a prompt for OpenAI to analyze industry research
 */
function generateResearchPrompt(businessData: RequestBody['businessData']): string {
  return `
You are an expert market research analyst specializing in app development opportunities.
Provide comprehensive industry research for an app in the following context:

BUSINESS INFORMATION:
- Company: ${businessData.businessName}
- App Purpose: ${businessData.appPurpose}
- Industry: ${businessData.industry}
- Target Audience: ${businessData.targetAudience}

Analyze this industry thoroughly and respond with a JSON object containing EXACTLY these keys:
{
  "industryTrends": [array of 5-7 current trends in this industry],
  "keyCompetitors": [array of 4-6 types of competitors or specific companies if well-known],
  "userBehaviors": [array of 5-7 behaviors of the target audience relevant to this app],
  "marketGrowth": "concise statement about market growth projections",
  "technologicalFactors": [array of 5-7 technological factors affecting this industry],
  "recommendations": [array of 5-7 specific recommendations for app development in this space],
  "opportunityAreas": [array of 4-5 opportunity areas that competitors might be missing],
  "challengesToAddress": [array of 4-5 challenges that need to be addressed]
}

Your response must be valid JSON and include ONLY this JSON object, no other text.
Each array should contain complete sentences or detailed phrases, not just single words.
Make all insights specific to the industry and app purpose provided.
`;
}

/**
 * Edge Function handler
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: RequestBody = await req.json();
    const { businessData } = requestData;
    
    // Validate required fields
    if (!businessData || !businessData.industry || !businessData.appPurpose) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required business information",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate prompt
    const prompt = generateResearchPrompt(businessData);

    // Call OpenAI API via storage.rpc (assumes you've set up an RPC function to call OpenAI)
    const { data: openAIResponse, error: openAIError } = await supabase.rpc("call_openai", {
      messages: [
        {
          role: "system",
          content: "You are an expert market research analyst. Provide detailed, data-driven insights formatted as clean JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-1106-preview", // Use GPT-4 for better analysis
      temperature: 0.3, // Lower temperature for more factual responses
      response_format: { type: "json_object" }, // Ensure JSON response
    });

    // Handle OpenAI API error
    if (openAIError) {
      console.error("OpenAI API error:", openAIError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error calling AI model",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse the JSON string from OpenAI
    let research: IndustryResearch;
    try {
      if (typeof openAIResponse.choices[0].message.content === 'string') {
        research = JSON.parse(openAIResponse.choices[0].message.content);
      } else {
        research = openAIResponse.choices[0].message.content as unknown as IndustryResearch;
      }

      // Validate research data structure
      const requiredKeys = [
        "industryTrends", 
        "keyCompetitors", 
        "userBehaviors", 
        "marketGrowth",
        "technologicalFactors", 
        "recommendations",
        "opportunityAreas",
        "challengesToAddress"
      ];
      
      const missingKeys = requiredKeys.filter(key => !(key in research));
      if (missingKeys.length > 0) {
        throw new Error(`Response missing required keys: ${missingKeys.join(', ')}`);
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to parse AI response",
          details: error.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Save research to database (optional)
    const { error: dbError } = await supabase
      .from("industry_research")
      .insert({
        business_name: businessData.businessName,
        industry: businessData.industry,
        app_purpose: businessData.appPurpose,
        research_data: research,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.warn("Failed to save research to database:", dbError);
      // Continue even if DB save fails
    }

    // Return the successful response
    return new Response(
      JSON.stringify({
        success: true,
        research: research,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}); 