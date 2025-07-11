#!/bin/bash

echo "🚀 SISO Agency - Production Build & Launch"
echo "=========================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "electron" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

sleep 2

# Build the production version
echo "🏗️  Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "🚀 Starting production app..."
    
    # Start production Electron app
    npx electron electron-prod.cjs &
    ELECTRON_PID=$!
    
    echo ""
    echo "🎉 SISO Agency Production App Started!"
    echo "======================================"
    echo "✅ Production mode active"
    echo "🔒 Security features enabled"
    echo "🚀 Performance optimized"
    echo "🛡️  Security settings: Production-ready"
    echo "📱 Look for 'SISO Agency' in your dock"
    echo ""
    echo "⚠️  To stop: Press Ctrl+C or Cmd+Q"
    echo "======================================"
    
    # Wait for process
    wait $ELECTRON_PID
else
    echo "❌ Build failed - cannot start production app"
    exit 1
fi