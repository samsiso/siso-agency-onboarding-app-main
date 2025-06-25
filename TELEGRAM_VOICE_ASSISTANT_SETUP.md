# 🎙️ Telegram Voice Assistant Setup

## Overview
A voice-controlled development assistant that:
- Transcribes voice notes using Groq's Whisper API
- Categorizes feedback with AI (bugs, features, todos)
- Automatically creates GitHub issues, Notion tasks, or Claude Code prompts
- Integrates with your existing Supabase database

## 🚀 Quick Setup

### Option 1: Vercel API Route (Recommended)
This integrates directly with your existing Siso app.

1. **Copy the API route** to your project:
   ```bash
   cp telegram-voice-assistant-api.ts pages/api/telegram-voice-assistant.ts
   ```

2. **Add environment variables** to Vercel:
   ```bash
   # Already have these
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-service-key
   
   # Add these new ones
   GITHUB_TOKEN=ghp_your_github_token
   NOTION_API_KEY=secret_your_notion_key
   NOTION_DATABASE_ID=your_database_id
   ```

3. **Set up Telegram webhook**:
   ```bash
   curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/api/telegram-voice-assistant"}'
   ```

4. **Create required Supabase tables**:
   ```sql
   -- Add claude_tasks table
   CREATE TABLE claude_tasks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     task_id UUID REFERENCES tasks(id),
     prompt TEXT NOT NULL,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Update tasks table with metadata
   ALTER TABLE tasks
   ADD COLUMN metadata JSONB DEFAULT '{}';
   ```

### Option 2: n8n Workflow
Use the provided n8n workflows for a visual automation approach.

1. **Install n8n** and import workflows
2. **Configure credentials** as described in setup guide
3. **Set webhook** to n8n instance

## 📱 Usage Examples

### Voice Note Examples

**Bug Report:**
> "The partnership dashboard has a bug where the commission card overlaps the footer on mobile devices"

**Response:**
```
🐛 Fix commission card overlap 🔴
   Commission card overlapping footer on mobile view
   📁 partnership-dashboard | 🎯 github
   
✅ GitHub Issue Created!
Issue #42: https://github.com/your-org/repo/issues/42
```

**Feature Request:**
> "Add a feature to export client data to CSV format with filters"

**Response:**
```
✨ Add CSV export for clients 🟡
   Feature to export client data to CSV format
   📁 client-management | 🎯 claude
   
🤖 Saved for Claude Code!
Task ID: abc123
```

**Todo Item:**
> "Remember to update the documentation for the new API endpoints"

**Response:**
```
📝 Update API documentation 🟢
   Update documentation for new API endpoints
   📁 documentation | 🎯 todo
   
📝 Added to Notion!
```

## 🛠️ Configuration

### GitHub Integration
1. Get a Personal Access Token with `repo` scope
2. Set repository in the code: `YOUR_ORG/YOUR_REPO`
3. Labels are automatically created if they don't exist

### Notion Integration
1. Create an integration at notion.so/my-integrations
2. Share your database with the integration
3. Database should have these properties:
   - Name (title)
   - Status (select: To Do, In Progress, Done)
   - Priority (select: low, medium, high)
   - Description (rich text)
   - Component (select)

### Groq Configuration
- Using free tier with Llama 3 8B model
- Whisper Large V3 for voice transcription
- 30 requests/minute limit on free tier

## 🔧 Advanced Features

### Custom Commands
Add these to the message handler:

```typescript
// Check for commands
if (messageText.startsWith('/')) {
  switch (messageText.split(' ')[0]) {
    case '/status':
      // Show open tasks
      break;
    case '/stats':
      // Show statistics
      break;
    case '/help':
      // Show help message
      break;
  }
}
```

### Project Context
Add project switching:

```typescript
// Detect project context
if (messageText.includes('project:')) {
  const project = messageText.match(/project:(\w+)/)?.[1];
  // Store in session or metadata
}
```

### Batch Processing
Handle multiple tasks in one message:

```typescript
// Split by keywords
const sections = messageText.split(/also|and|plus/i);
// Process each section separately
```

## 📊 Monitoring

### Supabase Dashboard
Track all tasks in your Supabase dashboard:
- View task distribution by category
- Monitor completion rates
- Analyze feedback patterns

### Telegram Analytics
```sql
-- Most active hours
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as task_count
FROM tasks
WHERE metadata->>'source' = 'telegram'
GROUP BY hour
ORDER BY hour DESC;

-- Task distribution
SELECT 
  metadata->>'type' as task_type,
  COUNT(*) as count
FROM tasks
WHERE metadata->>'source' = 'telegram'
GROUP BY task_type;
```

## 🚨 Troubleshooting

### Voice notes not working
1. Check file size (max 20MB for Telegram)
2. Verify Groq API key is valid
3. Check webhook is receiving updates:
   ```bash
   curl "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo"
   ```

### Tasks not routing correctly
1. Check AI categorization prompt
2. Verify API credentials
3. Look at Vercel function logs

### Rate limits
- Groq: 30 requests/minute (free tier)
- GitHub: 5000 requests/hour
- Notion: 3 requests/second

## 🔒 Security Notes

1. **Rotate the Telegram token** - The one in code is exposed
2. **Use environment variables** for all credentials
3. **Validate chat IDs** to restrict access:
   ```typescript
   const ALLOWED_CHATS = [7643203581]; // Your chat ID
   if (!ALLOWED_CHATS.includes(chatId)) return;
   ```
4. **Enable Vercel request signing** for webhooks

## 🎯 Next Steps

1. **Add Claude Code PC integration**:
   - Watch file system for new tasks
   - Auto-execute Claude Code commands
   
2. **Implement research agent**:
   - Web search integration
   - Documentation lookup
   
3. **Add voice responses**:
   - Text-to-speech for status updates
   - Progress notifications

4. **Build dashboard**:
   - Task overview in your app
   - Analytics and insights

## 💡 Pro Tips

1. **Use voice shortcuts**: "Bug in dashboard" auto-categorizes as bug
2. **Batch feedback**: Send multiple issues in one message
3. **Add context**: "High priority" or "Project X" for better routing
4. **Review weekly**: Check completed vs pending tasks

Ready to start? Send your first voice note to the bot! 🚀