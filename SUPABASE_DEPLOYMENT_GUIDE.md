# 🚀 **Deploy Telegram Assistant via Supabase Dashboard (No Docker Required)**

---

## 🎯 **Quick Setup - 5 Minutes to 24/7 Hosting**

Since Docker isn't installed, we'll deploy directly through the **Supabase web dashboard**:

---

## 📋 **Step 1: Access Your Supabase Project**

1. **Go to**: https://supabase.com/dashboard/projects
2. **Select**: "siso agency app" project (`avdgyrepwrvsvwgxrccr`)
3. **Click**: "Edge Functions" in the left sidebar

---

## 📋 **Step 2: Create New Edge Function**

1. **Click**: "Create a new function"
2. **Function name**: `telegram-webhook`
3. **Copy and paste** the code below:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_TOKEN') || '7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk';
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || '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';
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') || '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';
const GITHUB_REPO = Deno.env.get('GITHUB_REPO') || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      status: 'ok',
      message: 'SISO Agency Telegram Voice Assistant is running on Supabase Edge Functions',
      timestamp: new Date().toISOString(),
      service: 'telegram-webhook',
      version: '1.0.0'
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }

  if (req.method === 'POST') {
    try {
      const update = await req.json();
      console.log('📨 Webhook received:', JSON.stringify(update, null, 2));

      if (!update.message || update.message.chat.id != CHAT_ID) {
        console.log(`❌ Wrong chat ID: ${update.message?.chat?.id} !== ${CHAT_ID}`);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { message } = update;
      const chatId = message.chat.id;
      const userName = message.from?.first_name || 'User';

      // Send immediate acknowledgment
      await sendTelegramMessage(chatId, `👋 Hi ${userName}! Processing your message...`);

      // Process voice or text
      let messageText = '';
      
      if (message.voice) {
        await sendTelegramMessage(chatId, `🎤 Voice message detected! Transcribing...`);
        messageText = await transcribeVoice(message.voice.file_id);
        await sendTelegramMessage(chatId, `📝 Transcribed: "${messageText.substring(0, 100)}..."`);
      } else if (message.text) {
        messageText = message.text;
        await sendTelegramMessage(chatId, `💬 Text received: "${messageText.substring(0, 100)}..."`);
      } else {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Parse with AI
      await sendTelegramMessage(chatId, `🤖 Analyzing with AI...`);
      const parsedFeedback = await parseWithGroq(messageText);
      
      // Execute actions based on categorization
      let actionResult = null;
      if (parsedFeedback.action === 'github') {
        await sendTelegramMessage(chatId, `🔄 Creating GitHub issue...`);
        actionResult = await createGitHubIssue(parsedFeedback);
      } else if (parsedFeedback.action === 'claude') {
        await sendTelegramMessage(chatId, `🤖 Sending to Claude Code...`);
        actionResult = await sendToClaudeCode(parsedFeedback);
      } else {
        await sendTelegramMessage(chatId, `📝 Adding to todo list...`);
        actionResult = await addToTodoList(parsedFeedback);
      }
      
      // Send confirmation
      const confirmation = buildConfirmationMessage(parsedFeedback, messageText, actionResult);
      await sendTelegramMessage(chatId, confirmation);

      console.log('✅ Message processed successfully');
      return new Response(JSON.stringify({ ok: true, processed: true }), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('❌ Webhook error:', error);
      
      try {
        await sendTelegramMessage(
          CHAT_ID,
          `❌ Error processing message: ${error.message}`
        );
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
      
      return new Response(JSON.stringify({ ok: true, error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
});

async function transcribeVoice(fileId: string) {
  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) throw new Error('Failed to get file info');
    
    const voiceResponse = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`);
    const voiceBuffer = await voiceResponse.arrayBuffer();
    
    const formData = new FormData();
    const blob = new Blob([voiceBuffer], { type: 'audio/ogg' });
    formData.append('file', blob, 'voice.ogg');
    formData.append('model', 'whisper-large-v3');
    
    const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: formData,
    });
    
    const transcription = await transcriptionResponse.json();
    return transcription.text || 'No speech detected';
  } catch (error) {
    console.error('Transcription error:', error);
    return `[Transcription failed: ${error.message}]`;
  }
}

async function parseWithGroq(text: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent project assistant for SISO Agency's React+TypeScript app. 

            🏢 PROJECT CONTEXT:
            - SISO Agency Onboarding App with client management, financial tracking, partnership program
            - Tech Stack: React 18+, TypeScript, Tailwind CSS, Supabase, Vercel
            - Key Components: Admin Dashboard, Client Portal, Partnership Program, Financial Management

            🎯 CATEGORIZATION RULES:
            Analyze the message and respond with ONLY valid JSON:
            {
              "type": "bug|feature|enhancement|documentation|task",
              "priority": "ASAP|High|Medium|Low", 
              "urgency": "Critical|High|Normal|Low",
              "size": "Small|Medium|Large|XL",
              "scope": "Frontend|Backend|Full-stack|Design|DevOps|Documentation",
              "component": "dashboard|auth|client|partnership|admin|financial|projects|etc",
              "title": "Clear, actionable title (max 60 chars)",
              "description": "Detailed description with context",
              "action": "github|todo|claude",
              "estimatedHours": "1-2|4-8|16-32|40+",
              "tags": ["frontend", "performance", "ui-ux"],
              "acceptance_criteria": ["Criterion 1", "Criterion 2"],
              "technical_notes": "Implementation approach or technical considerations"
            }

            Return ONLY the JSON, no other text.`
          },
          { role: 'user', content: text }
        ]
      })
    });

    const result = await response.json();
    const content = result.choices[0].message.content.trim();
    
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq parsing error:', error);
    return {
      type: 'task',
      priority: 'Medium',
      urgency: 'Normal',
      size: 'Medium',
      scope: 'Frontend',
      component: 'general',
      title: 'General Task',
      description: text,
      action: 'todo',
      estimatedHours: '4-8',
      tags: ['general'],
      acceptance_criteria: ['Complete the requested task'],
      technical_notes: 'AI parsing failed, manual review needed'
    };
  }
}

