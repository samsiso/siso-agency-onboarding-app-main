#!/bin/bash

echo "🧠 SMART SISO Agency App Launcher"
echo "==============================================="

# Check what's already running
echo "🔍 Checking what's currently running..."
VITE_RUNNING=$(lsof -i :2222 2>/dev/null || echo "")
ELECTRON_RUNNING=$(pgrep -f "electron.*electron" 2>/dev/null || echo "")

if [ ! -z "$VITE_RUNNING" ]; then
    echo "✅ Dev server already running on port 2222"
else
    echo "🚀 Starting dev server..."
    npm run dev &
    DEV_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server..."
    sleep 5
    
    # Check if it started
    if ! curl -s http://localhost:2222/ > /dev/null; then
        echo "❌ Server failed to start"
        exit 1
    fi
    echo "✅ Server started successfully"
fi

if [ ! -z "$ELECTRON_RUNNING" ]; then
    echo "⚠️ Electron app already running - bringing to front..."
    # Try to bring existing app to front
    osascript -e 'tell application "System Events" to set frontmost of every process whose name contains "Electron" to true' 2>/dev/null || true
else
    echo "🖥️ Starting Electron app..."
    npx electron electron-dev.cjs &
    ELECTRON_PID=$!
    echo "✅ Electron app started"
fi

echo ""
echo "🎉 SISO Agency App is Running!"
echo "==============================================="
echo "📱 Check your dock for the app"
echo "🔄 Changes will hot-reload automatically"
echo "⚠️  To quit: Close this terminal or press Ctrl+C"
echo "==============================================="

# Wait for user to quit
if [ ! -z "$DEV_PID" ]; then
    wait $DEV_PID
fi