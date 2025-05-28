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
    echo "$(date '+%Y-%m-%d %H:%M:%S %Z'): $1"
}

# Check for Node.js
if ! command -v node &> /dev/null; then
    log_message "❌ Error: Node.js is required. Please run: export NVM_DIR=\"\$HOME/.nvm\" && [ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\""
    exit 1
fi

# Check for supabase-client.js
SUPABASE_CLIENT="$HOME/Scripts/supabase-client.js"
if [ ! -f "$SUPABASE_CLIENT" ]; then
    log_message "❌ Error: supabase-client.js not found at $SUPABASE_CLIENT"
    exit 1
fi

# Check if Cursor is running
if ! pgrep -x "Cursor" > /dev/null; then
    log_message "❌ Error: Cursor is not running! Please start Cursor and try again."
    echo ""
    echo "🚀 To start Cursor:"
    echo "   1. Open Cursor application"
    echo "   2. Open your project: $PROJECT_PATH"
    echo "   3. Run this script again"
    exit 1
fi

log_message "✅ Cursor is running"

# Function to extract file paths from prompt content (improved)
extract_file_paths() {
    local prompt_text="$1"
    # Look for common file patterns, prioritizing src/ paths
    echo "$prompt_text" | grep -oE '\b/?src/[^[:space:]]*\.(tsx?|jsx?|vue|css|scss|sass|less|html|md)\b' | head -1
}

# Function to find closest matching file
find_closest_file() {
    local target_file="$1"
    local filename=$(basename "$target_file" .tsx)
    
    # Look for similar files in the project
    find "$PROJECT_PATH/src" -name "*${filename}*" -type f 2>/dev/null | head -1
}

# Enhanced AppleScript with better error handling
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
        -- Check if Cursor is running
        if not (application "Cursor" is running) then
            logMessage("Error: Cursor is not running")
            return "Error: Cursor is not running"
        end if
        
        -- Read prompt text from file
        set promptText to read POSIX file promptFile as «class utf8»
        
        tell application "Cursor"
            activate
        end tell
        
        delay 3
        
        -- Open the target file if provided and exists
        if targetFile is not equal to "" then
            logMessage("Attempting to open file: " & targetFile)
            tell application "System Events"
                -- Use Quick Open (Cmd+P)
                keystroke "p" using {command down}
                delay 2
                -- Type the filename without the full path
                set fileName to last item of (my splitText(targetFile, "/"))
                keystroke fileName
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
        end tell
        
        logMessage("Successfully sent prompt to Composer")
        return "Success"
    on error errMsg number errNum
        logMessage("AppleScript Error: " & errMsg & " (Number: " & errNum & ")")
        return "Error: " & errMsg
    end try
    
    -- Helper function to split text
    on splitText(theText, theDelimiter)
        set AppleScript's text item delimiters to theDelimiter
        set theTextItems to every text item of theText
        set AppleScript's text item delimiters to ""
        return theTextItems
    end splitText
end run
EOF
)

echo "🚀 Starting Ubahcrypt Smart Auto Prompter (FIXED VERSION)"
log_message "🚀 Starting Ubahcrypt Smart Auto Prompter (FIXED VERSION)"
echo "📍 Project: Ubahcrypt | Smart File Detection: Enabled"
echo "🔧 Using Node.js $(node --version)"
echo "📂 Project Path: $PROJECT_PATH"
echo "---"

# Initialize prompt counter
prompt_index=0

