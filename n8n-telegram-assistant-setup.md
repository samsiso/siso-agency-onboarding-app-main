# 🤖 Telegram AI Assistant Setup Guide

## Quick Start

Your bot token: `7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk`
Your chat ID: `7643203581`

## 📋 Step 1: Install n8n

```bash
# Using npm (globally)
npm install n8n -g

# Or using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Start n8n
n8n start
```

Access n8n at: `http://localhost:5678`

## 🔧 Step 2: Set Up Credentials

### A. Telegram Bot Credentials
1. In n8n, go to **Credentials** → **New**
2. Search for "Telegram"
3. Name: "Telegram Bot"
4. Access Token: `7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk`
5. Save

### B. Groq API Credentials
1. Get your free API key from: https://console.groq.com/keys
2. In n8n: **Credentials** → **New** → **HTTP Header Auth**
3. Name: "Groq API"
4. Header Name: `Authorization`
5. Header Value: `Bearer YOUR_GROQ_API_KEY`
6. Save

## 📥 Step 3: Import the Workflow

1. In n8n, click **Workflows** → **New**
2. Click the three dots menu → **Import from File**
3. Select `n8n-telegram-assistant-workflow.json`
4. The workflow will appear in your canvas

## 🔗 Step 4: Set Up Webhook

1. In the workflow, click on the **Telegram Trigger** node
2. Click **Listen for Test Event**
3. Copy the webhook URL (looks like: `https://your-n8n-url/webhook/telegram-assistant-webhook`)
4. Set the webhook on Telegram:

```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "YOUR_N8N_WEBHOOK_URL"}'
```

## 🎯 Step 5: Test the Bot

1. Send a message to your bot on Telegram
2. Try a voice note: "The dashboard sidebar is broken on mobile"
3. Try text: "Add user authentication to the login page"

## 🔧 Additional Workflows

### GitHub Issues Integration

```json
{
  "parameters": {
    "owner": "YOUR_GITHUB_USERNAME",
    "repository": "YOUR_REPO_NAME",
    "title": "={{$json.task.title}}",
    "body": "={{$json.task.description}}\\n\\nComponent: {{$json.task.component}}\\nPriority: {{$json.task.priority}}\\n\\nCreated via Telegram Assistant",
    "labels": ["={{$json.task.type}}", "={{$json.task.priority}}"]
  },
  "name": "Create GitHub Issue",
  "type": "n8n-nodes-base.github",
  "position": [2250, 200]
}
```

### Supabase Todo Integration

```json
{
  "parameters": {
    "operation": "insert",
    "table": "tasks",
    "columns": "title,description,priority,category,status,user_id",
    "values": "={{$json.task.title}},={{$json.task.description}},={{$json.task.priority}},telegram_feedback,pending,YOUR_USER_ID"
  },
  "name": "Create Supabase Task",
  "type": "n8n-nodes-base.supabase",
  "position": [2250, 400]
}
```

### Claude Code Integration

```json
{
  "parameters": {
    "path": "/path/to/claude-tasks/",
    "fileName": "={{$now.toFormat('yyyy-MM-dd-HHmmss')}}-task.md",
    "fileContent": "# Task from Telegram\\n\\n**Type**: {{$json.task.type}}\\n**Priority**: {{$json.task.priority}}\\n**Component**: {{$json.task.component}}\\n\\n## Description\\n{{$json.task.description}}\\n\\n## Implementation Request\\nPlease implement this {{$json.task.type}} in the {{$json.task.component}} component."
  },
  "name": "Save for Claude Code",
  "type": "n8n-nodes-base.writeBinaryFile",
  "position": [2250, 600]
}
```

## 💬 Commands Reference

### Basic Commands
- `/start` - Initialize bot
- `/help` - Show commands
- `/status` - Check bot status

### Task Commands
- "Send to GitHub" - Creates GitHub issue
- "Add to todos" - Adds to your todo system
- "Build this" - Sends to Claude Code
- "Just feedback" - Stores without action

### Examples

**Voice Note Example:**
"On the partnership dashboard, the commission card is overlapping the footer. Also the greeting message should be personalized based on time of day. High priority bug."

**Text Example:**
"Feature request: Add export to CSV functionality for the client table. Should include all columns and filters. Medium priority."

## 🚀 Advanced Features

### 1. Context Memory
Add a Redis node to store conversation history:
```javascript
// Store last 10 messages per user
const key = `telegram:${chatId}:history`;
const history = await $redis.get(key) || [];
history.push({text: messageText, timestamp: new Date()});
await $redis.set(key, history.slice(-10));
```

### 2. Project Switching
```javascript
// Detect project commands
if (text.toLowerCase().includes('switch to')) {
  const project = text.match(/switch to (.+)/i)[1];
  await $redis.set(`telegram:${chatId}:project`, project);
}
```

### 3. Status Updates
```javascript
// Check GitHub issue status
const issues = await $github.listIssues({state: 'open'});
const summary = `You have ${issues.length} open issues`;
```

## 🛠️ Troubleshooting

### Webhook Not Working
1. Check n8n is accessible from internet (use ngrok if local)
2. Verify webhook URL is correct
3. Check Telegram webhook status:
```bash
curl "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo"
```

### Voice Notes Not Processing
1. Ensure Groq API key is valid
2. Check audio file size (max 25MB)
3. Verify Whisper model is available

### AI Not Parsing Correctly
1. Refine the system prompt
2. Add examples to the prompt
3. Check Groq API limits

## 🔒 Security Notes

1. **Never commit your bot token** - Use environment variables
2. **Restrict bot access** - Set allowed chat IDs
3. **Validate inputs** - Sanitize before GitHub/database operations
4. **Use HTTPS** - Always use secure webhooks

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Groq API Docs](https://console.groq.com/docs)
- [GitHub API Reference](https://docs.github.com/en/rest)