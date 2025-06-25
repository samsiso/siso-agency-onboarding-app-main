#!/bin/bash
echo "🚀 Starting SISO Assistant (Production Mode)"
echo "📱 Platforms: Telegram + WhatsApp"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the application
npm start || node server.js