# Process prompts until no pending prompts remain
while true; do
    # Get the next pending prompt from Supabase
    log_message "Fetching next prompt from Supabase..."
    prompt_data=$(cd "$HOME/Scripts" && node supabase-client.js get)
    
    if [ "$prompt_data" = "{}" ]; then
        log_message "✅ No more pending prompts"
        echo "✅ No more pending prompts"
        break
    fi
    
    # Parse prompt data
    prompt_id=$(echo "$prompt_data" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    prompt_text=$(echo "$prompt_data" | sed 's/.*"prompt":"\([^"]*\)".*/\1/' | sed 's/\\n/\n/g' | sed 's/\\"/"/g')
    prompt_cycle_number=$(echo "$prompt_data" | grep -o '"prompt_cycle_number":[0-9]*' | cut -d':' -f2)
    
    if [ -z "$prompt_text" ]; then
        log_message "❌ Error: Failed to parse prompt from $prompt_data"
        echo "❌ Error: Failed to parse prompt"
        exit 1
    fi
    
    prompt_index=$((prompt_index + 1))
    
    log_message "🔄 Processing Prompt $prompt_index (ID $prompt_id, Cycle Number $prompt_cycle_number)"
    echo "🔄 Processing Prompt $prompt_index (ID $prompt_id, Cycle Number $prompt_cycle_number)"
    
    # Smart file detection
    detected_file=$(extract_file_paths "$prompt_text")
    target_file=""
    
    if [ -n "$detected_file" ]; then
        echo "📁 Auto-detected target file: $detected_file"
        
        # Convert to absolute path and check if file exists
        if [[ "$detected_file" == /* ]]; then
            full_path="$PROJECT_PATH$detected_file"
        else
            full_path="$PROJECT_PATH/$detected_file"
        fi
        
        if [ -f "$full_path" ]; then
            target_file=$(basename "$detected_file")
            echo "✅ File found, will open: $full_path"
            log_message "Auto-detected and will open file: $full_path"
        else
            echo "⚠️  File not found at $full_path"
            log_message "File not found: $full_path"
            
            # Try to find a similar file
            closest_file=$(find_closest_file "$detected_file")
            if [ -n "$closest_file" ]; then
                target_file=$(basename "$closest_file")
                echo "🔍 Found similar file: $closest_file"
                log_message "Using similar file: $closest_file"
            else
                echo "📝 No similar file found, proceeding with prompt only"
                log_message "No similar file found"
            fi
        fi
    else
        echo "📝 No target file detected, proceeding with prompt only"
        log_message "No target file detected"
    fi
    
    echo "📝 Prompt preview: ${prompt_text:0:150}..."
    log_message "Processing prompt $prompt_index (ID $prompt_id) with file: $target_file"
    
    # Write prompt to temporary file for AppleScript to read
    temp_prompt_file="/tmp/cursor_prompt_$prompt_id.txt"
    echo "$prompt_text" > "$temp_prompt_file"
    
    echo "⚡ Sending to Cursor..."
    log_message "Sending prompt to Cursor via AppleScript"
    
    # Run AppleScript to open file and send prompt to Composer
    result=$(echo "$OPEN_FILE_AND_SEND_PROMPT_SCRIPT" | osascript - "$temp_prompt_file" "$target_file")
    
    # Clean up temporary file
    rm -f "$temp_prompt_file"
    
    if [[ "$result" != "Success" ]]; then
        log_message "❌ Error processing prompt $prompt_index: $result"
        echo "❌ Error processing prompt $prompt_index: $result"
        
        # Try to continue with next prompt instead of exiting
        echo "⚠️  Continuing to next prompt..."
        continue
    fi
    
    # Mark the prompt as done in Supabase
    log_message "Marking prompt as completed in Supabase..."
    cd "$HOME/Scripts" && node supabase-client.js mark-done "$prompt_id" || {
        log_message "❌ Error marking prompt $prompt_id as done"
        echo "❌ Error marking prompt $prompt_id as done"
        exit 1
    }
    
    log_message "✅ Prompt $prompt_index completed successfully"
    echo "✅ Prompt $prompt_index completed successfully"
    
    # Show countdown for the 10-second wait
    echo "⏳ Waiting 10 seconds before next prompt..."
    for ((j=10; j>=1; j--)); do
        percent=$(( (10 - j + 1) * 10 ))
        echo "    ⌛ Wait time: $j seconds remaining ($percent% complete)"
        sleep 1
    done
    echo "---"
done

log_message "🎉 All prompts completed for Ubahcrypt project!"
echo "🎉 All prompts completed for Ubahcrypt project!" 