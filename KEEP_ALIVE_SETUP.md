# 🔄 Keep-Alive System Setup for Render

## 🎯 What This Does
The keep-alive system prevents your Render free instance from spinning down by automatically pinging itself every 14 minutes, eliminating the 50+ second delays when your bot receives messages after inactivity.

## ⚡ Quick Setup (2 Minutes)

### Step 1: Add Environment Variable in Render
1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your service: **siso-agency-onboarding-app-main**
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `RENDER_EXTERNAL_URL`
   - **Value**: `https://siso-agency-onboarding-app-main.onrender.com`

### Step 2: Deploy the Update
Your service should automatically redeploy with the new keep-alive system.

## 🔍 Verification
After deployment, check your logs for:
```
🔄 Starting keep-alive system...
📍 Keep-alive URL: https://siso-agency-onboarding-app-main.onrender.com
✅ Keep-alive system started (14-minute intervals)
```

Every 14 minutes you'll see:
```
💓 Keep-alive ping successful: 2024-12-21T16:30:00.000Z
```

## 🚀 Benefits
- ✅ **No more 50+ second delays**
- ✅ **Instant bot responses 24/7**
- ✅ **Automatic self-maintenance**
- ✅ **Smart detection (only runs on Render)**
- ✅ **Graceful shutdown handling**

## 🔧 How It Works
- Pings `/health` endpoint every 14 minutes
- Only activates when `RENDER_EXTERNAL_URL` is set
- Prevents 15-minute idle timeout
- Uses minimal resources (1 HTTP request per 14 minutes)

## 🎯 Next Steps
1. Set the environment variable ☝️
2. Wait for automatic deployment
3. Test your bot - it should respond instantly!
4. Monitor logs to confirm keep-alive is working

Your Telegram voice assistant will now stay active 24/7! 🚀 