
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
    const { content, title, key_details, implications, section_id, news_id } = await req.json();

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
            content: 'You are an AI technology analyst. Analyze the provided content and extract key insights, market impact, technological predictions, and business implications. Return ONLY a JSON object with no markdown formatting or additional text. The JSON should have this exact structure: {"key_insights": string[], "market_impact": string, "tech_predictions": string[], "related_technologies": string[], "business_implications": string, "confidence_score": number}'
          },
          {
            role: 'user',
            content: `Title: ${title}\n\nContent: ${content}\n\nKey Details: ${key_details?.join('\n')}\n\nImplications: ${implications?.join('\n')}`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const aiResponse = await response.json();
    
    let analysis;
    try {
      analysis = typeof aiResponse.choices[0].message.content === 'string' 
        ? JSON.parse(aiResponse.choices[0].message.content)
        : aiResponse.choices[0].message.content;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw response:', aiResponse.choices[0].message.content);
      throw new Error('Invalid AI response format');
    }

    const requiredFields = ['key_insights', 'market_impact', 'tech_predictions', 'related_technologies', 'business_implications', 'confidence_score'];
    const missingFields = requiredFields.filter(field => !(field in analysis));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in analysis: ${missingFields.join(', ')}`);
    }

    // Store analysis in Supabase with both section_id and news_id
    const { data, error } = await supabaseClient
      .from('news_ai_analysis')
      .upsert({
        id: section_id,
        section_id,
        news_id,
        key_insights: analysis.key_insights,
        market_impact: analysis.market_impact,
        tech_predictions: analysis.tech_predictions,
        related_technologies: analysis.related_technologies,
        business_implications: analysis.business_implications,
        confidence_score: analysis.confidence_score,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
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
