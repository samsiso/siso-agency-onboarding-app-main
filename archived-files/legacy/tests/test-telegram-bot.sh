#!/bin/bash

# Test script for Telegram bot

BOT_TOKEN="7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk"
CHAT_ID="7643203581"

echo "🤖 Testing Telegram Bot..."

# Test 1: Send a simple message
echo "📤 Sending test message..."
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": ${CHAT_ID},
    \"text\": \"✅ Bot is working! I can receive your messages.\n\nTry sending me:\n• A text message with feedback\n• A voice note describing bugs or features\n\nI'll transcribe, analyze, and route tasks automatically!\"
  }"

echo -e "\n\n📊 Checking webhook status..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | jq .

echo -e "\n\n📬 Getting recent updates (if no webhook set)..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getUpdates" | jq '.result[-1]'