#!/bin/bash

echo "🚀 SISO Agency - Professional Development Setup"
echo "=============================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "electron" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

sleep 2

# Check if dev server is already running
if lsof -i :2222 > /dev/null 2>&1; then
    echo "✅ Dev server already running on port 2222"
    echo "🚀 Starting Electron in development mode..."
    
    # Start just the Electron app
    npx electron electron-dev.cjs &
    ELECTRON_PID=$!
else
    echo "🚀 Starting full development stack..."
    
    # Start both dev server and Electron
    npm run electron:dev &
    ELECTRON_PID=$!
fi

echo ""
echo "🎉 SISO Agency Development Environment Started!"
echo "=============================================="
echo "✅ Development mode active"
echo "🔧 DevTools enabled"
echo "🔄 Hot reload enabled"
echo "🛡️  Security settings: Development-friendly"
echo "📱 Look for 'SISO Agency - Development' in your dock"
echo ""
echo "🔧 Development Commands:"
echo "  • Cmd+R: Reload app"
echo "  • Cmd+Shift+R: Force reload"
echo "  • F12: Toggle DevTools"
echo "  • Cmd+Q: Quit app"
echo ""
echo "⚠️  To stop: Press Ctrl+C"
echo "=============================================="

# Wait for process
wait $ELECTRON_PID