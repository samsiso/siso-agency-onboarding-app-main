#!/bin/bash

echo "🧪 Testing Simple Hardcoded Prompt Script..."

# Hardcoded test prompts
PROMPTS=(
    "Hello! This is test prompt 1. Please respond with a simple acknowledgment."
    "Test prompt 2: Can you analyze the current file structure and suggest improvements?"
    "Test prompt 3: Please review the code quality and provide recommendations for better practices."
)

echo "📍 Testing with ${#PROMPTS[@]} hardcoded prompts"
echo "---"

for i in "${!PROMPTS[@]}"; do
    prompt_num=$((i + 1))
    prompt_text="${PROMPTS[$i]}"
    
    echo "🔄 Sending prompt $prompt_num/${#PROMPTS[@]}"
    echo "📝 Content: ${prompt_text:0:50}..."
    
    # Method 1: Direct clipboard approach (like working simple scripts)
    echo "📤 Sending to Cursor via clipboard method..."
    
    result=$(osascript << EOF
try
    tell application "Cursor" to activate
    delay 2
    tell application "System Events"
        keystroke "i" using {command down}
        delay 3
    end tell
    set the clipboard to "$prompt_text"
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
    
    echo "📨 Result: $result"
    
    if [ $prompt_num -lt ${#PROMPTS[@]} ]; then
        echo "⏰ Waiting 5 seconds before next prompt..."
        sleep 5
        echo "---"
    fi
done

echo "🎉 Simple hardcoded test completed!" 