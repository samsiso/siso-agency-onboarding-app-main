#!/bin/bash

# SISO Agency App Launcher
echo "🚀 Starting SISO Agency App..."

# Kill any existing processes
pkill -f "electron.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start the app in development mode
npm run electron:dev