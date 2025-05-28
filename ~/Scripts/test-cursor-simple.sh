#!/bin/bash

# Test AppleScript with existing file
echo "Test prompt for existing file" > /tmp/test_prompt.txt

osascript << 'EOF'
try
    tell application "Cursor" to activate
    delay 2
    tell application "System Events"
        keystroke "i" using {command down}
        delay 3
    end tell
    set promptText to read POSIX file "/tmp/test_prompt.txt" as «class utf8»
    set the clipboard to promptText
    delay 1
    tell application "System Events"
        keystroke "a" using {command down}
        delay 0.5
        keystroke "v" using {command down}
    end tell
    return "Success"
on error errMsg number errNum
    return "Error: " & errMsg & " (Number: " & errNum & ")"
end try
EOF 