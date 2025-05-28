#!/bin/bash

# Project path
PROJECT_PATH="/Users/temp/Downloads/siso-agency-onboarding-app-main-main"

echo "🚀 Starting Ubahcrypt Smart Auto Prompter at $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "📍 Project: Ubahcrypt | Smart File Detection: Enabled"
echo "🔧 Using Node.js $(node --version)"
echo "📂 Project Path: $PROJECT_PATH"
echo ""

# Ask user how many prompts to run
echo "🎯 How many prompts would you like to run?"
echo "   Enter a number (1-10 recommended for testing):"
read -p "Number of prompts: " prompt_limit

# Validate input
if [[ "$prompt_limit" =~ ^[0-9]+$ ]] && [ "$prompt_limit" -gt 0 ]; then
    max_prompts=$prompt_limit
    echo "✅ Running $max_prompts prompt(s)"
else
    echo "❌ Invalid input. Please enter a positive number"
    exit 1
fi

echo "---"

# Initialize prompt counter
prompt_index=0

# Process prompts until limit reached or no pending prompts remain
while [ $prompt_index -lt $max_prompts ]; do
    prompt_index=$((prompt_index + 1))
    echo "🔄 Processing prompt $prompt_index/$max_prompts..."
    
    # Check if Cursor is running
    if ! pgrep -i cursor > /dev/null; then
        echo "❌ Cursor is not running. Please open Cursor and try again."
        exit 1
    fi

    # Get the next pending prompt using the Node.js client
    echo "📥 Fetching next prompt from Supabase..."
    PROMPT_JSON=$(node supabase-client.js get)

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

    # Extract file paths from prompt using regex
    FILES_TO_OPEN=$(echo "$PROMPT_TEXT" | grep -o -E '(src/[a-zA-Z0-9/_-]+\.(tsx?|jsx?|vue|css|scss|html)|[a-zA-Z0-9/_-]+\.(tsx?|jsx?|vue|css|scss|html))' | sort -u)

    # Open files in Cursor if any were found
    if [ -n "$FILES_TO_OPEN" ]; then
        cd "$PROJECT_PATH"
        echo "📂 Opening detected files in Cursor:"
        
        while IFS= read -r file_path; do
            # Check if file exists
            if [ -f "$file_path" ]; then
                echo "  ✅ Opening: $file_path"
                # Use CMD+P to open file using Cursor's quick open
                osascript -e "
                tell application \"Cursor\"
                    activate
                    delay 0.5
                    tell application \"System Events\"
                        key code 35 using command down  -- CMD+P
                        delay 0.5
                        keystroke \"$file_path\"
                        delay 0.3
                        key code 36  -- Enter
                        delay 0.5
                    end tell
                end tell
                "
            else
                echo "  ⚠️  File not found: $file_path"
            fi
        done <<< "$FILES_TO_OPEN"
        
        echo "⏱️  Waiting 2 seconds for files to load..."
        sleep 2
    else
        echo "📄 No file paths detected in prompt"
    fi

    # Send prompt to Cursor using AppleScript
    echo "📤 Sending prompt to Cursor Composer..."
    
    APPLESCRIPT_RESULT=$(osascript -e "
    tell application \"Cursor\"
        activate
        delay 1
        tell application \"System Events\"
            key code 34 using command down  -- CMD+I to open Composer
            delay 1.5
            keystroke \"$PROMPT_TEXT\"
            delay 0.5
            key code 36  -- Enter to send
        end tell
    end tell
    return \"Success\"
    " 2>&1)

    # Check AppleScript result (continue even if empty)
    if [ -n "$APPLESCRIPT_RESULT" ]; then
        echo "📨 Prompt sent: $APPLESCRIPT_RESULT"
    else
        echo "📨 Prompt sent (no explicit confirmation)"
    fi

    # Mark prompt as done in Supabase
    echo "✅ Marking prompt as completed in database..."
    node supabase-client.js mark-done "$PROMPT_ID"
    
    if [ $? -eq 0 ]; then
        echo "✅ Prompt ID $PROMPT_ID marked as done"
    else
        echo "❌ Failed to mark prompt as done"
        break
    fi

    # Show progress
    if [ $prompt_index -lt $max_prompts ]; then
        echo "⏰ Waiting 10 seconds before next prompt..."
        echo "---"
        sleep 10
    fi
done

echo "🎉 Auto Prompter completed! Processed $prompt_index prompt(s) at $(date '+%Y-%m-%d %H:%M:%S %Z')" 