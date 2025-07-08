#!/bin/bash

echo "🚀 Starting SISO Agency App (Clean Start)..."

# Kill any existing processes
pkill -f "electron" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*2222" 2>/dev/null || true

# Wait a moment
sleep 2

# Start Vite dev server in background
echo "📦 Starting Vite development server..."
npm run dev &
VITE_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 8

# Check if server is running
if curl -s http://localhost:2222/ > /dev/null; then
    echo "✅ Server is running at http://localhost:2222/"
    
    # Start Electron app
    echo "🖥️  Starting Electron app..."
    npx electron electron.cjs
else
    echo "❌ Server failed to start"
    kill $VITE_PID 2>/dev/null || true
    exit 1
fi

# Cleanup on exit
trap "kill $VITE_PID 2>/dev/null || true" EXIT