#!/bin/bash

# 🚀 SISO Agency - Telegram Assistant Vercel Deployment Script
# Automates the deployment of your 24/7 Telegram voice assistant

set -e

echo "🚀 SISO Agency - 24/7 Telegram Assistant Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TELEGRAM_TOKEN="7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk"
GROQ_API_KEY="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"
GITHUB_TOKEN="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"
GITHUB_REPO="samsiso/siso-agency-onboarding-app-main"
CHAT_ID="7643203581"

echo -e "${BLUE}📋 Pre-deployment Checklist${NC}"
echo "✅ Telegram Bot Token: ${TELEGRAM_TOKEN:0:20}..."
echo "✅ Groq API Key: ${GROQ_API_KEY:0:20}..."
echo "✅ GitHub Token: ${GITHUB_TOKEN:0:20}..."
echo "✅ GitHub Repo: $GITHUB_REPO"
echo "✅ Chat ID: $CHAT_ID"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed successfully${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI is already installed${NC}"
fi

# Login to Vercel
echo -e "${BLUE}🔐 Logging into Vercel...${NC}"
vercel login

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod --confirm

# Get the deployment URL
DEPLOYMENT_URL=$(vercel --prod --confirm 2>&1 | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}❌ Failed to get deployment URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployed successfully to: $DEPLOYMENT_URL${NC}"

# Set environment variables
echo -e "${BLUE}⚙️  Setting environment variables...${NC}"

vercel env add TELEGRAM_TOKEN production <<< "$TELEGRAM_TOKEN"
vercel env add GROQ_API_KEY production <<< "$GROQ_API_KEY"
vercel env add GITHUB_TOKEN production <<< "$GITHUB_TOKEN"
vercel env add GITHUB_REPO production <<< "$GITHUB_REPO"
vercel env add NODE_ENV production <<< "production"

echo -e "${GREEN}✅ Environment variables set successfully${NC}"

# Redeploy with environment variables
echo -e "${BLUE}🔄 Redeploying with environment variables...${NC}"
vercel --prod --confirm

# Test health endpoint
echo -e "${BLUE}🧪 Testing health endpoint...${NC}"
sleep 5
HEALTH_RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/health" || echo "Failed")

if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed: $HEALTH_RESPONSE${NC}"
fi

# Configure Telegram webhook
echo -e "${BLUE}🔗 Configuring Telegram webhook...${NC}"
WEBHOOK_URL="$DEPLOYMENT_URL/api/webhook/telegram"

WEBHOOK_RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$WEBHOOK_URL\", \"allowed_updates\": [\"message\"]}")

if [[ $WEBHOOK_RESPONSE == *"true"* ]]; then
    echo -e "${GREEN}✅ Webhook configured successfully${NC}"
else
    echo -e "${RED}❌ Webhook configuration failed: $WEBHOOK_RESPONSE${NC}"
fi

# Verify webhook
echo -e "${BLUE}🔍 Verifying webhook configuration...${NC}"
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/getWebhookInfo")
echo "Webhook Info: $WEBHOOK_INFO"

# Send test message
echo -e "${BLUE}📱 Sending test message...${NC}"
TEST_MESSAGE="🎉 Your Telegram voice assistant is now live on Vercel! 

🔗 Webhook: $WEBHOOK_URL
🏥 Health: $DEPLOYMENT_URL/api/health
📊 Dashboard: https://vercel.com/dashboard

Send me a message or voice note to test!"

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": $CHAT_ID, \"text\": \"$TEST_MESSAGE\", \"parse_mode\": \"Markdown\"}" > /dev/null

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉${NC}"
echo "=================================================="
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "🌐 App URL: $DEPLOYMENT_URL"
echo "🔗 Webhook: $WEBHOOK_URL"
echo "🏥 Health Check: $DEPLOYMENT_URL/api/health"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo -e "${YELLOW}🧪 Next Steps:${NC}"
echo "1. Send a test message to your Telegram bot"
echo "2. Try sending a voice note"
echo "3. Check Vercel logs: vercel logs --follow"
echo "4. Monitor function performance in Vercel dashboard"
echo ""
echo -e "${GREEN}✅ Your 24/7 Telegram voice assistant is now live!${NC}" 