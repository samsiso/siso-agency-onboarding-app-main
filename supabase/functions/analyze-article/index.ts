
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { supabaseClient } from "../_shared/supabase-client.ts";

// [Analysis] Configure CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// [Analysis] Use existing analyze-news function logic with more focused input
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
    
    console.log(`Processing analysis for article: ${articleId}`);
    console.log(`Title: ${title}`);
    
    // [Q] Should we add additional validation of the article content?
    // [Plan] Consider adding sentiment analysis in future iterations
    
    // Call the existing analyze-news function internally
    const analyzeResponse = await fetch(
      "https://fzuwsjxjymwcjsbpwfsl.supabase.co/functions/v1/analyze-news",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.get("Authorization") || "",
        },
        body: JSON.stringify({
          content: content || title,
          title: title,
          news_id: articleId
        }),
      }
    );
    
    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text();
      throw new Error(`Failed to analyze article: ${errorText}`);
    }
    
    const analysisResult = await analyzeResponse.json();
    
    // [Analysis] Update the article with the analysis results in a transaction
    const supabase = supabaseClient;
    
    const { data: updatedArticle, error: updateError } = await supabase
      .from("ai_news")
      .update({
        has_ai_analysis: true,
        ai_analysis: analysisResult.analysis,
        analysis_date: new Date().toISOString()
      })
      .eq("id", articleId)
      .select();
    
    if (updateError) {
      console.error("Error updating article with analysis:", updateError);
      throw updateError;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Article analyzed successfully",
        analysis: analysisResult.analysis,
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
