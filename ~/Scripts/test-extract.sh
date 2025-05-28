#!/bin/bash

extract_file_path() {
    local prompt_text="$1"
    
    # Look for common file path patterns
    file_path=$(echo "$prompt_text" | grep -oE '/src/[^[:space:].,;)]*\.(tsx?|jsx?|ts|js|vue|py|php|html|css|scss|sass)' | head -1)
    
    if [ -z "$file_path" ]; then
        # Try alternative patterns
        file_path=$(echo "$prompt_text" | grep -oE 'src/[^[:space:].,;)]*\.(tsx?|jsx?|ts|js|vue|py|php|html|css|scss|sass)' | head -1)
        if [ ! -z "$file_path" ]; then
            file_path="/$file_path"
        fi
    fi
    
    if [ -z "$file_path" ]; then
        # Try even more patterns
        file_path=$(echo "$prompt_text" | grep -oE '[^[:space:]]*\.(tsx?|jsx?|ts|js|vue|py|php|html|css|scss|sass)' | head -1)
    fi
    
    echo "$file_path"
}

# Test with the actual prompt
test_prompt="For the Markets component located in /src/pages/markets.tsx, please conduct a comprehensive analysis of the UI codebase"

echo "Testing file extraction..."
echo "Input prompt: $test_prompt"
echo ""

result=$(extract_file_path "$test_prompt")
echo "Extracted file path: '$result'"

if [ ! -z "$result" ]; then
    echo "✅ Successfully extracted file path!"
else
    echo "❌ No file path found"
fi 