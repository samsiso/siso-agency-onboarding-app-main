#!/bin/bash

# 📝 Queue Task Script
# ===================
# Usage: ./scripts/queue-task.sh "task_name" "task_prompt"
# or: ./scripts/queue-task.sh "task_name" < prompt_file.txt

WORKSPACE_DIR="/Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"
TASK_QUEUE_DIR="$WORKSPACE_DIR/automation-tasks/queue"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ $# -lt 1 ]; then
    echo "Usage: $0 <task_name> [task_prompt]"
    echo "   or: $0 <task_name> < prompt_file.txt"
    exit 1
fi

task_name=$1
task_prompt=$2

# If no prompt provided, read from stdin
if [ -z "$task_prompt" ]; then
    task_prompt=$(cat)
fi

# Create task file
task_file="$TASK_QUEUE_DIR/${task_name}.txt"

echo "$task_prompt" > "$task_file"

echo -e "${GREEN}✅ Task queued:${NC} $task_name"
echo -e "${YELLOW}📁 Location:${NC} $task_file"
echo -e "${YELLOW}📊 Queue size:${NC} $(ls -1 "$TASK_QUEUE_DIR"/*.txt 2>/dev/null | wc -l) tasks"