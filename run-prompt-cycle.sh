#!/bin/bash

# Load NVM to ensure Node.js is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Set project path - we're now running from the main project folder
PROJECT_PATH="$(pwd)"

# Create log file
LOG_FILE="$HOME/Scripts/auto-prompt.log"
mkdir -p "$HOME/Scripts"
touch "$LOG_FILE" 2>/dev/null || {
    echo "Error: Cannot create log file at $LOG_FILE"
    exit 1
}

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S %Z'): $1" >> "$LOG_FILE"
}

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is required. Please run the setup script first:"
    echo "   ~/Scripts/setup-env.sh"
    exit 1
fi

# Check for supabase-client.js
SUPABASE_CLIENT="$HOME/Scripts/supabase-client.js"
if [ ! -f "$SUPABASE_CLIENT" ]; then
    echo "❌ Error: supabase-client.js not found at $SUPABASE_CLIENT"
    exit 1
fi

# Check if API key is configured
if grep -q "YOUR_SUPABASE_ANON_KEY" "$SUPABASE_CLIENT"; then
    echo "❌ Error: Supabase API key not configured!"
    echo "   Please update $SUPABASE_CLIENT with your actual API key"
    echo "   Get it from: https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr/settings/api"
    exit 1
fi

# Check if Cursor is running
if ! pgrep -i cursor > /dev/null; then
    echo "❌ Error: Cursor is not running! Please start Cursor and try again."
    echo ""
    echo "🚀 To start Cursor:"
    echo "   1. Open Cursor application"
    echo "   2. Open your project: $PROJECT_PATH"
    echo "   3. Run this script again"
    exit 1
fi

echo "✅ Cursor is running"

echo "🚀 Starting Ubahcrypt Smart Auto Prompter at $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "📍 Project: Ubahcrypt | File Detection: Disabled for cleaner output"
echo "🔧 Using Node.js $(node --version)"
echo "📂 Project Path: $PROJECT_PATH"
echo ""

# Ask user how many prompts to run
echo "🎯 How many prompts would you like to run?"
echo "   Enter a number (1-50 recommended, or 0 for unlimited):"
read -p "Number of prompts: " prompt_limit

# Validate input and set mode
if [[ "$prompt_limit" =~ ^[0-9]+$ ]]; then
    if [ "$prompt_limit" -eq 0 ]; then
        echo "✅ Running unlimited prompts (will process all pending)"
        unlimited_mode=true
        max_prompts=999999  # Large number for unlimited
    elif [ "$prompt_limit" -gt 0 ]; then
        max_prompts=$prompt_limit
        unlimited_mode=false
        echo "✅ Running $max_prompts prompt(s)"
    else
        echo "❌ Invalid input. Please enter a positive number or 0"
        exit 1
    fi
else
    echo "❌ Invalid input. Please enter a number"
    exit 1
fi

echo "---"

# Initialize prompt counter
prompt_index=0

# Process prompts until limit reached or no pending prompts remain
while [ $prompt_index -lt $max_prompts ]; do
    prompt_index=$((prompt_index + 1))
    
    if [ "$unlimited_mode" = true ]; then
        echo "🔄 Processing prompt $prompt_index (unlimited mode)..."
    else
        echo "🔄 Processing prompt $prompt_index/$max_prompts..."
    fi
    
    # Check if Cursor is running
    if ! pgrep -i cursor > /dev/null; then
        echo "❌ Cursor is not running. Please open Cursor and try again."
        exit 1
    fi

    # Get the next pending prompt using the Node.js client
    echo "📥 Fetching next prompt from Supabase..."
    PROMPT_JSON=$(node "$HOME/Scripts/supabase-client.js" get)

    # Check if a prompt was found
    if [ "$PROMPT_JSON" = "{}" ] || [ -z "$PROMPT_JSON" ]; then
        echo "✅ No more pending prompts found! All caught up."
        break
    fi

    # Parse prompt data
    PROMPT_ID=$(echo "$PROMPT_JSON" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).id)")
    PROMPT_TEXT=$(echo "$PROMPT_JSON" | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).prompt)")
    
    if [ -z "$PROMPT_ID" ] || [ -z "$PROMPT_TEXT" ]; then
        echo "❌ Error: Invalid prompt data received"
        break
    fi

    echo "📋 Processing Prompt ID: $PROMPT_ID"
    echo "📝 Prompt preview: ${PROMPT_TEXT:0:150}..."

    # Create temporary file for the prompt text to avoid AppleScript syntax issues
    TEMP_PROMPT_FILE="/tmp/prompt_$PROMPT_ID.txt"
    echo "$PROMPT_TEXT" > "$TEMP_PROMPT_FILE"

    # Send prompt to Cursor using AppleScript with temp file approach
    echo "📤 Sending prompt to Cursor Composer..."
    
    APPLESCRIPT_RESULT=$(osascript << EOF
try
    -- Read prompt from temp file to avoid syntax issues
    set promptText to read POSIX file "$TEMP_PROMPT_FILE" as «class utf8»
    
    tell application "Cursor" to activate
    delay 2
    
    -- Open Composer with CMD+I
    tell application "System Events"
        keystroke "i" using {command down}
        delay 3
    end tell
    
    -- Use clipboard to paste the prompt
    set the clipboard to promptText
    delay 1
    
    tell application "System Events"
        -- Clear any existing content and paste
        keystroke "a" using {command down}
        delay 0.5
        keystroke "v" using {command down}
        delay 1
        -- Send the prompt
        key code 36  -- Enter
    end tell
    
    return "Success"
on error errMsg number errNum
    return "Error: " & errMsg & " (Number: " & errNum & ")"
end try
EOF
    )
    
    # Clean up temp file
    rm -f "$TEMP_PROMPT_FILE"
    
    # Check AppleScript result
    if [[ "$APPLESCRIPT_RESULT" == *"Success"* ]]; then
        echo "✅ Prompt sent successfully to Composer"
    elif [ -n "$APPLESCRIPT_RESULT" ]; then
        echo "⚠️  AppleScript result: $APPLESCRIPT_RESULT"
        echo "📤 Continuing anyway - prompt may have been sent..."
    else
        echo "✅ Prompt sent (no explicit confirmation)"
    fi

    # Mark prompt as done in Supabase
    echo "💾 Marking prompt as completed in database..."
    node "$HOME/Scripts/supabase-client.js" mark-done "$PROMPT_ID"
    
    if [ $? -eq 0 ]; then
        echo "✅ Prompt ID $PROMPT_ID marked as done"
    else
        echo "❌ Failed to mark prompt as done"
        break
    fi

    # Show progress and wait (except for last prompt)
    if [ $prompt_index -lt $max_prompts ]; then
        # Check if there are more prompts before waiting
        NEXT_PROMPT_CHECK=$(node "$HOME/Scripts/supabase-client.js" get)
        if [ "$NEXT_PROMPT_CHECK" = "{}" ] || [ -z "$NEXT_PROMPT_CHECK" ]; then
            echo "✅ No more pending prompts found! Finishing early."
            break
        fi
        
        echo "⏰ Waiting 10 seconds before next prompt..."
        echo "---"
        sleep 10
    fi
done

echo "🎉 Auto Prompter completed! Processed $prompt_index prompt(s) at $(date '+%Y-%m-%d %H:%M:%S %Z')"
log_message "Completed! Processed $prompt_index prompts for Ubahcrypt project" 