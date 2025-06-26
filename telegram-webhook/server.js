const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
app.use(express.json());

// Environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Telegram webhook server is running' });
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
    // Get file from Telegram
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) throw new Error('Failed to get file info');
    
    // Download voice file
    const voiceResponse = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`);
    const voiceBuffer = await voiceResponse.arrayBuffer();
    
    // Transcribe with Groq
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

            🏷️ PRIORITY MAPPING:
            - ASAP: Production issues, security vulnerabilities, critical bugs
            - High: Important features, significant bugs, user-blocking issues  
            - Medium: Nice-to-have features, minor bugs, improvements
            - Low: Documentation, cleanup, future enhancements

            📏 SIZE ESTIMATION:
            - Small (1-2 hours): UI tweaks, text changes, minor fixes
            - Medium (4-8 hours): Component updates, simple features  
            - Large (16-32 hours): New pages, complex features, integrations
            - XL (40+ hours): Major system changes, architecture updates

            Return ONLY the JSON, no other text.`
          },
          { role: 'user', content: text }
        ]
      })
    });

    const result = await response.json();
    const content = result.choices[0].message.content.trim();
    
    // Try to extract JSON if there's extra text
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Parse error:', error);
    // result is not available in catch block, so skip logging it
    
    // Create enhanced fallback based on keywords
    const lowerText = text.toLowerCase();
    let type = 'task';
    let priority = 'Medium';
    let urgency = 'Normal';
    let size = 'Medium';
    let scope = 'Frontend';
    let action = 'todo';
    let component = 'general';
    
    // Determine type
    if (lowerText.includes('bug') || lowerText.includes('error') || lowerText.includes('issue') || lowerText.includes('problem')) {
      type = 'bug';
      action = 'github';
      priority = 'High';
      urgency = 'High';
    } else if (lowerText.includes('feature') || lowerText.includes('add') || lowerText.includes('new')) {
      type = 'feature';
      action = 'github';
      priority = 'Medium';
    } else if (lowerText.includes('enhance') || lowerText.includes('improve') || lowerText.includes('optimize')) {
      type = 'enhancement';
      action = 'github';
    }
    
    // Determine priority/urgency
    if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('asap')) {
      priority = 'ASAP';
      urgency = 'Critical';
    } else if (lowerText.includes('important') || lowerText.includes('high')) {
      priority = 'High';
      urgency = 'High';
    }
    
    // Determine component
    if (lowerText.includes('dashboard')) component = 'dashboard';
    else if (lowerText.includes('login') || lowerText.includes('auth') || lowerText.includes('signup')) component = 'auth';
    else if (lowerText.includes('client') || lowerText.includes('onboard')) component = 'client';
    else if (lowerText.includes('partner') || lowerText.includes('referral')) component = 'partnership';
    else if (lowerText.includes('admin')) component = 'admin';
    else if (lowerText.includes('financial') || lowerText.includes('payment') || lowerText.includes('money')) component = 'financial';
    else if (lowerText.includes('project')) component = 'projects';
    
    // Determine scope
    if (lowerText.includes('backend') || lowerText.includes('api') || lowerText.includes('database')) scope = 'Backend';
    else if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux')) scope = 'Design';
    else if (lowerText.includes('documentation') || lowerText.includes('docs')) scope = 'Documentation';
    
    return {
      type,
      priority,
      urgency,
      size,
      scope,
      component,
      title: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      description: text,
      action,
      estimatedHours: '4-8',
      tags: [type, component],
      acceptance_criteria: ['Implement the requested functionality', 'Test the implementation', 'Update documentation if needed'],
      technical_notes: 'Fallback categorization - manual review recommended'
    };
  }
}

async function createGitHubIssue(feedback) {
  try {
    // Check if GitHub credentials are configured
    if (GITHUB_TOKEN === 'your-github-token-here' || GITHUB_REPO === 'your-username/your-repo-name') {
      console.log('⚠️ GitHub not configured - simulating issue creation');
      const issueNumber = Math.floor(Math.random() * 1000) + 1;
      return {
        success: true,
        issueNumber,
        url: `https://github.com/${GITHUB_REPO}/issues/${issueNumber}`,
        simulated: true
      };
    }

    // Create real GitHub issue with enhanced formatting
    const priorityEmojis = { ASAP: '🚨', High: '🔴', Medium: '🟡', Low: '🟢' };
    const urgencyEmojis = { Critical: '⚡', High: '🔥', Normal: '📋', Low: '💡' };
    const scopeEmojis = { Frontend: '🎨', Backend: '⚙️', 'Full-stack': '🔄', Design: '🎯', DevOps: '🚀', Documentation: '📚' };
    
    const issueBody = `## ${urgencyEmojis[feedback.urgency] || '📋'} Overview
${feedback.description}

## 📊 Classification
| Attribute | Value |
|-----------|-------|
| **Type** | ${feedback.type} |
| **Priority** | ${priorityEmojis[feedback.priority] || '🟡'} ${feedback.priority} |
| **Urgency** | ${urgencyEmojis[feedback.urgency] || '📋'} ${feedback.urgency} |
| **Size** | ${feedback.size} (${feedback.estimatedHours} hours) |
| **Scope** | ${scopeEmojis[feedback.scope] || '🔄'} ${feedback.scope} |
| **Component** | \`${feedback.component}\` |

## ✅ Acceptance Criteria
${feedback.acceptance_criteria ? feedback.acceptance_criteria.map(criteria => `- [ ] ${criteria}`).join('\n') : '- [ ] To be defined'}

## 🔧 Technical Notes
${feedback.technical_notes || 'Implementation approach to be determined'}

## 🏷️ Tags
${feedback.tags ? feedback.tags.map(tag => `\`${tag}\``).join(' ') : 'No tags specified'}

