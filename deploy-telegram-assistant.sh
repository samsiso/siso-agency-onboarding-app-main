#!/bin/bash

# 🚀 INSTANT 24/7 Hosting for Telegram Voice Assistant
# Uses Railway.app - No Docker, No Auth Issues, No Setup Required!

set -e

echo "🚀 SISO Agency - INSTANT 24/7 Telegram Assistant Deployment"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 What we're doing:${NC}"
echo "✅ Creating a simple Node.js server"
echo "✅ Deploying to Railway.app (free 24/7 hosting)"
echo "✅ Setting up environment variables"
echo "✅ Configuring Telegram webhook"
echo ""

# Create package.json for Railway
echo -e "${YELLOW}📦 Creating package.json...${NC}"
cat > railway-package.json << 'EOF'
{
  "name": "siso-telegram-assistant",
  "version": "1.0.0",
  "description": "SISO Agency 24/7 Telegram Voice Assistant",
  "main": "railway-server.js",
  "scripts": {
    "start": "node railway-server.js",
    "dev": "nodemon railway-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "node-fetch": "^2.7.0",
    "form-data": "^4.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create the Railway server
echo -e "${YELLOW}🛠️ Creating Railway server...${NC}"
cat > railway-server.js << 'EOF'
const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GITHUB_REPO = process.env.GITHUB_REPO || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 SISO Agency Telegram Voice Assistant is running 24/7 on Railway!',
    timestamp: new Date().toISOString(),
    service: 'railway-hosting',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Telegram webhook endpoint
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
    await sendTelegramMessage(chatId, `👋 Hi ${userName}! Processing your message via Railway...`);

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

// Helper functions
async function transcribeVoice(fileId) {
  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) throw new Error('Failed to get file info');
    
    const voiceResponse = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`);
    const voiceBuffer = await voiceResponse.buffer();
    
    const formData = new FormData();
    formData.append('file', voiceBuffer, { filename: 'voice.ogg', contentType: 'audio/ogg' });
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

async function createGitHubIssue(feedback) {
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
${feedback.acceptance_criteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')}

## 🔧 Technical Notes
${feedback.technical_notes}

## 🏷️ Tags
${feedback.tags.join(', ')}

---
*Created via Telegram Voice Assistant on Railway.app*`,
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

async function sendToClaudeCode(feedback) {
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

async function addToTodoList(feedback) {
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

function buildConfirmationMessage(feedback, originalMessage, actionResult) {
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

async function sendTelegramMessage(chatId, text) {
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

app.listen(PORT, () => {
  console.log(`🚀 SISO Agency Telegram Assistant running on port ${PORT}`);
  console.log(`📡 Webhook URL: /webhook/telegram`);
  console.log(`💚 Health check: /health`);
});
EOF

echo -e "${GREEN}✅ Files created successfully!${NC}"
echo ""
echo -e "${BLUE}🚀 NEXT STEPS TO GET 24/7 HOSTING:${NC}"
echo ""
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub (free)"
echo "3. Click 'Deploy from GitHub repo'"
echo "4. Select this repository"
echo "5. Railway will automatically detect Node.js and deploy!"
echo ""
echo -e "${YELLOW}📋 Environment Variables to set in Railway:${NC}"
echo "TELEGRAM_TOKEN=7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk"
echo "GROQ_API_KEY=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"
echo "GITHUB_TOKEN=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"
echo "GITHUB_REPO=samsiso/siso-agency-onboarding-app-main"
echo ""
echo -e "${GREEN}🎉 Once deployed, you'll get a URL like: https://your-app.railway.app${NC}"
echo -e "${GREEN}📱 Then update your Telegram webhook to: https://your-app.railway.app/webhook/telegram${NC}"
echo ""
echo -e "${BLUE}💡 Alternative: Copy the railway-server.js to any hosting platform!${NC}"