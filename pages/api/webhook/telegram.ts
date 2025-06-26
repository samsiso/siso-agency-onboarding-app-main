import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'samsiso/siso-agency-onboarding-app-main';
const CHAT_ID = 7643203581;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// --- Tool Definitions ---

const tools = {
  createGitHubIssue: {
    name: "createGitHubIssue",
    description: "Create an issue in any GitHub repository",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "Repository in format 'owner/repo'",
          enum: [
            "siso-agency/ubah-crypto",
            "siso-agency/siso-app",
            "siso-agency/marroca-activities",
            "siso-agency/ai-agent-system"
          ]
        },
        title: {
          type: "string",
          description: "Issue title"
        },
        body: {
          type: "string",
          description: "Issue description in markdown"
        },
        labels: {
          type: "array",
          description: "Labels to apply",
          items: { type: "string" }
        }
      },
      required: ["repo", "title", "body"]
    },
    handler: async (params: any) => {
      // Dynamic import for Octokit
      const { Octokit } = await import("@octokit/rest");
      const octokit = new Octokit({ auth: GITHUB_TOKEN });
      
      const [owner, repo] = params.repo.split('/');
      
      const issue = await octokit.rest.issues.create({
        owner,
        repo,
        title: params.title,
        body: params.body + "\n\n---\n*Created by SISO AI Agent*",
        labels: params.labels || []
      });
      
      // Log tool call to Supabase
      // This will be handled by the main logic now
      
      return {
        success: true,
        issue_number: issue.data.number,
        url: issue.data.html_url
      };
    }
  }
};

type Tool = keyof typeof tools;

// --- Conversation Management ---

async function getOrCreateConversation(chatId: number) {
  const { data, error } = await supabase
    .from('agent_conversations')
    .select('*')
    .eq('telegram_chat_id', chatId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: "object not found"
    throw error;
  }

  if (data) {
    return data;
  }

  // Create new conversation
  const { data: newData, error: createError } = await supabase
    .from('agent_conversations')
    .insert({ telegram_chat_id: chatId, conversation_history: [] })
    .select()
    .single();

  if (createError) {
    throw createError;
  }
  return newData;
}

async function updateConversationHistory(conversationId: string, newHistory: any[]) {
  const { error } = await supabase
    .from('agent_conversations')
    .update({ conversation_history: newHistory, updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) {
    throw error;
  }
}

async function logToolCall(conversationId: string, toolName: string, params: any, result: any, success: boolean, errorMessage?: string) {
    await supabase.from('agent_tool_calls').insert({
        conversation_id: conversationId,
        tool_name: toolName,
        parameters: params,
        result: success ? result : null,
        success: success,
        error_message: errorMessage,
    });
}

// --- Utility Functions ---

async function sendTelegramMessage(chatId: number, text: string, messageId?: number) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: messageId
    }),
  });
}

