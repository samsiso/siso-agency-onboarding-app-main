#!/bin/bash

# 📊 Automation Status Dashboard
# =============================

WORKSPACE_DIR="/Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"
TASK_QUEUE_DIR="$WORKSPACE_DIR/automation-tasks/queue"
COMPLETED_DIR="$WORKSPACE_DIR/automation-tasks/completed"
FAILED_DIR="$WORKSPACE_DIR/automation-tasks/failed"
LOG_FILE="$WORKSPACE_DIR/logs/automation/automation.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "🤖 SISO Agency Automation Status Dashboard"
echo "=========================================="

# Queue Status
queue_count=$(find "$TASK_QUEUE_DIR" -name "*.txt" 2>/dev/null | wc -l)
completed_count=$(find "$COMPLETED_DIR" -name "*.txt" -o -name "*.md" 2>/dev/null | wc -l)
failed_count=$(find "$FAILED_DIR" -name "*.txt" -o -name "*.md" 2>/dev/null | wc -l)

echo -e "${BLUE}📋 Task Queue:${NC}"
echo -e "  ${YELLOW}⏳ Pending:${NC} $queue_count tasks"
echo -e "  ${GREEN}✅ Completed:${NC} $completed_count tasks"
echo -e "  ${RED}❌ Failed:${NC} $failed_count tasks"
echo ""

# Current queue contents
if [ $queue_count -gt 0 ]; then
    echo -e "${PURPLE}📝 Queued Tasks:${NC}"
    for task_file in "$TASK_QUEUE_DIR"/*.txt; do
        if [ -f "$task_file" ]; then
            task_name=$(basename "$task_file" .txt)
            created=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$task_file" 2>/dev/null || date -r "$task_file" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "unknown")
            echo -e "  • ${CYAN}$task_name${NC} (created: $created)"
        fi
    done
    echo ""
fi

# Recent completions
if [ $completed_count -gt 0 ]; then
    echo -e "${GREEN}🎉 Recent Completions:${NC}"
    find "$COMPLETED_DIR" -name "*.md" -exec ls -lt {} + 2>/dev/null | head -5 | while read -r line; do
        filename=$(echo "$line" | awk '{print $NF}')
        date_info=$(echo "$line" | awk '{print $6, $7, $8}')
        task_name=$(basename "$filename" .md)
        echo -e "  • ${CYAN}$task_name${NC} ($date_info)"
    done
    echo ""
fi

# Claude Code Status
echo -e "${BLUE}🤖 Claude Code Status:${NC}"
if command -v claude &> /dev/null; then
    echo -e "  ${GREEN}✅ Claude Code installed${NC}"
    
    # Try to get status (this might fail if not authenticated)
    if claude -p "/status" --output-format text >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Authenticated and ready${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Authentication needed (run: claude login)${NC}"
    fi
else
    echo -e "  ${RED}❌ Claude Code not installed${NC}"
fi
echo ""

# Log tail
if [ -f "$LOG_FILE" ]; then
    echo -e "${BLUE}📋 Recent Log Entries:${NC}"
    tail -10 "$LOG_FILE" | while read -r line; do
        case "$line" in
            *"[ERROR]"*) echo -e "  ${RED}$line${NC}" ;;
            *"[SUCCESS]"*) echo -e "  ${GREEN}$line${NC}" ;;
            *"[WARN]"*) echo -e "  ${YELLOW}$line${NC}" ;;
            *"[TASK]"*) echo -e "  ${PURPLE}$line${NC}" ;;
            *) echo -e "  $line" ;;
        esac
    done
else
    echo -e "  ${YELLOW}No log file found${NC}"
fi

echo ""
echo -e "${CYAN}💡 Quick Commands:${NC}"
echo -e "  • Queue task: ${YELLOW}./scripts/queue-task.sh 'task_name' 'prompt'${NC}"
echo -e "  • Start runner: ${YELLOW}./scripts/run-claude-automation.sh${NC}"
echo -e "  • View logs: ${YELLOW}tail -f logs/automation/automation.log${NC}"