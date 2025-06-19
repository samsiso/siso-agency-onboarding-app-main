#!/bin/bash

# Load NVM to ensure Node.js is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Set project path - adjust this to your actual project location
PROJECT_PATH="/Users/temp/Downloads/siso-agency-onboarding-app-main-main"

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

# Function to extract file paths from prompt content
extract_file_paths() {
    local prompt_text="$1"
    # Look for common file patterns
    echo "$prompt_text" | grep -oE '\b[/]?src/[^[:space:]]*\.(tsx?|jsx?|vue|css|scss|sass|less|html|md)\b' | head -1
}

# Enhanced AppleScript with file opening capability and temp file support for long prompts
OPEN_FILE_AND_SEND_PROMPT_SCRIPT=$(cat << 'EOF'
on run argv
    set promptFile to item 1 of argv
    set targetFile to item 2 of argv
    set logFile to (path to home folder as text) & "Scripts:auto-prompt.log"
    
    on logMessage(msg)
        try
            set logHandle to open for access file logFile with write permission
            write ((current date) as text) & ": " & msg & return to logHandle starting at eof
            close access logHandle
        on error
            try
                close access logFile
            end try
        end try
    end logMessage
    
    try
        if not (application "Cursor" is running) then
            logMessage("Error: Cursor is not running")
            return "Error: Cursor is not running"
        end if
        
        -- Read prompt text from file
        set promptText to read POSIX file promptFile as «class utf8»
        
        tell application "Cursor"
            activate
        end tell
        
        delay 2
        
        -- Open the target file if provided and exists
        if targetFile is not equal to "" then
            logMessage("Attempting to open file: " & targetFile)
            tell application "System Events"
                keystroke "p" using {command down}
                delay 2
                keystroke targetFile
                delay 1
                keystroke return
                delay 3
            end tell
            logMessage("File opened successfully")
        end if
        
        -- Open Composer
        logMessage("Opening Composer with CMD+I")
        tell application "System Events"
            keystroke "i" using {command down}
            delay 4
        end tell
        
        -- Use clipboard for long prompts (more reliable than direct keystroke)
        logMessage("Copying prompt to clipboard")
        set the clipboard to promptText
        delay 1
        
        -- Clear any existing content and paste the prompt
        tell application "System Events"
            keystroke "a" using {command down}
            delay 0.5
            keystroke "v" using {command down}
            delay 2
            keystroke return
            delay 1
        end tell
        
        logMessage("Successfully sent prompt to Composer")
        return "Success"
    on error errMsg number errNum
        logMessage("AppleScript Error: " & errMsg & " (Number: " & errNum & ")")
        return "Error: " & errMsg
    end try
end run
EOF
)

echo "🚀 Starting Ubahcrypt Smart Auto Prompter at $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "📍 Project: Ubahcrypt | Smart File Detection: Enabled"
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
    
    # Use direct clipboard method (like working simple script)
    APPLESCRIPT_RESULT=$(osascript << EOF
try
    tell application "Cursor" to activate
    delay 2
    tell application "System Events"
        keystroke "i" using {command down}
        delay 3
    end tell
    set the clipboard to "$PROMPT_TEXT"
    delay 1
    tell application "System Events"
        keystroke "a" using {command down}
        delay 0.5
        keystroke "v" using {command down}
        delay 1
        key code 36  -- Enter
    end tell
    return "Success"
on error errMsg number errNum
    return "Error: " & errMsg & " (Number: " & errNum & ")"
end try
EOF
    )
    
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

    # Show progress and wait (except for last prompt)
    if [ $prompt_index -lt $max_prompts ]; then
        # Check if there are more prompts before waiting
        NEXT_PROMPT_CHECK=$(node supabase-client.js get)
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