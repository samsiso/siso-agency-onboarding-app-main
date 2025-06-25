#!/bin/bash

# Setup script for Telegram Voice Assistant

echo "🚀 Setting up Telegram Voice Assistant..."

# Your credentials
BOT_TOKEN="7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk"
CHAT_ID="7643203581"

# Check current webhook status
echo "📍 Checking current webhook status..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | jq .

# For n8n setup (local)
echo -e "\n📋 For n8n (local setup):"
echo "1. Start n8n: n8n start"
echo "2. Import the workflow JSON files"
echo "3. Get your webhook URL from the Telegram Trigger node"
echo "4. Run this command with your n8n URL:"
echo ""
echo "curl -X POST \"https://api.telegram.org/bot${BOT_TOKEN}/setWebhook\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"url\": \"https://YOUR-N8N-URL/webhook/telegram-assistant-webhook\"}'"

# For Vercel setup
echo -e "\n📋 For Vercel API Route:"
echo "1. Deploy the API route to Vercel"
echo "2. Run this command with your Vercel URL:"
echo ""
echo "curl -X POST \"https://api.telegram.org/bot${BOT_TOKEN}/setWebhook\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"url\": \"https://YOUR-APP.vercel.app/api/telegram-voice-assistant\"}'"

# Test message
echo -e "\n✅ Test your bot:"
echo "curl -X POST \"https://api.telegram.org/bot${BOT_TOKEN}/sendMessage\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"chat_id\": ${CHAT_ID}, \"text\": \"🤖 Voice Assistant Ready! Send me a voice note or text message.\"}'"

echo -e "\n📱 Your Chat ID: ${CHAT_ID}"
echo "🤖 Bot Token: ${BOT_TOKEN:0:20}..."