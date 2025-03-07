
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// [Analysis] CORS headers for proper cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  articleId: string;
  title: string;
  content: string;
  source?: string;
  category?: string;
}

// [Analysis] Define meaningful importance levels
function calculateImportanceScore(analysis: any): number {
  // This is a placeholder implementation
  // In a real system, we would use NLP to analyze:
  // - Technical significance
  // - Market impact
  // - Innovation level
  // - Timeliness
  // - Source credibility
  
  // For now, generate a random score between 60-95
  return Math.floor(60 + Math.random() * 35);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { articleId, title, content, source, category } = await req.json() as AnalysisRequest;

    if (!articleId || !title || !content) {
      throw new Error('Missing required fields: articleId, title, or content');
    }

    console.log(`Analyzing article: ${articleId} - ${title}`);

    // [Plan] In a production system, this would use OpenAI or another AI service
    // For now, we'll generate mock analysis
    const analysis = {
      summary: `This article discusses advancements in ${category || 'AI technology'} with important implications for the industry.`,
      key_points: [
        "Introduces new technological capabilities",
        "Demonstrates potential industry applications",
        "Highlights challenges and limitations"
      ],
      technical_significance: "medium",
      market_impact: "high",
      source_credibility: source ? "verified" : "unknown",
      created_at: new Date().toISOString(),
      ai_importance_score: calculateImportanceScore(null),
      metadata: {
        analysis_version: "1.0",
        analyzed_at: new Date().toISOString(),
      }
    };

    // Store the analysis in the database
    const { data, error } = await supabase
      .from('news_ai_analysis')
      .upsert({
        article_id: articleId,
        summary: analysis.summary,
        key_points: analysis.key_points,
        technical_significance: analysis.technical_significance,
        market_impact: analysis.market_impact,
        source_credibility: analysis.source_credibility,
        ai_importance_score: analysis.ai_importance_score,
        metadata: analysis.metadata,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      throw error;
    }

    // Also update the article with the importance score
    await supabase
      .from('ai_news')
      .update({ 
        ai_importance_score: analysis.ai_importance_score 
      })
      .eq('id', articleId);

    console.log(`Analysis completed for article: ${articleId}`);

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`Error analyzing article:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
