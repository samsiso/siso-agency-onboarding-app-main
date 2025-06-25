// Environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GITHUB_REPO = process.env.GITHUB_REPO || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

export default async function handler(req, res) {
  // Set CORS headers for webhook
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'SISO Agency Telegram Voice Assistant is running',
      timestamp: new Date().toISOString(),
      webhook_url: '/webhook/telegram'
    });
  }

  // Only allow POST requests for webhook
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}

async function transcribeVoice(fileId) {
  try {
    // Get file from Telegram
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) throw new Error('Failed to get file info');
    
    // Download voice file
    const voiceResponse = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`);
    const voiceBuffer = await voiceResponse.arrayBuffer();
    
    // Create form data for Groq
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
*Created via Telegram Voice Assistant*`,
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
    // This would integrate with Claude Code API when available
    // For now, we'll create a GitHub issue with special Claude Code label
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
    // Log to Supabase or other todo system
    console.log('📝 Adding to todo list:', feedback);
    
    // For now, return success - can integrate with Supabase later
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