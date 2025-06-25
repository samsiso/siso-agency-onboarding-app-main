#!/bin/bash
echo "🚀 Starting SISO Assistant (Development Mode)"
echo "📱 Platforms: Telegram + WhatsApp"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the application
npm run dev || node server.js
