# AI Agent Quick Start Guide

## Prerequisites

Before starting, ensure you have:

1. **Accounts Created**:
   - [ ] Telegram Bot (via @BotFather)
   - [ ] GitHub account with personal access token
   - [ ] Notion integration token
   - [ ] Supabase project
   - [ ] Vercel account
   - [ ] Groq API key
   - [ ] Grok/X.AI API key (optional)

2. **Infrastructure Ready**:
   - [ ] Node.js 18+ installed
   - [ ] Git configured
   - [ ] Telegram bot token
   - [ ] Domain for webhook (or use ngrok for testing)

## Step 1: Clone and Setup Repository

```bash
# Clone the AI agent repository
git clone https://github.com/siso-agency/ai-agent-system.git
cd ai-agent-system

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 2: Configure Environment Variables

Edit `.env` with your credentials:

```bash
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram-webhook

# AI Model APIs
GROQ_API_KEY=your_groq_api_key
GROK_API_KEY=your_grok_api_key  # Optional
GEMINI_API_KEY=your_gemini_api_key  # Optional, free tier
ANTHROPIC_API_KEY=your_claude_api_key  # Optional, for QA

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPOS=siso-agency/ubah-crypto,siso-agency/siso-app,siso-agency/marroca

# Notion Integration
NOTION_TOKEN=your_notion_integration_token
NOTION_TASKS_DB_ID=your_notion_database_id

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Vercel Deployment (Optional)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_IDS={"siso-app": "prj_xxx", "ubah-crypto": "prj_yyy"}

# Claude Code Server (Optional)
CLAUDE_CODE_URL=http://your-pc:3000
CLAUDE_CODE_TOKEN=your_claude_code_token
```

## Step 3: Initialize Database

Run the database setup script:

```bash
# Apply database migrations
npm run db:migrate

# Seed initial data (tools, etc.)
npm run db:seed

# Verify setup
npm run db:verify
```

Or manually run SQL in Supabase:

```sql
-- Copy contents from docs/features/ai-agents/database-schema.md
-- Run each CREATE TABLE statement
-- Run indexes and functions
-- Enable RLS policies
```

## Step 4: Set Up Telegram Webhook

### Option A: Production Domain

```bash
# Set webhook to your domain
npm run telegram:webhook:set

# Verify webhook
npm run telegram:webhook:info
```

### Option B: Local Development with ngrok

```bash
# In terminal 1: Start local server
npm run dev

# In terminal 2: Start ngrok
ngrok http 3000

# Set webhook to ngrok URL
export TELEGRAM_WEBHOOK_URL=https://abc123.ngrok.io/api/telegram-webhook
npm run telegram:webhook:set
```

## Step 5: Configure Initial Tools

### GitHub Setup

1. Create a personal access token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with scopes: `repo`, `read:org`
   - Add to `.env` as `GITHUB_TOKEN`

2. Test GitHub integration:
   ```bash
   npm run test:github
   ```

### Notion Setup

1. Create Notion integration:
   - Go to https://www.notion.so/my-integrations
   - Create new integration
   - Copy the token to `.env`

2. Share database with integration:
   - Open your Notion tasks database
   - Click Share → Invite → Select your integration
   - Copy database ID from URL

3. Test Notion integration:
   ```bash
   npm run test:notion
   ```

## Step 6: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add GROQ_API_KEY production
# ... add all other env vars

# Redeploy with env vars
vercel --prod
```

## Step 7: Test Basic Commands

Send these messages to your Telegram bot:

```
# Text commands
/start - Initialize bot
Create GitHub issue for login bug - Tests GitHub integration
Add task: Review PR #123 - Tests Notion integration
Show my tasks - Tests Supabase query

# Voice message
Record: "Create an issue in ubah crypto for fixing the payment gateway"
```

## Step 8: Enable Advanced Features

### Multi-Agent Support

```bash
# Install Ollama on Mac Mini (for local models)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Mixtral model
ollama pull mixtral

# Update .env
OLLAMA_URL=http://localhost:11434
```

### Claude Code Integration

```bash
# On your 24/7 PC, set up Claude Code server
git clone https://github.com/siso-agency/claude-code-server
cd claude-code-server
npm install
npm run start

# Update .env with PC URL
CLAUDE_CODE_URL=http://192.168.1.100:3000
```

### Voice Responses

```bash
# Enable TTS in .env
ENABLE_VOICE_RESPONSES=true
TTS_PROVIDER=groq  # or elevenlabs
```

## Step 9: Monitor and Debug

### Check Logs

```bash
# View real-time logs
npm run logs

# View Vercel logs
vercel logs

# Check Supabase logs
# Go to Supabase Dashboard → Logs
```

### Debug Commands

```
# In Telegram
/debug - Show system status
/tools - List available tools
/stats - Show usage statistics
```

### Common Issues

1. **Webhook not receiving messages**:
   ```bash
   # Check webhook status
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

2. **Database connection errors**:
   ```bash
   # Test Supabase connection
   npm run test:db
   ```

3. **Tool execution failures**:
   - Check API keys are valid
   - Verify rate limits not exceeded
   - Check tool permissions

## Step 10: Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Webhook URL using HTTPS
- [ ] Error monitoring enabled (Sentry)
- [ ] Rate limiting configured
- [ ] Backup strategy in place
- [ ] Security audit completed
- [ ] User documentation created

## Quick Commands Reference

```bash
# Development
npm run dev           # Start development server
npm run test         # Run all tests
npm run lint         # Check code quality

# Database
npm run db:migrate   # Apply migrations
npm run db:reset     # Reset database
npm run db:backup    # Backup database

# Telegram
npm run telegram:webhook:set    # Set webhook
npm run telegram:webhook:remove  # Remove webhook
npm run telegram:test           # Send test message

# Deployment
npm run build        # Build for production
npm run deploy       # Deploy to Vercel
npm run logs         # View logs
```

## Next Steps

1. **Customize Tools**: Add your specific tools in `/src/tools/`
2. **Train Patterns**: Improve AI responses with examples
3. **Add Integrations**: Connect more services
4. **Scale Up**: Add more models and agents
5. **Monitor Usage**: Set up analytics dashboard

## Support Resources

- **Documentation**: `/docs/features/ai-agents/`
- **Examples**: `/examples/`
- **Community**: Discord/Telegram group
- **Issues**: GitHub Issues

## Troubleshooting

### Bot Not Responding

```bash
# Check webhook
curl https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo

# Check recent updates
curl https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates

# Test direct message
curl -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "YOUR_CHAT_ID", "text": "Test message"}'
```

### Database Issues

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'agent_%';

-- Check recent conversations
SELECT * FROM agent_conversations 
ORDER BY created_at DESC LIMIT 10;

-- Check tool executions
SELECT tool_name, COUNT(*), AVG(execution_time_ms) 
FROM agent_tool_calls 
GROUP BY tool_name;
```

### Performance Optimization

1. **Enable Caching**:
   ```javascript
   // In config/cache.js
   export const cacheConfig = {
     research: 3600,  // 1 hour
     github: 300,     // 5 minutes
     notion: 600      // 10 minutes
   };
   ```

2. **Use Edge Functions**:
   ```bash
   # Deploy to Vercel Edge
   vercel --prod --functions=edge
   ```

3. **Optimize Database Queries**:
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_conversations_active 
   ON agent_conversations(last_message_at) 
   WHERE last_message_at > NOW() - INTERVAL '24 hours';
   ```

---

🎉 **Congratulations!** Your AI Agent is now operational. Start with simple commands and gradually enable more features as needed.