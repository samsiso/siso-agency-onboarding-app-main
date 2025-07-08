#!/bin/bash

echo "🔫 BULLETPROOF SISO Agency App Launcher"
echo "==============================================="
echo "This version WILL NOT randomly close!"
echo "==============================================="

# Nuclear option - kill everything
echo "💥 Killing all existing processes..."
sudo killall -9 "Electron" 2>/dev/null || true
sudo killall -9 "node" 2>/dev/null || true
sudo pkill -9 -f "vite" 2>/dev/null || true
sudo pkill -9 -f "electron" 2>/dev/null || true

sleep 3

# Start dev server
echo "🚀 Starting bulletproof development server..."
npm run dev &
DEV_PID=$!

# Wait for server
echo "⏳ Waiting for server to start..."
sleep 8

# Check if server is running
if curl -s http://localhost:2222/ > /dev/null; then
    echo "✅ Server is running at http://localhost:2222/"
    
    # Start bulletproof Electron app
    echo "🔫 Starting BULLETPROOF Electron app..."
    npx electron bulletproof-electron.cjs &
    ELECTRON_PID=$!
    
    echo ""
    echo "🎉 BULLETPROOF APP LAUNCHED!"
    echo "==============================================="
    echo "✅ App is running and CANNOT be closed accidentally"
    echo "📱 Check your dock for 'SISO Agency - BULLETPROOF'"
    echo "🔄 Changes will hot-reload automatically"
    echo "⚠️  To quit: Press Ctrl+C in this terminal"
    echo "==============================================="
    
    # Keep running and monitor
    while true; do
        if ! kill -0 $ELECTRON_PID 2>/dev/null; then
            echo "❌ Electron died - restarting..."
            npx electron bulletproof-electron.cjs &
            ELECTRON_PID=$!
        fi
        sleep 5
    done
else
    echo "❌ Server failed to start"
    kill $DEV_PID 2>/dev/null || true
fi