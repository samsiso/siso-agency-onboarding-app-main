import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    console.log('Received request');
    const { message } = await req.json();
    console.log('Request payload:', { message });

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is missing' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openai = new OpenAI({ apiKey });

    try {
      console.log('Sending message to OpenAI');
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are SISO AI, a helpful assistant focused on providing information about social media, content creation, and online business growth."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      console.log('Received response from OpenAI');
      const response = completion.choices[0].message.content;

      return new Response(
        JSON.stringify({
          response,
          threadId: null, // No thread ID needed for regular chat
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API Error: ${openaiError.message}`,
          details: openaiError.stack
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in chat-with-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});