async function transcribeVoice(fileId: string): Promise<string> {
  // Get file path from Telegram
  const fileInfoUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`;
  const fileInfoResponse = await fetch(fileInfoUrl);
  const fileInfo = await fileInfoResponse.json();
  const filePath = fileInfo.result.file_path;
  
  // Download file
  const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
  const fileResponse = await fetch(fileUrl);
  const fileBlob = await fileResponse.blob();

  // Transcribe with Groq Whisper
  const formData = new FormData();
  formData.append('file', fileBlob, 'audio.ogg');
  formData.append('model', 'whisper-large-v3');

  const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    body: formData,
  });

  const transcriptionData = await transcriptionResponse.json();
  return transcriptionData.text;
}

// --- Main Handler ---

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    console.log('📨 Webhook received:', JSON.stringify(update, null, 2));

    if (!update.message || update.message.chat.id.toString() !== CHAT_ID.toString()) {
      console.log(`❌ Wrong chat ID: ${update.message?.chat?.id} !== ${CHAT_ID}`);
      return res.status(200).json({ ok: true });
    }

    const { message } = update;
    const chatId = message.chat.id;
    const userName = message.from?.first_name || 'User';
    const messageId = message.message_id;

    // Get or create conversation from Supabase
    const conversation = await getOrCreateConversation(chatId);
    const conversationHistory = conversation.conversation_history || [];

    // Send immediate acknowledgment
    await sendTelegramMessage(chatId, `👋 Hi ${userName}! Processing your request...`, messageId);

    // Process voice or text
    let messageText = '';
    
    if (message.voice) {
      await sendTelegramMessage(chatId, `🎤 Voice message detected! Transcribing...`, messageId);
      try {
        messageText = await transcribeVoice(message.voice.file_id);
        await sendTelegramMessage(chatId, `📝 Transcribed: "${messageText.substring(0, 200)}..."`, messageId);
      } catch (error) {
        console.error("Transcription error:", error);
        await sendTelegramMessage(chatId, `⚠️ Sorry, I couldn't transcribe that. Please try again.`, messageId);
        return res.status(200).json({ ok: true });
      }
    } else if (message.text) {
      messageText = message.text;
    } else {
      return res.status(200).json({ ok: true });
    }

    // Add user message to history
    conversationHistory.push({ role: 'user', content: messageText });

    // AI Analysis to determine tool and parameters
    await sendTelegramMessage(chatId, `🤖 Analyzing with AI to determine the required action...`, messageId);

    const systemPrompt = `You are an AI assistant that analyzes messages and determines which tool to use from a provided list. You have access to the conversation history. Respond with a JSON object containing the tool name and its parameters, or an action to take.
    
Possible actions are: 'execute_tool', 'confirm_action', 'chat'.

If confirming, include a 'message' field in your response.
If chatting, include a 'message' field.

The available tools are:
${JSON.stringify(Object.values(tools).map(({ name, description, parameters }) => ({ name, description, parameters })), null, 2)}
`;
    
    const analysisResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory // Include history here
        ],
        temperature: 0,
        response_format: { type: "json_object" }
      })
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("AI analysis failed:", errorText);
      await sendTelegramMessage(chatId, `🤖 AI analysis failed. Please try again.`, messageId);
      throw new Error(`AI analysis failed: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const aiResponse = JSON.parse(analysisData.choices[0]?.message?.content);

    // Add AI response to history
    conversationHistory.push({ role: 'assistant', content: JSON.stringify(aiResponse) });

    if (aiResponse && aiResponse.action === 'execute_tool' && tools[aiResponse.tool as Tool]) {
      const tool = tools[aiResponse.tool as Tool];
      await sendTelegramMessage(chatId, `Found tool: ${tool.name}. Executing...`, messageId);
      
      try {
        const result = await tool.handler(aiResponse.parameters);
        const resultMessage = `✅ **Task Complete: ${tool.name}**\n\n${JSON.stringify(result, null, 2)}`;
        await sendTelegramMessage(chatId, resultMessage, messageId);
        conversationHistory.push({ role: 'tool', tool_call_id: aiResponse.tool, name: aiResponse.tool, content: JSON.stringify(result) });
        await logToolCall(conversation.id, aiResponse.tool, aiResponse.parameters, result, true);

      } catch (error) {
        console.error("Tool execution error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await sendTelegramMessage(chatId, `❌ Error executing tool: ${tool.name}\n\n${errorMessage}`, messageId);
        conversationHistory.push({ role: 'tool', tool_call_id: aiResponse.tool, name: aiResponse.tool, content: JSON.stringify({error: errorMessage}) });
        await logToolCall(conversation.id, aiResponse.tool, aiResponse.parameters, null, false, errorMessage);
      }
    } else if (aiResponse && aiResponse.action === 'confirm_action') {
        await sendTelegramMessage(chatId, `🤔 **Confirmation Required:**\n\n${aiResponse.message}\n\nPlease respond with "yes" to proceed.`, messageId);
    } else if (aiResponse && aiResponse.action === 'chat') {
        await sendTelegramMessage(chatId, aiResponse.message, messageId);
    } else {
      await sendTelegramMessage(chatId, `I couldn't determine which action to take from your message. Could you please rephrase it?`, messageId);
    }
    
    // Update conversation history in Supabase
    await updateConversationHistory(conversation.id, conversationHistory);

    res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error in webhook handler:', error);
    // Avoid sending error message if headers already sent
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 