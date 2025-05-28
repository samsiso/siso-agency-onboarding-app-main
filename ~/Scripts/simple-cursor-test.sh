#!/bin/bash

echo "🧪 Testing Cursor automation..."

osascript << 'EOF'
try
    tell application "Cursor" to activate
    delay 2
    tell application "System Events"
        keystroke "i" using {command down}
        delay 3
    end tell
    set the clipboard to "🎉 TEST: This is a simple test from the automation script!"
    delay 1
    tell application "System Events"
        keystroke "v" using {command down}
    end tell
    return "Success"
on error errMsg number errNum
    return "Error: " & errMsg & " (Number: " & errNum & ")"
end try
EOF 