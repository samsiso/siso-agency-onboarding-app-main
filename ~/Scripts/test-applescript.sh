#!/bin/bash

# Simple test to verify AppleScript functionality
echo "🧪 Testing AppleScript functionality..."

# Test if Cursor is running
if ! pgrep -x "Cursor" > /dev/null; then
    echo "❌ Cursor is not running. Please start Cursor first."
    exit 1
fi

echo "✅ Cursor is running"

# Simple AppleScript test
echo "🔍 Testing basic Cursor activation..."
result=$(osascript -e 'tell application "Cursor" to activate' 2>&1)
echo "Result: $result"

echo "🏁 Basic test completed!" 