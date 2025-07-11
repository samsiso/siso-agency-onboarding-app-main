#!/bin/bash

echo "🐛 DEBUG MODE: SISO Agency App"
echo "This will show all errors and help debug the clicking issue"
echo "============================================="

# Kill only the current electron process to restart it
echo "🔄 Restarting Electron (keeping dev server running)..."
pkill -f "simple-electron" 2>/dev/null || true

sleep 2

# Start with full debug output
echo "🚀 Starting Electron with debug output..."
DEBUG=* npx electron simple-electron.cjs 2>&1 | while read line; do
    echo "[$(date '+%H:%M:%S')] $line"
done