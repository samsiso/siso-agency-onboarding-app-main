#!/bin/bash

# 🚀 Start SISO Agency Automation System
# =====================================

WORKSPACE_DIR="/Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🚀 Starting SISO Agency Automation System"
echo "========================================="

cd "$WORKSPACE_DIR"

# Check Claude Code authentication
echo -e "${BLUE}🔐 Checking Claude Code authentication...${NC}"
if ! claude -p "/status" --output-format text >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Claude Code not authenticated. Please run:${NC}"
    echo "claude login"
    echo ""
    echo "After authentication, run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Claude Code authenticated${NC}"
echo ""

# Show current status
echo -e "${BLUE}📊 Current Status:${NC}"
./scripts/automation-status.sh
echo ""

# Option to start the automation runner
echo -e "${YELLOW}🤖 Ready to start 24/7 automation runner?${NC}"
echo "This will:"
echo "  • Monitor the task queue continuously"
echo "  • Process tasks with Claude Code"
echo "  • Auto-queue daily maintenance tasks"
echo "  • Log all activities"
echo ""
echo "Options:"
echo "  1) Start automation runner (foreground)"
echo "  2) Start automation runner (background)"
echo "  3) Just queue the comprehensive analysis task and exit"
echo "  4) Exit"
echo ""

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Starting automation runner in foreground...${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        ./scripts/run-claude-automation.sh
        ;;
    2)
        echo -e "${GREEN}🚀 Starting automation runner in background...${NC}"
        nohup ./scripts/run-claude-automation.sh > logs/automation/runner.log 2>&1 &
        runner_pid=$!
        echo "Automation runner started with PID: $runner_pid"
        echo "Monitor with: tail -f logs/automation/automation.log"
        echo "Stop with: kill $runner_pid"
        ;;
    3)
        echo -e "${GREEN}📝 Queuing comprehensive analysis task...${NC}"
        if [ -f "automation-tasks/queue/comprehensive_app_analysis.txt" ]; then
            echo "Task already queued!"
        else
            cp "automation-tasks/app-ecosystem-analysis-prompt.txt" "automation-tasks/queue/comprehensive_app_analysis.txt" 2>/dev/null || echo "Analysis prompt not found"
        fi
        echo "Task queued. Start runner later with: ./scripts/run-claude-automation.sh"
        ;;
    4)
        echo "Goodbye!"
        ;;
    *)
        echo "Invalid option"
        ;;
esac