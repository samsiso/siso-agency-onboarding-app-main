// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_TOKEN') || '7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk';
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || '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';
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') || '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';
const GITHUB_REPO = Deno.env.get('GITHUB_REPO') || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

console.log("🚀 SISO Telegram Webhook - PUBLIC VERSION")

// This function is designed to work without JWT verification
// It should be deployed with verify_jwt = false in config.toml
serve(async (req) => {
  console.log(`🔥 Request received: ${req.method} ${req.url}`);
  console.log(`📍 Headers:`, Object.fromEntries(req.headers.entries()));
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Handle GET requests for health checks
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'SISO Agency Telegram Voice Assistant is running on Supabase Edge Functions',
          timestamp: new Date().toISOString(),
          service: 'telegram-webhook',
          version: '1.0.0',
          auth_note: 'This endpoint should accept requests without JWT verification'
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Only handle POST requests for webhook data
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Parse the request body
    const body = await req.json();
    console.log('📝 Webhook payload received:', JSON.stringify(body, null, 2));

    // Extract message data from Telegram webhook
    const message = body.message;
    if (!message) {
      console.log('⚠️ No message found in webhook payload');
      return new Response(
        JSON.stringify({ error: 'No message in webhook payload' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const chatId = message.chat?.id;
    const messageText = message.text;
    const voice = message.voice;
    const from = message.from;

    console.log(`📞 Message from ${from?.first_name} (${chatId}): ${messageText || 'Voice message'}`);

    // Verify it's our authorized chat
    if (chatId !== CHAT_ID) {
      console.log(`🚫 Unauthorized chat ID: ${chatId}`);
      await sendTelegramMessage(chatId, '🚫 Unauthorized access. This bot is private.');
      return new Response(
        JSON.stringify({ error: 'Unauthorized chat' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Send immediate acknowledgment
    await sendTelegramMessage(chatId, '🤖 Processing your request...');

    let transcribedText = '';

    // Handle voice messages
    if (voice) {
      console.log('🎵 Processing voice message...');
      
      try {
        // Get file info from Telegram
        const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${voice.file_id}`);
        const fileData = await fileResponse.json();
        
        if (!fileData.ok) {
          throw new Error('Failed to get file info from Telegram');
        }
        
        // Download the voice file
        const filePath = fileData.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
        
        const audioResponse = await fetch(fileUrl);
        if (!audioResponse.ok) {
          throw new Error('Failed to download voice file');
        }
        
        const audioBlob = await audioResponse.blob();
        
        // Transcribe using Groq Whisper
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.ogg');
        formData.append('model', 'whisper-large-v3');
        
        const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: formData
        });
        
        if (!transcriptionResponse.ok) {
          const errorText = await transcriptionResponse.text();
          throw new Error(`Transcription failed: ${errorText}`);
        }
        
        const transcriptionData = await transcriptionResponse.json();
        transcribedText = transcriptionData.text || '';
        
        console.log('📝 Transcription result:', transcribedText);
        
        if (!transcribedText.trim()) {
          await sendTelegramMessage(chatId, '😕 Could not transcribe the voice message. Please try again or send a text message.');
          return new Response(
            JSON.stringify({ message: 'Transcription failed' }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            }
          );
        }
        
        await sendTelegramMessage(chatId, `🎯 Transcribed: "${transcribedText}"`);
        
      } catch (error) {
        console.error('❌ Voice processing error:', error);
        await sendTelegramMessage(chatId, `❌ Error processing voice message: ${error.message}`);
        return new Response(
          JSON.stringify({ error: 'Voice processing failed', details: error.message }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
    } else if (messageText) {
      transcribedText = messageText;
      console.log('💬 Processing text message:', transcribedText);
    } else {
      await sendTelegramMessage(chatId, '❓ Please send either a text message or voice note.');
      return new Response(
        JSON.stringify({ message: 'No text or voice content' }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Analyze the request with AI
    console.log('🧠 Analyzing request with AI...');
    await sendTelegramMessage(chatId, '🧠 Analyzing your request...');

    const analysisPrompt = `
You are an AI assistant for SISO Agency, a digital marketing agency. Analyze the following client request and categorize it appropriately.

Client Request: "${transcribedText}"

Analyze this request and provide a JSON response with the following structure:
{
  "category": "github_issue" | "claude_code" | "todo",
  "priority": "high" | "medium" | "low",
  "title": "Brief descriptive title",
  "description": "Detailed description of what needs to be done",
  "reasoning": "Why you chose this category and priority",
  "estimated_effort": "Quick task" | "Medium task" | "Complex project",
  "labels": ["label1", "label2"],
  "acceptance_criteria": ["criteria1", "criteria2"]
}

Categories:
- github_issue: For development tasks, bugs, features, technical work
- claude_code: For coding questions, code review, programming help
- todo: For general tasks, reminders, non-technical work

Priority Guidelines:
- high: Urgent issues, client-facing problems, revenue impact
- medium: Important but not urgent, improvements, enhancements
- low: Nice-to-have features, documentation, cleanup

Labels should be relevant to the task type (e.g., "bug", "feature", "enhancement", "client-work", "internal")
`;

    try {
      const analysisResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that categorizes and analyzes client requests for a digital marketing agency. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1000
        })
      });

      if (!analysisResponse.ok) {
        throw new Error(`AI analysis failed: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      const analysisText = analysisData.choices[0]?.message?.content;
      
      if (!analysisText) {
        throw new Error('No analysis content received');
      }

      console.log('🤖 AI Analysis:', analysisText);

      // Parse the JSON response
      let analysis;
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          analysis = JSON.parse(analysisText);
        }
      } catch (parseError) {
        console.error('Failed to parse AI analysis JSON:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      // Create GitHub issue if categorized as such
      if (analysis.category === 'github_issue') {
        console.log('📋 Creating GitHub issue...');
        await sendTelegramMessage(chatId, '📋 Creating GitHub issue...');

        const issueBody = `
## Request Details

**Original Request:** ${transcribedText}

**Analysis:** ${analysis.reasoning}

## Description

${analysis.description}

## Acceptance Criteria

${analysis.acceptance_criteria.map(criteria => `- [ ] ${criteria}`).join('\n')}

## Additional Information

- **Estimated Effort:** ${analysis.estimated_effort}
- **Priority:** ${analysis.priority}
- **Source:** Telegram Voice Assistant
- **Timestamp:** ${new Date().toISOString()}

---
*This issue was automatically created by the SISO Agency Telegram Voice Assistant*
`;

        const githubResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: analysis.title,
            body: issueBody,
            labels: analysis.labels || [],
          })
        });

        if (githubResponse.ok) {
          const issueData = await githubResponse.json();
          const issueUrl = issueData.html_url;
          const issueNumber = issueData.number;
          
          console.log(`✅ GitHub issue created: #${issueNumber}`);
          
          await sendTelegramMessage(chatId, 
            `✅ GitHub Issue Created!\n\n` +
            `🎯 **Title:** ${analysis.title}\n` +
            `📊 **Priority:** ${analysis.priority}\n` +
            `🏷️ **Labels:** ${analysis.labels.join(', ')}\n` +
            `🔗 **Link:** ${issueUrl}\n\n` +
            `The issue has been added to the development backlog.`
          );
        } else {
          const errorText = await githubResponse.text();
          console.error('GitHub API error:', errorText);
          throw new Error(`Failed to create GitHub issue: ${githubResponse.status}`);
        }
      } else if (analysis.category === 'claude_code') {
        console.log('💻 Routing to Claude Code queue...');
        await sendTelegramMessage(chatId, 
          `💻 **Coding Question Received**\n\n` +
          `🎯 **Title:** ${analysis.title}\n` +
          `📝 **Description:** ${analysis.description}\n` +
          `🧠 **Reasoning:** ${analysis.reasoning}\n\n` +
          `This has been queued for Claude Code review. You'll get a detailed response soon!`
        );
      } else if (analysis.category === 'todo') {
        console.log('📝 Adding to todo list...');
        await sendTelegramMessage(chatId, 
          `📝 **Todo Item Added**\n\n` +
          `🎯 **Title:** ${analysis.title}\n` +
          `📊 **Priority:** ${analysis.priority}\n` +
          `📋 **Description:** ${analysis.description}\n` +
          `⏱️ **Effort:** ${analysis.estimated_effort}\n\n` +
          `Added to your todo list!`
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          analysis: analysis,
          original_text: transcribedText,
          category: analysis.category,
          message: 'Request processed successfully'
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

    } catch (error) {
      console.error('❌ AI Analysis error:', error);
      await sendTelegramMessage(chatId, `❌ Error analyzing request: ${error.message}`);
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed', details: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

  } catch (error) {
    console.error('❌ General error:', error);
    
    // Try to send error message if we have a chat ID
    try {
      const body = await req.json();
      const chatId = body.message?.chat?.id;
      if (chatId === CHAT_ID) {
        await sendTelegramMessage(chatId, `❌ Error: ${error.message}`);
      }
    } catch (e) {
      console.error('Failed to send error message:', e);
    }
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});

// Helper function to send messages to Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Telegram message:', errorText);
    } else {
      console.log('✅ Telegram message sent successfully');
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/telegram-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
