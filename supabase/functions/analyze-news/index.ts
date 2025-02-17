
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { content, title, key_details, implications, section_id } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // [Analysis] Using GPT-4o-mini for cost-effective, fast analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI technology analyst. Analyze the provided content and extract key insights, market impact, technological predictions, and business implications. Format your response as JSON with the following structure:
            {
              "key_insights": string[],
              "market_impact": string,
              "tech_predictions": string[],
              "related_technologies": string[],
              "business_implications": string,
              "confidence_score": number
            }`
          },
          {
            role: 'user',
            content: `Title: ${title}\n\nContent: ${content}\n\nKey Details: ${key_details?.join('\n')}\n\nImplications: ${implications?.join('\n')}`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const analysis = JSON.parse(aiResponse.choices[0].message.content);

    // Store analysis in Supabase
    const { data, error } = await supabaseClient
      .from('news_ai_analysis')
      .upsert({
        section_id,
        ...analysis,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'section_id'
      });

    if (error) {
      console.error('Error storing analysis:', error);
      throw error;
    }

    return new Response(JSON.stringify({ analysis: data }), {
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
