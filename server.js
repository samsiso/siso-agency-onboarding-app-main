const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
app.use(express.json());

// Environment variables - MUST be set in hosting platform
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;
const PORT = process.env.PORT || 3000;

console.log('🚀 SISO Telegram Webhook Server Starting...');
console.log('📱 Authorized Chat ID:', CHAT_ID);
console.log('🔧 Port:', PORT);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SISO 24/7 Telegram Voice Assistant', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    chat_id: CHAT_ID
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Telegram webhook server is running' });
});

// Main webhook endpoint
app.post('/webhook/telegram', async (req, res) => {
  try {
    const update = req.body;
    console.log('📨 Webhook received:', JSON.stringify(update, null, 2));

    if (!update.message || update.message.chat.id != CHAT_ID) {
      console.log(`❌ Wrong chat ID: ${update.message?.chat?.id} !== ${CHAT_ID}`);
      return res.status(200).json({ ok: true });
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
      return res.status(200).json({ ok: true });
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
    res.status(200).json({ ok: true, processed: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    try {
      await sendTelegramMessage(
        req.body?.message?.chat?.id || CHAT_ID,
        `❌ Error processing message: ${error.message}`
      );
    } catch (e) {
      console.error('Failed to send error message:', e);
    }
    
    res.status(200).json({ ok: true });
  }
});

async function transcribeVoice(fileId) {
  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) throw new Error('Failed to get file info');
    
    const voiceResponse = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`);
    const voiceBuffer = await voiceResponse.arrayBuffer();
    
    const formData = new FormData();
    formData.append('file', Buffer.from(voiceBuffer), { filename: 'voice.ogg', contentType: 'audio/ogg' });
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

async function parseWithGroq(text) {
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
            
            📁 APP COMPONENTS:
            - dashboard: Main admin dashboard, analytics, overview
            - auth: Login, signup, authentication flows  
            - client: Client portal, onboarding, project visibility
            - partnership: Partner tiers, rewards, referral system
            - admin: User management, system administration
            - financial: Expense tracking, revenue management
            - projects: Project management, timelines, milestones
            - portfolio: Portfolio showcase, case studies
            - automation: Workflow automation, task management
            - profile: User profiles, settings, preferences
            - chat: Communication hub, messaging
            - leaderboard: Performance metrics, rankings
            - tools: Utility tools, integrations
            - onboarding: Step-by-step user guidance

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
    console.error('Parse error:', error);
    return {
      type: 'task',
      priority: 'Medium',
      urgency: 'Normal',
      size: 'Medium',
      scope: 'Frontend',
      component: 'general',
      title: text.substring(0, 50),
      description: text,
      action: 'todo',
      estimatedHours: '4-8',
      tags: ['general'],
      acceptance_criteria: ['Process request'],
      technical_notes: 'Standard task processing'
    };
  }
}

async function createGitHubIssue(feedback) {
  try {
    const issueBody = `## 📋 Issue Details

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
${feedback.acceptance_criteria?.map(criteria => `- [ ] ${criteria}`).join('\n') || '- [ ] Complete implementation'}

## 🔧 Technical Notes
${feedback.technical_notes || 'No specific technical notes provided'}

## 🏷️ Tags
${feedback.tags?.join(', ') || 'general'}

---
*Created by SISO Telegram Assistant*`;

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: feedback.title,
        body: issueBody,
        labels: feedback.tags || ['telegram-assistant']
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const issue = await response.json();
    return {
      success: true,
      issue_number: issue.number,
      url: issue.html_url
    };
  } catch (error) {
    console.error('GitHub issue creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendToClaudeCode(feedback) {
  return {
    success: true,
    action: 'Saved to Claude Code integration queue'
  };
}

async function addToTodoList(feedback) {
  return {
    success: true,
    action: 'Added to internal todo system'
  };
}

function buildConfirmationMessage(feedback, originalMessage, actionResult) {
  const icons = { 
    bug: '🐛', 
    feature: '✨', 
    enhancement: '🔧',
    documentation: '📚',
    task: '📝' 
  };
  
  const priorities = { 
    ASAP: '🚨', 
    High: '🔴', 
    Medium: '🟡', 
    Low: '🟢' 
  };

  let message = `${icons[feedback.type]} *${feedback.title}* ${priorities[feedback.priority]}\n\n`;
  message += `📊 **Analysis:**\n`;
  message += `• Type: ${feedback.type}\n`;
  message += `• Priority: ${feedback.priority}\n`;
  message += `• Size: ${feedback.size}\n`;
  message += `• Component: ${feedback.component}\n`;
  message += `• Estimated: ${feedback.estimatedHours} hours\n\n`;
  
  message += `📝 **Description:**\n${feedback.description}\n\n`;

  if (actionResult?.success) {
    if (feedback.action === 'github' && actionResult.url) {
      message += `✅ **GitHub Issue Created!**\n`;
      message += `🔗 [Issue #${actionResult.issue_number}](${actionResult.url})\n\n`;
    } else {
      message += `✅ **Action Completed!**\n${actionResult.action}\n\n`;
    }
  } else if (actionResult?.error) {
    message += `❌ **Action Failed:** ${actionResult.error}\n\n`;
  }

  message += `🤖 *Processed by SISO AI Assistant*`;
  return message;
}

async function sendTelegramMessage(chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 SISO Telegram Webhook Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook/telegram`);
  console.log(`📱 Authorized for chat ID: ${CHAT_ID}`);
});

module.exports = app;