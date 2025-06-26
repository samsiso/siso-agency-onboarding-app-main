// Vercel API Route: /api/telegram-voice-assistant
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;

interface TelegramUpdate {
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    voice?: { file_id: string; duration: number };
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
    
    if (!update.message) {
      return res.status(200).json({ ok: true });
    }

    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;
    
    // Process voice or text
    let messageText = '';
    
    if (update.message.voice) {
      // Download and transcribe voice
      messageText = await transcribeVoice(update.message.voice.file_id);
    } else if (update.message.text) {
      messageText = update.message.text;
    } else {
      return res.status(200).json({ ok: true });
    }

    // Parse with AI
    const tasks = await parseWithGroq(messageText);
    
    // Send initial response
    await sendTelegramMessage(chatId, formatTaskResponse(tasks), messageId);
    
    // Route tasks
    for (const task of tasks) {
      await routeTask(task, chatId);
    }
    
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(200).json({ ok: true }); // Always return 200 to Telegram
  }
}

async function transcribeVoice(fileId: string): Promise<string> {
  // Get file path from Telegram
  const fileResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`
  );
  const fileData = await fileResponse.json();
  
  // Download voice file
  const voiceResponse = await fetch(
    `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${fileData.result.file_path}`
  );
  const voiceBuffer = await voiceResponse.arrayBuffer();
  
  // Transcribe with Groq Whisper
  const formData = new FormData();
  formData.append('file', new Blob([voiceBuffer]), 'voice.ogg');
  formData.append('model', 'whisper-large-v3');
  
  const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
  });
  
  const transcription = await transcriptionResponse.json();
  return transcription.text;
}

async function parseWithGroq(text: string): Promise<ParsedTask[]> {
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
- bugs with high priority go to github
- features go to claude
- ui improvements go to claude if high priority
- general todos go to notion
- everything else is feedback`,
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
  
  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed.tasks || [];
}

async function routeTask(task: ParsedTask, chatId: number) {
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
          source: 'telegram',
          chat_id: chatId,
        },
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Route based on action
    switch (task.action) {
      case 'github':
        await createGitHubIssue(task, savedTask.id, chatId);
        break;
      case 'todo':
        await createNotionTask(task, savedTask.id, chatId);
        break;
      case 'claude':
        await saveForClaude(task, savedTask.id, chatId);
        break;
      default:
        // Just saved to Supabase as feedback
        break;
    }
  } catch (error) {
    console.error('Error routing task:', error);
    await sendTelegramMessage(
      chatId,
      `❌ Failed to process task: ${task.title}\nError: ${error.message}`
    );
  }
}

async function createGitHubIssue(task: ParsedTask, taskId: string, chatId: number) {
  const response = await fetch('https://api.github.com/repos/YOUR_ORG/YOUR_REPO/issues', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: task.title,
      body: `## Description\n${task.description}\n\n### Details\n- **Type**: ${task.type}\n- **Priority**: ${task.priority}\n- **Component**: ${task.component}\n- **Source**: Telegram Assistant\n- **Task ID**: ${taskId}\n\n---\n*Created automatically via Telegram Assistant*`,
      labels: [task.type, `priority:${task.priority}`, 'telegram-created'],
    }),
  });
  
  const issue = await response.json();
  
  // Update Supabase with issue URL
  await supabase
    .from('tasks')
    .update({ 
      metadata: { github_issue_url: issue.html_url },
      status: 'in_progress',
    })
    .eq('id', taskId);
    
  await sendTelegramMessage(
    chatId,
    `✅ GitHub Issue Created!\n\n**${task.title}**\nIssue #${issue.number}: ${issue.html_url}`
  );
}

async function createNotionTask(task: ParsedTask, taskId: string, chatId: number) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: task.title } }],
        },
        Status: {
          select: { name: 'To Do' },
        },
        Priority: {
          select: { name: task.priority },
        },
        Description: {
          rich_text: [{ text: { content: task.description } }],
        },
        Component: {
          select: { name: task.component },
        },
      },
    }),
  });
  
  const page = await response.json();
  
  // Update Supabase
  await supabase
    .from('tasks')
    .update({ 
      metadata: { notion_page_id: page.id },
      status: 'in_progress',
    })
    .eq('id', taskId);
    
  await sendTelegramMessage(
    chatId,
    `📝 Added to Notion!\n\n**${task.title}**\nView in Notion: ${page.url || 'Check your database'}`
  );
}

async function saveForClaude(task: ParsedTask, taskId: string, chatId: number) {
  // Save to a special table or file system for Claude Code
  const claudePrompt = `
## Task: ${task.title}

**Type**: ${task.type}
**Priority**: ${task.priority}
**Component**: ${task.component}

### Description
${task.description}

### Implementation Instructions
1. Locate the ${task.component} component
2. Implement the ${task.type} as described
3. Follow SISO brand guidelines (orange/yellow theme)
4. Run lint and build checks
5. Test thoroughly

Task ID: ${taskId}
`;
  
  // Save to Supabase claude_tasks table or file system
  await supabase
    .from('claude_tasks')
    .insert({
      task_id: taskId,
      prompt: claudePrompt,
      status: 'pending',
    });
    
  await sendTelegramMessage(
    chatId,
    `🤖 Saved for Claude Code!\n\n**${task.title}**\nTask ID: ${taskId}`
  );
}

async function sendTelegramMessage(chatId: number, text: string, replyTo?: number) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_to_message_id: replyTo,
    }),
  });
}

function formatTaskResponse(tasks: ParsedTask[]): string {
  if (tasks.length === 0) {
    return '📋 No specific tasks identified. Please provide more details.';
  }
  
  let response = `📋 **Parsed ${tasks.length} task(s)**\n\n`;
  
  tasks.forEach((task) => {
    const emoji = {
      bug: '🐛',
      feature: '✨',
      ui: '🎨',
      technical: '🔧',
      todo: '📝',
    }[task.type] || '📌';
    
    const priority = {
      high: '🔴',
      medium: '🟡',
      low: '🟢',
    }[task.priority];
    
    response += `${emoji} **${task.title}** ${priority}\n`;
    response += `   ${task.description}\n`;
    response += `   📁 ${task.component} | 🎯 ${task.action}\n\n`;
  });
  
  return response;
}