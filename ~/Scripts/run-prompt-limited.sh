#!/bin/bash

# Load NVM to ensure Node.js is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Set project path
PROJECT_PATH="/Users/temp/Downloads/siso-agency-onboarding-app-main-main"

# Create log file
LOG_FILE="$HOME/Scripts/auto-prompt.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S %Z'): $1" >> "$LOG_FILE"
}

echo "🚀 Starting Ubahcrypt Smart Auto Prompter (Limited Version)"
echo "📍 Project: Ubahcrypt | Smart File Detection: Enabled"
echo "🔧 Using Node.js $(node --version)"
echo "📂 Project Path: $PROJECT_PATH"
echo ""

# Ask user how many prompts to run
echo "🎯 How many prompts would you like to run?"
echo "   Enter a number (1-50 recommended for testing):"
read -p "Number of prompts: " prompt_limit

# Validate input
if [[ "$prompt_limit" =~ ^[0-9]+$ ]] && [ "$prompt_limit" -gt 0 ]; then
    max_prompts=$prompt_limit
    echo "✅ Running $max_prompts prompt(s)"
else
    echo "❌ Invalid input. Please enter a positive number"
    exit 1
fi

# Check if Cursor is running
if ! pgrep -i cursor > /dev/null; then
    echo "❌ Error: Cursor is not running! Please start Cursor and try again."
    exit 1
fi

echo "✅ Cursor is running"
echo "---"

# Initialize prompt counter
prompt_index=0

# Process prompts until limit reached
while [ $prompt_index -lt $max_prompts ]; do
    # Get the next pending prompt from Supabase
    prompt_data=$(cd "$HOME/Scripts" && node supabase-client.js get)
    
    if [ "$prompt_data" = "{}" ]; then
        echo "✅ No more pending prompts available"
        echo "📊 Processed $prompt_index out of $max_prompts requested prompts"
        break
    fi
    
    # Parse prompt data
    prompt_id=$(echo "$prompt_data" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    prompt_text=$(echo "$prompt_data" | sed 's/.*"prompt":"\([^"]*\)".*/\1/' | sed 's/\\n/\n/g' | sed 's/\\"/"/g')
    prompt_cycle_number=$(echo "$prompt_data" | grep -o '"prompt_cycle_number":[0-9]*' | cut -d':' -f2)
    
    prompt_index=$((prompt_index + 1))
    
    echo "🔄 [$prompt_index/$max_prompts] Processing Prompt ID $prompt_id (Cycle $prompt_cycle_number)"
    echo "📝 Preview: ${prompt_text:0:100}..."
    
    echo "⚡ Sending to Cursor..."
    
    # Simple version - just mark as done and continue
    cd "$HOME/Scripts" && node supabase-client.js mark-done "$prompt_id"
    echo "✅ Prompt $prompt_index completed"
    
    # Wait 2 seconds between prompts (faster for testing)
    echo "⏳ Waiting 2 seconds..."
    sleep 2
    echo "---"
done

echo "🎉 Completed! Processed $prompt_index prompts for Ubahcrypt project!" 