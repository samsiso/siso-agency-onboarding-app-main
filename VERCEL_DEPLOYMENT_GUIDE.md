# 🚀 **24/7 Vercel Deployment Guide**
### Telegram Voice Assistant Hosting

---

## 🎯 **Overview**

Your Telegram voice assistant is now ready for 24/7 hosting on Vercel! This setup provides:

- ✅ **Free 24/7 hosting** (Vercel free tier)
- ✅ **Auto-scaling serverless functions**
- ✅ **Global CDN distribution**
- ✅ **Automatic HTTPS**
- ✅ **Zero server maintenance**
- ✅ **Integration with your existing Supabase database**

---

## 📋 **Prerequisites**

- [x] Vercel account (free tier works perfectly)
- [x] GitHub repository with your code
- [x] Telegram bot token: `7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk`
- [x] Groq API key: `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`
- [x] GitHub token for issue creation

---

## 🚀 **Step 1: Deploy to Vercel**

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: siso-telegram-assistant
# - Directory: ./
# - Override settings? No
```

### Option B: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected)
5. Deploy!

---

## ⚙️ **Step 2: Environment Variables**

Add these environment variables in Vercel Dashboard:

```bash
# Go to: Project Settings → Environment Variables

TELEGRAM_TOKEN=7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk
GROQ_API_KEY=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
GITHUB_TOKEN=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
GITHUB_REPO=samsiso/siso-agency-onboarding-app-main
NODE_ENV=production
```

**Important:** Set all variables for **Production**, **Preview**, and **Development** environments.

---

## 🔗 **Step 3: Configure Telegram Webhook**

Once deployed, you'll get a Vercel URL like: `https://your-app.vercel.app`

### Set the webhook:
```bash
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/webhook/telegram",
    "allowed_updates": ["message"]
  }'
```

### Verify webhook:
```bash
curl "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo"
```

---

## 🧪 **Step 4: Test Your Deployment**

### 1. Health Check
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Telegram webhook server is running on Vercel",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "environment": "production"
}
```

### 2. Send Test Message
Send a message to your Telegram bot:
- Text: "Fix the login button styling"
- Voice: Record a voice note with feedback

### 3. Check Logs
```bash
# View real-time logs
vercel logs your-app.vercel.app --follow

# Or check in Vercel Dashboard → Functions tab
```

---

## 📊 **Step 5: Monitor Your Assistant**

### Vercel Dashboard Monitoring
- **Functions**: View execution logs and performance
- **Analytics**: Track usage and response times  
- **Deployments**: Monitor deployment history
- **Domains**: Manage custom domains (optional)

### Expected Behavior
1. **Voice Messages**: Transcribed with Groq Whisper
2. **Text Messages**: Processed directly
3. **AI Analysis**: Categorized with Groq LLM
4. **GitHub Issues**: Created for bugs/features
5. **Todo Items**: Logged for general tasks
6. **Claude Code**: Queued for development tasks

---

## 🔧 **Step 6: Advanced Configuration**

### Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME: your-domain.com → cname.vercel-dns.com
```

### Supabase Integration
```typescript
// Add to your API routes for logging
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Log messages to Supabase
await supabase.from('telegram_messages').insert({
  chat_id: chatId,
  message_text: messageText,
  feedback: parsedFeedback,
  action_result: actionResult,
  created_at: new Date().toISOString()
})
```

---

## 🚨 **Troubleshooting**

### Common Issues

**1. Webhook Not Receiving Messages**
```bash
# Check webhook status
curl "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/getWebhookInfo"

# Reset webhook
curl -X POST "https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/deleteWebhook"
```

**2. Environment Variables Not Working**
- Redeploy after adding environment variables
- Check all environments (Production, Preview, Development)
- Verify variable names match exactly

**3. Function Timeouts**
- Vercel free tier: 10-second timeout
- Optimize AI API calls
- Consider upgrading to Pro for 60-second timeout

**4. Voice Transcription Fails**
- Check Groq API key validity
- Verify file size limits (Telegram: 20MB, Groq: 25MB)
- Monitor Groq API usage limits

---

## 💰 **Cost Analysis**

### Vercel Free Tier Limits
- ✅ **Function Executions**: 100GB-hours/month
- ✅ **Bandwidth**: 100GB/month  
- ✅ **Function Duration**: 10 seconds max
- ✅ **Deployments**: Unlimited

### Estimated Usage
- **Per Message**: ~2-5 seconds execution time
- **Monthly Capacity**: ~20,000-50,000 messages
- **Cost**: **$0/month** (free tier)

### Groq API Costs
- **Whisper**: $0.111 per hour of audio
- **LLM**: $0.59 per 1M tokens
- **Estimated**: <$5/month for moderate usage

---

## 🔄 **Continuous Deployment**

### Automatic Deployments
- Push to `main` branch → Auto-deploy to production
- Push to `dev` branch → Auto-deploy to preview
- Pull requests → Auto-deploy to preview URLs

### Deployment Commands
```bash
# Deploy to production
git push origin main

# Deploy to preview
vercel --prod=false

# Deploy specific branch
vercel --prod --branch=main
```

---

## 🎉 **Success Indicators**

Your 24/7 Telegram assistant is working when:

- ✅ Health check returns 200 OK
- ✅ Webhook info shows your Vercel URL
- ✅ Messages trigger immediate responses
- ✅ Voice notes are transcribed
- ✅ GitHub issues are created
- ✅ Vercel logs show successful executions
- ✅ No function timeouts or errors

---

## 📞 **Support & Maintenance**

### Monitoring Commands
```bash
# Check deployment status
vercel ls

# View function logs
vercel logs --follow

# Check domain status
vercel domains ls
```

### Update Deployment
```bash
# Update environment variables
vercel env add VARIABLE_NAME

# Redeploy latest
vercel --prod

# Rollback deployment
vercel rollback [deployment-url]
```

---

## 🎯 **Next Steps**

1. **Test thoroughly** with various message types
2. **Monitor logs** for the first 24 hours
3. **Set up alerts** for function failures
4. **Consider upgrading** to Vercel Pro if needed
5. **Add Supabase logging** for better tracking
6. **Create dashboard** for message analytics

---

**🎊 Congratulations!** Your Telegram voice assistant is now running 24/7 on Vercel's global infrastructure!

**Webhook URL**: `https://your-app.vercel.app/api/webhook/telegram`  
**Health Check**: `https://your-app.vercel.app/api/health`  
**Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard) 