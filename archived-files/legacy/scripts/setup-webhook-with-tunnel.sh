#!/bin/bash

# Your n8n tunnel URL
N8N_URL="https://gcqxrs0b3asei9igsoxhijag.hooks.n8n.cloud"
BOT_TOKEN="7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk"
CHAT_ID="7643203581"

echo "🚀 Setting up Telegram webhook with n8n tunnel..."
echo "📡 n8n URL: $N8N_URL"

# Set the webhook
echo "📌 Setting webhook..."
WEBHOOK_URL="${N8N_URL}/webhook/telegram-assistant-webhook"

curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}"

echo -e "\n\n📊 Checking webhook status..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | jq .

echo -e "\n\n✅ Webhook set to: $WEBHOOK_URL"
echo "🌐 Access n8n editor at: $N8N_URL"

echo -e "\n📝 Next steps:"
echo "1. Open the n8n editor: $N8N_URL"
echo "2. Import the workflow: n8n-telegram-assistant-with-confirmations.json"
echo "3. Add Telegram credentials with your bot token"
echo "4. Add Groq credentials with your API key"
echo "5. Test by sending a message to your bot!"

# Send test message
echo -e "\n🧪 Sending test message..."
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": ${CHAT_ID},
    \"text\": \"🔧 **Setup Complete!**\n\n✅ Webhook configured\n🌐 n8n tunnel active\n📡 Webhook URL: ${WEBHOOK_URL}\n\n**Ready to receive your voice notes and messages!**\n\nTry sending me a message or voice note now.\",
    \"parse_mode\": \"Markdown\"
  }"