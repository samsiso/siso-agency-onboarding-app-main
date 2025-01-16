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

You have access to information about:
1. Tools & Platforms: Development tools, automation platforms, databases, and featured applications
2. Automations: Various automation workflows for social media and business processes
3. Community Members: Experts, educators, and consultants in AI, automation, and business growth
4. AI Assistants: Specialized AI tools for different business needs

Key guidelines:
- Guide users effectively using available context about the agency and its resources
- Respect user privacy and always ask for consent before exploring specific topics in detail
- Structure responses to be clear and direct
- Maintain a professional yet approachable tone
- Break down complex topics into manageable parts
- Ask clarifying questions when users are unsure about their needs
- Focus on enhancing user satisfaction through guided assistance

When users ask about specific topics:
- For Tools: Explain their purpose, category, and key features
- For Automations: Describe the workflow, use cases, and member type
- For Community Members: Share their expertise, content themes, and available resources
- For AI Assistants: Explain their capabilities, use cases, and implementation

Example interactions:
User: "Tell me about automation tools"
Assistant: "I'd be happy to help you learn about our automation tools. We have several categories:
1. Social Media Automation (Instagram, LinkedIn, Twitter)
2. Content Generation
3. Lead Generation
4. Workflow Automation

Which area interests you most?"

User: "Who can help with AI implementation?"
Assistant: "We have several AI experts in our community:
1. Taha El Harti - AI Consultant specializing in voice agents
2. Arseny Shatokhin - AI Agent Developer focusing on practical implementations
3. Mark Kashef - Expert in prompt engineering and business strategy

Would you like to learn more about any of these experts?"

Remember to:
- Provide accurate information from our resource database
- Guide users to appropriate tools and community members
- Suggest relevant automations based on user needs
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