# 🚀 Deploy SISO Telegram Webhook to Glitch (100% FREE)

## Why Glitch?
- ✅ **Completely FREE forever**
- ✅ **24/7 uptime** (with auto-wake)
- ✅ **No credit card required**
- ✅ **Built-in code editor**
- ✅ **Auto-deploy on code changes**

## Quick Deploy Steps:

### 1. Go to Glitch
Visit: https://glitch.com

### 2. Create New Project
- Click "New Project"
- Choose "Import from GitHub"
- Or click "hello-express" for Node.js template

### 3. Replace Files
Copy the contents of these files into your Glitch project:

**package.json** (copy from `railway-package.json`):
```json
{
  "name": "siso-telegram-webhook",
  "version": "1.0.0",
  "description": "SISO Agency 24/7 Telegram Voice Assistant Webhook",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "node-fetch": "^2.6.7",
    "form-data": "^4.0.0"
  },
  "engines": {
    "node": ">=16"
  }
}
```

**server.js** (copy from `railway-server.js`):
[The complete server code - copy/paste the entire railway-server.js content]

### 4. Your Glitch URL
After deployment, your webhook URL will be:
`https://YOUR-PROJECT-NAME.glitch.me/webhook/telegram`

### 5. Update Telegram Webhook
Run this command with your new Glitch URL:
```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR-PROJECT-NAME.glitch.me/webhook/telegram"}'
```

## ✅ Benefits:
- **$0/month forever**
- **Auto-wake on requests** (sleeps after 5 min of inactivity)
- **Logs included**
- **Easy to update**
- **Works perfectly for Telegram webhooks**

## 🔧 Alternative: Replit
If you prefer Replit (also free):
1. Go to https://replit.com
2. Create new Node.js project
3. Copy the same files
4. Run and get your URL

Both platforms are perfect for this use case! 