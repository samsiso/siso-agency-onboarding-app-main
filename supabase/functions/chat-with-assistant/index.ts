
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

    try {
      console.log('Sending message to OpenAI');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are SISO AI, a virtual assistant representing the Siso Agency. Your primary role is to help users navigate and find relevant information about social media, content creation, and online business growth.

When responding, follow this format:
1. Start with "🤔 Thinking..." and explain your thought process
2. Then use "🔍 Searching..." to show what resources you're looking through
3. Finally, provide your response under "💡 Response:"

Example:
User: "Tell me about automation tools"

🤔 Thinking...
I need to identify relevant automation categories and tools that would be most helpful for the user's needs.

🔍 Searching...
- Checking automation tools directory
- Looking through use cases and examples
- Finding relevant tutorials and guides

💡 Response:
Let me help you explore our automation tools. We have several categories:
1. Social Media Automation
2. Content Generation
3. Lead Generation
4. Workflow Automation

Would you like to learn more about any specific category?

Remember to:
- Break down complex topics
- Provide specific examples
- Guide users to appropriate resources
- Maintain a helpful and professional tone`
            },
            {
              role: "user",
              content: message
            }
          ],
        }),
      });

      console.log('Received response from OpenAI');
      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      return new Response(
        JSON.stringify({
          response: generatedText,
          threadId: null,
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
