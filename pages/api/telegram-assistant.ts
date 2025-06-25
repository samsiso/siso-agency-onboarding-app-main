import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Your credentials - ready to use
const TELEGRAM_TOKEN = '7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk';
const GROQ_API_KEY = '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';
const YOUR_CHAT_ID = 7643203581;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface TelegramUpdate {
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    voice?: { file_id: string; duration: number; file_size: number };
    from?: { first_name: string };
  };
}

interface ParsedTask {
  type: 'bug' | 'feature' | 'ui' | 'technical' | 'todo';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  component: string;
  action: 'github' | 'todo' | 'claude' | 'feedback';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update: TelegramUpdate = req.body;
    
    if (!update.message || update.message.chat.id !== YOUR_CHAT_ID) {
      return res.status(200).json({ ok: true });
    }

    const { message } = update;
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const userName = message.from?.first_name || 'User';
    
    // Send immediate acknowledgment
    await sendTelegramMessage(
      chatId, 
      `👋 Hi ${userName}! Message received, processing now...`,
      messageId
    );

    // Process voice or text
    let messageText = '';
    let messageType = '';
    
    if (message.voice) {
      messageType = 'voice';
      await sendTelegramMessage(
        chatId,
        `🎤 **Voice Note Detected!**\n\n✅ Duration: ${message.voice.duration}s\n📊 Size: ${Math.round(message.voice.file_size/1024)}KB\n\n🔄 Transcribing with Groq Whisper...`
      );
      
      messageText = await transcribeVoice(message.voice.file_id);
      
      await sendTelegramMessage(
        chatId,
        `📝 **Transcription Complete!**\n\n"${messageText.substring(0, 200)}${messageText.length > 200 ? '...' : ''}"\n\n🤖 Analyzing with AI...`
      );
    } else if (message.text) {
      messageType = 'text';
      messageText = message.text;
      
      await sendTelegramMessage(
        chatId,
        `💬 **Text Message Received!**\n\n"${messageText.substring(0, 100)}${messageText.length > 100 ? '...' : ''}"\n\n🤖 Analyzing with AI...`
      );
    } else {
      return res.status(200).json({ ok: true });
    }

    // Parse with AI
    const tasks = await parseWithGroq(messageText);
    
    // Send detailed confirmation
    const confirmationMessage = formatConfirmation(tasks, messageText);
    await sendTelegramMessage(chatId, confirmationMessage);
    
    // Save to database and route tasks
    for (const task of tasks) {
      await saveAndRouteTask(task, chatId, messageText, messageType);
    }
    
    return res.status(200).json({ ok: true, processed: tasks.length });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Send error message to user
    try {
      await sendTelegramMessage(
        req.body?.message?.chat?.id || YOUR_CHAT_ID,
        `❌ **Error Processing Message**\n\n${error.message}\n\nPlease try again or contact support.`
      );
    } catch (e) {
      console.error('Failed to send error message:', e);
    }
    
    return res.status(200).json({ ok: true }); // Always return 200 to Telegram
  }
}

async function transcribeVoice(fileId: string): Promise<string> {
  try {
    // Get file path from Telegram
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileData = await fileResponse.json();
    
    if (!fileData.ok) {
      throw new Error('Failed to get file info from Telegram');
    }
    
    // Download voice file
    const voiceResponse = await fetch(
      `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`
    );
    
    if (!voiceResponse.ok) {
      throw new Error('Failed to download voice file');
    }
    
    const voiceBuffer = await voiceResponse.arrayBuffer();
    
    // Transcribe with Groq Whisper
    const formData = new FormData();
    formData.append('file', new Blob([voiceBuffer], { type: 'audio/ogg' }), 'voice.ogg');
    formData.append('model', 'whisper-large-v3');
    
    const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });
    
    if (!transcriptionResponse.ok) {
      throw new Error(`Groq API error: ${transcriptionResponse.status}`);
    }
    
    const transcription = await transcriptionResponse.json();
    return transcription.text || 'No speech detected';
  } catch (error) {
    console.error('Transcription error:', error);
    return `[Transcription failed: ${error.message}]`;
  }
}

async function parseWithGroq(text: string): Promise<ParsedTask[]> {
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
            content: `You are a development assistant that parses feedback into actionable tasks.
Extract specific issues, categorize by component/page, and format for development.
Identify: bugs, feature requests, UI improvements, and technical debt.

Return a JSON object with this structure:
{
  "tasks": [
    {
      "type": "bug|feature|ui|technical|todo",
      "priority": "high|medium|low", 
      "title": "Brief title",
      "description": "Detailed description",
      "component": "Component or page name",
      "action": "github|todo|claude|feedback"
    }
  ],
  "summary": "Brief summary of all tasks"
}

Rules:
- If message mentions 'github' or 'issue', set action to 'github'
- Bugs are high priority by default
- Features go to 'claude' for implementation
- UI improvements go to 'claude' if high priority
- General todos go to 'todo'
- Parse user intent carefully`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return parsed.tasks || [];
  } catch (error) {
    console.error('AI parsing error:', error);
    return [{
      type: 'feedback',
      priority: 'medium',
      title: 'Manual review needed',
      description: text.substring(0, 500),
      component: 'general',
      action: 'feedback'
    }];
  }
}