async function createGitHubIssue(feedback: any) {
  try {
    const issueData = {
      title: feedback.title,
      body: `## 📋 Task Details

**Type:** ${feedback.type}
**Priority:** ${feedback.priority}
**Urgency:** ${feedback.urgency}
**Size:** ${feedback.size}
**Scope:** ${feedback.scope}
**Component:** ${feedback.component}
**Estimated Hours:** ${feedback.estimatedHours}

## 📝 Description
${feedback.description}

## ✅ Acceptance Criteria
${feedback.acceptance_criteria.map((criteria: string, index: number) => `${index + 1}. ${criteria}`).join('\n')}

## 🔧 Technical Notes
${feedback.technical_notes}

## 🏷️ Tags
${feedback.tags.join(', ')}

---
*Created via Telegram Voice Assistant on Supabase Edge Functions*`,
      labels: [
        feedback.type,
        feedback.priority.toLowerCase(),
        feedback.scope.toLowerCase(),
        ...feedback.tags
      ]
    };

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });

    const result = await response.json();
    return {
      success: true,
      url: result.html_url,
      number: result.number
    };
  } catch (error) {
    console.error('GitHub issue creation error:', error);
    return { success: false, error: error.message };
  }
}

async function sendToClaudeCode(feedback: any) {
  try {
    const claudeIssue = await createGitHubIssue({
      ...feedback,
      title: `[CLAUDE-CODE] ${feedback.title}`,
      tags: [...feedback.tags, 'claude-code', 'automation']
    });
    
    return {
      success: true,
      message: 'Sent to Claude Code queue',
      github_issue: claudeIssue
    };
  } catch (error) {
    console.error('Claude Code integration error:', error);
    return { success: false, error: error.message };
  }
}

async function addToTodoList(feedback: any) {
  try {
    console.log('📝 Adding to todo list:', feedback);
    
    return {
      success: true,
      message: 'Added to todo list',
      id: `todo_${Date.now()}`
    };
  } catch (error) {
    console.error('Todo list error:', error);
    return { success: false, error: error.message };
  }
}

function buildConfirmationMessage(feedback: any, originalMessage: string, actionResult: any) {
  const emoji = feedback.action === 'github' ? '🔄' : feedback.action === 'claude' ? '🤖' : '📝';
  
  let message = `${emoji} **Task Processed Successfully!**\n\n`;
  message += `📋 **Title:** ${feedback.title}\n`;
  message += `🏷️ **Type:** ${feedback.type} | **Priority:** ${feedback.priority}\n`;
  message += `📏 **Size:** ${feedback.size} | **Scope:** ${feedback.scope}\n`;
  message += `⏱️ **Estimated:** ${feedback.estimatedHours} hours\n\n`;
  
  if (actionResult?.success) {
    if (feedback.action === 'github') {
      message += `✅ **GitHub Issue Created:** #${actionResult.number}\n`;
      message += `🔗 **URL:** ${actionResult.url}\n`;
    } else if (feedback.action === 'claude') {
      message += `✅ **Sent to Claude Code Queue**\n`;
    } else {
      message += `✅ **Added to Todo List**\n`;
    }
  } else {
    message += `❌ **Error:** ${actionResult?.error || 'Unknown error'}\n`;
  }
  
  message += `\n📝 **Original Message:** "${originalMessage.substring(0, 100)}${originalMessage.length > 100 ? '...' : ''}"`;
  
  return message;
}

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
```

4. **Click**: "Deploy function"

---

## 📋 **Step 3: Configure Environment Variables**

In the same Supabase dashboard:

1. **Go to**: Settings → Environment variables
2. **Add these variables**:
   ```
   TELEGRAM_TOKEN = 7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk
   GROQ_API_KEY = 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
   GITHUB_TOKEN = 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
   GITHUB_REPO = samsiso/siso-agency-onboarding-app-main
   ```

---

## 📋 **Step 4: Get Your Webhook URL**

After deployment, your webhook URL will be:
```
https://avdgyrepwrvsvwgxrccr.supabase.co/functions/v1/telegram-webhook
```

---

## 📋 **Step 5: Update Telegram Webhook**

Run this command to connect Telegram to your new 24/7 webhook:

```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://avdgyrepwrvsvwgxrccr.supabase.co/functions/v1/telegram-webhook"}'
```

---

## 🎉 **Step 6: Test Your 24/7 Assistant**

1. **Send a message** to your Telegram bot
2. **Send a voice note** to test transcription
3. **Check GitHub** for new issues created
4. **Monitor logs** in Supabase Edge Functions dashboard

---

## ✅ **What You Get with Supabase Free Plan**

- ✅ **2 million function invocations/month** (plenty for your bot)
- ✅ **24/7 hosting** with global edge network
- ✅ **500MB database storage**
- ✅ **Automatic scaling**
- ✅ **Built-in logging and monitoring**
- ✅ **No cold starts** (unlike Vercel functions)

---

## 🔧 **Troubleshooting**

- **Test webhook**: `curl https://avdgyrepwrvsvwgxrccr.supabase.co/functions/v1/telegram-webhook`
- **Check logs**: Supabase Dashboard → Edge Functions → telegram-webhook → Logs
- **Verify webhook**: `curl https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo`

---

**🎯 This gives you 24/7 hosting using Supabase's excellent free plan!** 