#!/bin/bash

echo "🚀 Starting SISO Agency App (Stable Version)..."

# Kill everything first
killall -9 "Electron" 2>/dev/null || true
killall -9 "node" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "electron" 2>/dev/null || true

sleep 2

# Start dev server only
echo "📦 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server
sleep 5

# Check if server is running
if curl -s http://localhost:2222/ > /dev/null; then
    echo "✅ Server ready at http://localhost:2222/"
    
    # Start simple Electron app
    echo "🖥️  Starting app..."
    npx electron simple-electron.cjs &
    ELECTRON_PID=$!
    
    echo "✅ App launched successfully!"
    echo "📱 App is running - check your dock for SISO Agency"
    echo "🔄 Changes will hot-reload automatically"
    echo "⚠️  DO NOT close this terminal window"
    
    # Keep running
    wait $ELECTRON_PID
else
    echo "❌ Server failed to start"
    kill $DEV_PID 2>/dev/null || true
fi

# Cleanup
kill $DEV_PID 2>/dev/null || true