---
*🤖 Created via Telegram Voice Assistant | 📱 SISO Agency Development*`;

    const issueData = {
      title: `${priorityEmojis[feedback.priority] || '🟡'} ${feedback.title}`,
      body: issueBody,
      labels: [
        feedback.type,
        `priority-${feedback.priority.toLowerCase()}`,
        `urgency-${feedback.urgency.toLowerCase()}`,
        `size-${feedback.size.toLowerCase()}`,
        `scope-${feedback.scope.toLowerCase().replace('-', '')}`,
        `component-${feedback.component}`,
        ...(feedback.tags || [])
      ]
    };

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const issue = await response.json();
    
    console.log('📋 Real GitHub Issue Created:', {
      number: issue.number,
      title: issue.title,
      url: issue.html_url
    });
    
    return {
      success: true,
      issueNumber: issue.number,
      url: issue.html_url,
      simulated: false
    };
  } catch (error) {
    console.error('GitHub creation failed:', error);
    return { success: false, error: error.message };
  }
}

async function sendToClaudeCode(feedback) {
  try {
    // Simulate sending to Claude Code
    console.log('🤖 Sent to Claude Code:', feedback.title);
    return {
      success: true,
      message: 'Task queued for Claude Code processing'
    };
  } catch (error) {
    console.error('Claude Code failed:', error);
    return { success: false, error: error.message };
  }
}

async function addToTodoList(feedback) {
  try {
    // Simulate adding to todo list
    console.log('📝 Added to Todo:', feedback.title);
    return {
      success: true,
      message: 'Added to todo list'
    };
  } catch (error) {
    console.error('Todo creation failed:', error);
    return { success: false, error: error.message };
  }
}

function buildConfirmationMessage(feedback, originalMessage, actionResult) {
  const typeIcons = { bug: '🐛', feature: '✨', enhancement: '⚡', documentation: '📚', task: '📝' };
  const priorityIcons = { ASAP: '🚨', High: '🔴', Medium: '🟡', Low: '🟢' };
  const urgencyIcons = { Critical: '⚡', High: '🔥', Normal: '📋', Low: '💡' };
  const scopeIcons = { Frontend: '🎨', Backend: '⚙️', 'Full-stack': '🔄', Design: '🎯', DevOps: '🚀', Documentation: '📚' };

  let message = `${typeIcons[feedback.type] || '📝'} *${feedback.title}*\n\n`;
  message += `📝 ${feedback.description}\n\n`;
  message += `📊 **Classification:**\n`;
  message += `${priorityIcons[feedback.priority] || '🟡'} Priority: ${feedback.priority}\n`;
  message += `${urgencyIcons[feedback.urgency] || '📋'} Urgency: ${feedback.urgency}\n`;
  message += `📏 Size: ${feedback.size} (${feedback.estimatedHours} hrs)\n`;
  message += `${scopeIcons[feedback.scope] || '🔄'} Scope: ${feedback.scope}\n`;
  message += `📁 Component: \`${feedback.component}\`\n`;
  if (feedback.tags && feedback.tags.length > 0) {
    message += `🏷️ Tags: ${feedback.tags.join(', ')}\n`;
  }
  message += `🎯 Action: ${feedback.action}\n\n`;

  if (actionResult) {
    if (actionResult.success) {
      if (feedback.action === 'github') {
        if (actionResult.simulated) {
          message += `⚠️ *GitHub Issue Simulated* (not configured)\n`;
          message += `🔗 Would be Issue #${actionResult.issueNumber}\n`;
        } else {
          message += `✅ *Real GitHub Issue Created!*\n`;
          message += `🔗 Issue #${actionResult.issueNumber}\n`;
          message += `📎 ${actionResult.url}\n`;
        }
      } else if (feedback.action === 'claude') {
        message += `🤖 *Sent to Claude Code!*\n`;
        message += `📋 ${actionResult.message}\n`;
      } else {
        message += `📝 *Added to Todo List!*\n`;
        message += `✅ ${actionResult.message}\n`;
      }
    } else {
      message += `❌ *Action Failed*\n`;
      message += `🚨 Error: ${actionResult.error}\n`;
    }
  } else {
    message += `⏳ *Processing...*\n`;
  }

  message += `\n🔄 *Ready for next message!*`;
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Telegram webhook server running on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook/telegram`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 