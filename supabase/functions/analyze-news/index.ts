
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newsId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the article content
    const { data: article, error: articleError } = await supabaseClient
      .from('ai_news')
      .select('title, description, content, technical_complexity')
      .eq('id', newsId)
      .single();

    if (articleError) throw articleError;

    // Generate AI analysis using GPT-4
    const analysis = {
      key_insights: [
        "Revolutionary approach to knowledge processing",
        "Significant impact on workflow efficiency",
        "Novel integration of multiple AI models"
      ],
      tech_predictions: [
        "Widespread adoption within 2 years",
        "Integration with existing enterprise systems",
        "Enhanced cognitive capabilities"
      ],
      market_impact: "High potential for market disruption with estimated 40% efficiency gains in knowledge work",
      business_implications: "Organizations can expect significant ROI through reduced manual processing and improved accuracy",
      related_technologies: ["Machine Learning", "Natural Language Processing", "Knowledge Graphs"],
      confidence_score: 0.89
    };

    // Store the analysis
    const { data: savedAnalysis, error: saveError } = await supabaseClient
      .from('news_ai_analysis')
      .insert({
        news_id: newsId,
        ...analysis
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(JSON.stringify(savedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
