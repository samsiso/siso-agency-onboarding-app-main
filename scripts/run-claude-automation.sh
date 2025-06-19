#!/bin/bash

# 🤖 SISO Agency - Claude Code 24/7 Automation Runner
# ================================================

set -e

# Configuration
WORKSPACE_DIR="/Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"
AUTOMATION_LOG_DIR="$WORKSPACE_DIR/logs/automation"
TASK_QUEUE_DIR="$WORKSPACE_DIR/automation-tasks/queue"
COMPLETED_DIR="$WORKSPACE_DIR/automation-tasks/completed"
FAILED_DIR="$WORKSPACE_DIR/automation-tasks/failed"

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")  echo -e "${GREEN}[INFO]${NC} $timestamp - $message" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC} $timestamp - $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $timestamp - $message" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $timestamp - $message" ;;
        "TASK")  echo -e "${PURPLE}[TASK]${NC} $timestamp - $message" ;;
        "SUCCESS") echo -e "${CYAN}[SUCCESS]${NC} $timestamp - $message" ;;
    esac
    
    # Also log to file
    echo "[$level] $timestamp - $message" >> "$AUTOMATION_LOG_DIR/automation.log"
}

# Setup directories
setup_directories() {
    log "INFO" "Setting up automation directories..."
    mkdir -p "$AUTOMATION_LOG_DIR"
    mkdir -p "$TASK_QUEUE_DIR"
    mkdir -p "$COMPLETED_DIR"
    mkdir -p "$FAILED_DIR"
}

# Check Claude Code status
check_claude_status() {
    log "INFO" "Checking Claude Code authentication status..."
    
    if ! command -v claude &> /dev/null; then
        log "ERROR" "Claude Code not installed. Run: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    
    # Check if authenticated by trying a simple status check
    if claude -p "/status" --output-format json >/dev/null 2>&1; then
        log "SUCCESS" "Claude Code is authenticated and ready"
        return 0
    else
        log "ERROR" "Claude Code not authenticated. Run: claude login"
        return 1
    fi
}

# Process a single automation task
process_task() {
    local task_file=$1
    local task_name=$(basename "$task_file" .txt)
    local start_time=$(date +%s)
    
    log "TASK" "Processing task: $task_name"
    
    # Read the task prompt
    local prompt_content=$(cat "$task_file")
    
    # Create output file
    local output_file="$COMPLETED_DIR/${task_name}_$(date +%Y%m%d_%H%M%S).md"
    
    # Execute with Claude Code
    log "INFO" "Executing Claude Code for task: $task_name"
    
    if claude -p "$prompt_content" \
        --allowedTools "ReadFile,WriteFile,SearchCode,ListDirectory,ExecuteCommand" \
        --output-format text \
        --dangerously-skip-permissions > "$output_file" 2>&1; then
        
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log "SUCCESS" "Task completed: $task_name (${duration}s)"
        
        # Move task to completed
        mv "$task_file" "$COMPLETED_DIR/"
        
        # Add completion metadata
        echo "" >> "$output_file"
        echo "---" >> "$output_file"
        echo "Task: $task_name" >> "$output_file"
        echo "Completed: $(date)" >> "$output_file"
        echo "Duration: ${duration} seconds" >> "$output_file"
        
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log "ERROR" "Task failed: $task_name (${duration}s)"
        
        # Move to failed directory
        mv "$task_file" "$FAILED_DIR/"
        mv "$output_file" "$FAILED_DIR/" 2>/dev/null || true
        
        return 1
    fi
}

# Queue a task for processing
queue_task() {
    local task_name=$1
    local prompt_content=$2
    
    local task_file="$TASK_QUEUE_DIR/${task_name}.txt"
    
    echo "$prompt_content" > "$task_file"
    log "INFO" "Queued task: $task_name"
}

# Auto-queue predefined tasks
auto_queue_tasks() {
    log "INFO" "Auto-queuing predefined tasks..."
    
    # Queue the comprehensive app analysis task
    if [ -f "$WORKSPACE_DIR/automation-tasks/app-ecosystem-analysis-prompt.txt" ]; then
        local prompt_content=$(cat "$WORKSPACE_DIR/automation-tasks/app-ecosystem-analysis-prompt.txt")
        queue_task "comprehensive_app_analysis" "$prompt_content"
    fi
    
    # Queue daily tasks (can be customized)
    local daily_tasks=(
        "daily_codebase_health_check"
        "performance_analysis" 
        "security_audit_check"
        "database_optimization_review"
    )
    
    for task in "${daily_tasks[@]}"; do
        if [ ! -f "$COMPLETED_DIR/${task}_$(date +%Y%m%d)*.md" ]; then
            queue_task "$task" "Perform $task for the SISO Agency platform. Analyze current state, identify issues, and provide actionable recommendations."
        fi
    done
}

# Main automation loop
run_automation_loop() {
    log "INFO" "Starting 24/7 automation loop..."
    
    local iteration=0
    
    while true; do
        iteration=$((iteration + 1))
        log "DEBUG" "Automation loop iteration #$iteration"
        
        # Check for tasks in queue
        local task_count=$(find "$TASK_QUEUE_DIR" -name "*.txt" | wc -l)
        
        if [ $task_count -gt 0 ]; then
            log "INFO" "Found $task_count tasks in queue"
            
            # Process each task
            for task_file in "$TASK_QUEUE_DIR"/*.txt; do
                if [ -f "$task_file" ]; then
                    process_task "$task_file"
                    
                    # Wait between tasks to respect rate limits
                    log "DEBUG" "Waiting 30 seconds between tasks..."
                    sleep 30
                fi
            done
        else
            log "DEBUG" "No tasks in queue"
        fi
        
        # Auto-queue tasks every hour
        if [ $((iteration % 60)) -eq 0 ]; then
            auto_queue_tasks
        fi
        
        # Wait 1 minute before checking again
        sleep 60
    done
}

# Handle cleanup on script exit
cleanup() {
    log "INFO" "Automation runner shutting down..."
    exit 0
}

# Set trap for graceful shutdown
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo "🤖 SISO Agency - Claude Code 24/7 Automation Runner"
    echo "=================================================="
    
    cd "$WORKSPACE_DIR"
    
    setup_directories
    
    if ! check_claude_status; then
        exit 1
    fi
    
    # Queue initial task if it exists
    auto_queue_tasks
    
    # Start the automation loop
    run_automation_loop
}

# Run the main function
main "$@"