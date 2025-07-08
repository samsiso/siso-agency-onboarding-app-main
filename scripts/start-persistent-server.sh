#!/bin/bash

# SISO Agency Persistent Server Script
# Keeps dev server running in background for instant app launches

PROJECT_DIR="/Users/shaansisodia/Desktop/Cursor/siso-agency-onboarding-app-main-dev"
PID_FILE="$PROJECT_DIR/.server.pid"
LOG_FILE="$PROJECT_DIR/.server.log"

start_server() {
    echo "Starting SISO Agency persistent server..."
    cd "$PROJECT_DIR"
    
    # Kill any existing server
    if [ -f "$PID_FILE" ]; then
        kill $(cat "$PID_FILE") 2>/dev/null || true
        rm -f "$PID_FILE"
    fi
    
    # Start server in background
    npm run dev > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > "$PID_FILE"
    
    echo "Server started with PID: $SERVER_PID"
    echo "Logs: $LOG_FILE"
    
    # Wait for server to be ready
    echo "Waiting for server to be ready..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:2222 > /dev/null 2>&1; then
            echo "✅ Server is ready at http://localhost:2222"
            break
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    
    if [ $timeout -eq 0 ]; then
        echo "❌ Server startup timeout"
        exit 1
    fi
}

stop_server() {
    echo "Stopping SISO Agency persistent server..."
    if [ -f "$PID_FILE" ]; then
        kill $(cat "$PID_FILE") 2>/dev/null || true
        rm -f "$PID_FILE"
        echo "✅ Server stopped"
    else
        echo "No server running"
    fi
}

restart_server() {
    stop_server
    start_server
}

status_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "✅ Server is running (PID: $PID)"
            if curl -s http://localhost:2222 > /dev/null 2>&1; then
                echo "✅ Server is responsive at http://localhost:2222"
            else
                echo "❌ Server is not responsive"
            fi
        else
            echo "❌ Server process not found"
            rm -f "$PID_FILE"
        fi
    else
        echo "❌ Server is not running"
    fi
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        status_server
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac