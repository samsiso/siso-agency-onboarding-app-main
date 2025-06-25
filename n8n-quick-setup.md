# 🚀 n8n Quick Setup for Telegram Voice Assistant

## Your Credentials (Ready to Use)
- **Bot Token**: `7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk`
- **Chat ID**: `7643203581`
- **Groq API Key**: `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`

## Step 1: Install & Start n8n

```bash
# Option 1: Using npm
npm install -g n8n
n8n start

# Option 2: Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Open: http://localhost:5678

## Step 2: Quick Credential Setup

### Telegram Credentials
1. Go to **Credentials** → **New** → Search "Telegram"
2. **Name**: Telegram Bot
3. **Access Token**: `7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk`
4. Save

### Groq API Credentials
1. **Credentials** → **New** → **HTTP Header Auth**
2. **Name**: Groq API
3. **Header Name**: `Authorization`
4. **Header Value**: `Bearer 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`
5. Save

## Step 3: Import & Activate Workflow

1. Download: `n8n-telegram-assistant-workflow.json`
2. In n8n: **Workflows** → **Import from File**
3. Click **Telegram Trigger** node → **Listen for Test Event**
4. Copy the webhook URL (looks like: `http://localhost:5678/webhook/xxx`)

## Step 4: Set Webhook (Choose One)

### For Local Testing (with ngrok)
```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Expose n8n
ngrok http 5678

# Set webhook with ngrok URL
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR-NGROK-ID.ngrok.io/webhook/telegram-assistant-webhook"}'
```

### For Production (VPS/Cloud)
```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/webhook/telegram-assistant-webhook"}'
```

## Step 5: Test It!

Send a test message:
```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": 7643203581, "text": "🤖 Voice Assistant is ready! Send me a voice note or text."}'
```

Then try:
1. **Text**: "Add user authentication to the login page"
2. **Voice**: "The dashboard sidebar is broken on mobile"

## 🎯 Usage Examples

### Voice Note → GitHub Issue
> "There's a bug where the commission card overlaps the footer on mobile"

**Bot creates**:
- GitHub issue with bug label
- Assigns high priority
- Sends confirmation with issue link

### Text → Notion Todo
> "Remember to update the API documentation"

**Bot creates**:
- Notion task in your database
- Sets status to "To Do"
- Confirms with Notion link

### Complex Feedback → Multiple Actions
> "The partnership dashboard needs fixes. The greeting card should be personalized and the layout breaks on iPad"

**Bot creates**:
- 2 separate tasks
- Routes UI fix to Claude
- Routes personalization to GitHub

## 🔧 Additional Workflows

### Add GitHub Integration
1. Import `n8n-github-integration.json`
2. Update credentials:
   - Create GitHub token with `repo` scope
   - Add to n8n credentials
3. Connect to main workflow output

### Add Notion Integration
1. Import `n8n-supabase-todo.json`
2. Get Notion API key from notion.so/my-integrations
3. Share your database with the integration
4. Add credentials to n8n

### Add Claude Integration
1. Import `n8n-claude-integration.json`
2. Set file path for task storage
3. Connect to main workflow

## 📊 Monitoring

Check webhook status:
```bash
curl "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo"
```

View n8n execution history:
- Click **Executions** in n8n
- See all processed messages
- Debug any failures

## 🚀 Pro Tips

1. **Batch Commands**: "Fix the sidebar bug and add CSV export"
2. **Priority Keywords**: "urgent", "high priority", "asap"
3. **Project Context**: "In the partnership dashboard..."
4. **Direct Routing**: "Send to GitHub: [task]" or "Todo: [task]"

## 🆘 Troubleshooting

**Webhook not receiving messages?**
- Check ngrok is running (for local)
- Verify webhook URL in getWebhookInfo
- Ensure n8n workflow is active

**Voice notes failing?**
- Check file size (max 20MB)
- Verify Groq API key is valid
- Look at n8n execution logs

**AI not parsing correctly?**
- Check the system prompt in Parse with AI node
- Add more examples to improve accuracy

Ready to go! Send your first message to the bot 🎉