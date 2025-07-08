#!/bin/bash

echo "🚀 Setting up Standalone Telegram Webhook Server"
echo "================================================"

# Create webhook directory
mkdir -p telegram-webhook
cd telegram-webhook

# Copy files
cp ../standalone-webhook-server.js ./server.js
cp ../webhook-package.json ./package.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the server: npm start"
echo "2. Use ngrok to expose it: ngrok http 3000"
echo "3. Set webhook: curl -X POST \"https://api.telegram.org/bot7569885071:AAH3l0ZcKdOTjh8oJ_flYTs0YFKyL_hN0fk/setWebhook\" -H \"Content-Type: application/json\" -d '{\"url\": \"https://YOUR_NGROK_URL.ngrok.io/webhook/telegram\"}'"
echo ""
echo "🏥 Health check: http://localhost:3000/health"
echo "📡 Webhook endpoint: http://localhost:3000/webhook/telegram" 