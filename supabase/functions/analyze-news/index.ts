
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newsId } = await req.json();
    
    // Fetch the news article
    const { data: newsArticle, error: newsError } = await supabase
      .from('ai_news')
      .select('*')
      .eq('id', newsId)
      .single();

    if (newsError) throw newsError;

    // Simulate AI analysis with reasonable delays
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysis = {
      key_insights: [
        "Potential market disruption in AI sector",
        "New technological breakthrough",
        "Significant investment implications"
      ],
      market_impact: "High potential for market transformation with immediate effects on AI industry dynamics",
      tech_predictions: [
        "Accelerated adoption in next 6-12 months",
        "Integration with existing systems",
        "New development frameworks emerging"
      ],
      related_technologies: [
        "Machine Learning",
        "Neural Networks",
        "Cloud Computing"
      ],
      business_implications: "Companies should prepare for rapid technological adaptation and potential market repositioning",
      confidence_score: 0.85
    };

    // Store the analysis
    const { error: insertError } = await supabase
      .from('news_ai_analysis')
      .insert([{
        news_id: newsId,
        ...analysis
      }]);

    if (insertError) throw insertError;

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-news function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