function formatConfirmation(tasks: ParsedTask[], originalText: string): string {
  if (tasks.length === 0) {
    return `✅ **Message Processed!**\n\n📝 Original: "${originalText.substring(0, 100)}..."\n\n❓ No specific tasks identified. Saved as general feedback.`;
  }
  
  let response = `✅ **I Understood Your Request!**\n\n🎯 **Found ${tasks.length} task(s):**\n\n`;
  
  tasks.forEach((task, index) => {
    const emoji = {
      'bug': '🐛',
      'feature': '✨', 
      'ui': '🎨',
      'technical': '🔧',
      'todo': '📝'
    }[task.type] || '📌';
    
    const priority = {
      'high': '🔴 HIGH',
      'medium': '🟡 MEDIUM', 
      'low': '🟢 LOW'
    }[task.priority];
    
    const actionEmoji = {
      'github': '🐙 GitHub Issue',
      'todo': '📝 Todo List',
      'claude': '🤖 Claude Code',
      'feedback': '💬 Feedback Log'
    }[task.action];
    
    response += `**${index + 1}.** ${emoji} **${task.title}**\n`;
    response += `   Priority: ${priority}\n`;
    response += `   Component: 📁 ${task.component}\n`;
    response += `   Action: ${actionEmoji}\n`;
    response += `   _${task.description}_\n\n`;
  });
  
  response += `🚀 **Processing tasks now...**\nYou'll get confirmations as each task is completed!`;
  
  return response;
}

async function saveAndRouteTask(task: ParsedTask, chatId: number, originalText: string, messageType: string) {
  try {
    // Save to Supabase
    const { data: savedTask, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: 'telegram_feedback',
        status: 'pending',
        metadata: {
          type: task.type,
          component: task.component,
          action: task.action,
          source: 'telegram',
          message_type: messageType,
          chat_id: chatId,
          original_text: originalText.substring(0, 1000),
          created_via: 'voice_assistant'
        },
      })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      await sendTelegramMessage(
        chatId,
        `⚠️ **Database Error**\n\nTask: ${task.title}\nError: ${error.message}`
      );
      return;
    }
    
    // Route based on action
    switch (task.action) {
      case 'github':
        await createGitHubPlaceholder(task, savedTask.id, chatId);
        break;
      case 'todo':
        await createTodoPlaceholder(task, savedTask.id, chatId);
        break;
      case 'claude':
        await saveForClaude(task, savedTask.id, chatId);
        break;
      default:
        await sendTelegramMessage(
          chatId,
          `📋 **Saved as Feedback**\n\n${task.title}\nTask ID: ${savedTask.id}`
        );
        break;
    }
  } catch (error) {
    console.error('Error routing task:', error);
    await sendTelegramMessage(
      chatId,
      `❌ **Task Routing Failed**\n\n${task.title}\nError: ${error.message}`
    );
  }
}

async function createGitHubPlaceholder(task: ParsedTask, taskId: string, chatId: number) {
  // For now, just confirm - GitHub integration can be added later
  await sendTelegramMessage(
    chatId,
    `🐙 **Ready for GitHub!**\n\n**${task.title}**\nPriority: ${task.priority}\nTask ID: ${taskId}\n\n_GitHub integration coming next!_`
  );
}

async function createTodoPlaceholder(task: ParsedTask, taskId: string, chatId: number) {
  // For now, just confirm - Notion integration can be added later
  await sendTelegramMessage(
    chatId,
    `📝 **Added to Todo List!**\n\n**${task.title}**\nPriority: ${task.priority}\nTask ID: ${taskId}\n\n_View in your Supabase dashboard_`
  );
}

async function saveForClaude(task: ParsedTask, taskId: string, chatId: number) {
  const claudePrompt = `# Task: ${task.title}

**Type**: ${task.type}
**Priority**: ${task.priority}
**Component**: ${task.component}

## Description
${task.description}

## Implementation Instructions
1. Locate the ${task.component} component in the SISO agency app
2. Implement the ${task.type} as described
3. Follow SISO brand guidelines (orange/yellow theme)
4. Run lint and build checks
5. Test thoroughly

Task ID: ${taskId}
Source: Telegram Voice Assistant`;

  // Save Claude task
  const { error } = await supabase
    .from('claude_tasks')
    .insert({
      task_id: taskId,
      prompt: claudePrompt,
      status: 'pending',
      metadata: {
        component: task.component,
        type: task.type,
        priority: task.priority
      }
    });

  if (error) {
    console.error('Claude task save error:', error);
  }

  await sendTelegramMessage(
    chatId,
    `🤖 **Queued for Claude Code!**\n\n**${task.title}**\nComponent: ${task.component}\nTask ID: ${taskId}\n\n_Ready for automated development!_`
  );
}

async function sendTelegramMessage(chatId: number, text: string, replyTo?: number) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_to_message_id: replyTo,
      }),
    });
    
    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}