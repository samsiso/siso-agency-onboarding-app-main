#!/bin/bash

# 🤖 Complete Autonomous Claude Setup Script
# ==========================================
# Run this once to set everything up

set -e

echo "🤖 Setting Up Autonomous Claude Code System"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "scripts/run-claude-automation.sh" ]; then
    echo "❌ Error: Please run this from the project root directory"
    echo "Run: cd /Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"
    exit 1
fi

# Step 1: Check Claude Code installation
echo "📋 Step 1: Checking Claude Code installation..."
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not installed. Installing now..."
    npm install -g @anthropic-ai/claude-code
else
    echo "✅ Claude Code installed"
fi

# Step 2: Check authentication
echo "📋 Step 2: Checking Claude Code authentication..."
if claude -p "/status" --output-format text >/dev/null 2>&1; then
    echo "✅ Claude Code authenticated"
else
    echo "🔐 Authentication needed. Opening login..."
    claude login
    echo "✅ Please complete authentication in the browser, then press Enter to continue..."
    read -p "Press Enter after authentication is complete..."
fi

# Step 3: Verify authentication worked
echo "📋 Step 3: Verifying authentication..."
if claude -p "Hello, test message" --output-format text >/dev/null 2>&1; then
    echo "✅ Authentication verified"
else
    echo "❌ Authentication failed. Please run 'claude login' manually"
    exit 1
fi

# Step 4: Create directories
echo "📋 Step 4: Setting up directories..."
mkdir -p logs/automation
mkdir -p automation-tasks/queue
mkdir -p automation-tasks/completed
mkdir -p automation-tasks/failed
echo "✅ Directories created"

# Step 5: Make scripts executable
echo "📋 Step 5: Making scripts executable..."
chmod +x scripts/*.sh
echo "✅ Scripts are executable"

# Step 6: Show current status
echo "📋 Step 6: Current system status..."
./scripts/automation-status.sh

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "🚀 To start autonomous operation, choose one:"
echo ""
echo "   Background (recommended for 24/7):"
echo "   nohup ./scripts/run-claude-automation.sh > logs/automation/runner.log 2>&1 &"
echo ""
echo "   Foreground (to see what's happening):"
echo "   ./scripts/run-claude-automation.sh"
echo ""
echo "📊 Monitor with:"
echo "   ./scripts/automation-status.sh"
echo "   tail -f logs/automation/automation.log"
echo ""

# Ask user what they want to do
echo "🤖 Start autonomous operation now? (y/n)"
read -p "Choice: " start_now

if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    echo "🚀 Starting autonomous operation in background..."
    nohup ./scripts/run-claude-automation.sh > logs/automation/runner.log 2>&1 &
    runner_pid=$!
    echo "✅ Autonomous system started with PID: $runner_pid"
    echo "📊 Monitor with: ./scripts/automation-status.sh"
    echo "🛑 Stop with: kill $runner_pid"
    
    # Show initial status
    sleep 2
    echo ""
    echo "📊 Initial Status:"
    ./scripts/automation-status.sh
else
    echo "👍 Setup complete. Start when ready with the commands above."
fi