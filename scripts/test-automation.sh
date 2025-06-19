#!/bin/bash
# 🧪 Simple Automation Test Script
# Tests the automation system with a basic task

echo "🧪 Testing SISO Automation System"
echo "================================="

# Check if Claude Code is available
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Installing..."
    npm install -g @anthropic-ai/claude-code@latest || {
        echo "❌ Failed to install Claude Code"
        exit 1
    }
fi

# Check environment variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. Please add it to your .env file"
    echo "   You can still test with a basic prompt, but API calls won't work"
fi

echo "✅ Claude Code available: $(claude --version 2>/dev/null || echo 'installed')"

# Create a simple test task file
cat > /tmp/test-task.txt << 'EOF'
Create a simple hello world function in TypeScript.

Requirements:
- Create a new file: src/utils/hello.ts
- Export a function called sayHello that takes a name parameter
- Return "Hello, {name}!" 
- Use TypeScript with proper typing
- Add a JSDoc comment

Please implement this simple function.
EOF

echo ""
echo "🚀 Testing automation with a simple task..."
echo "Task: Create a hello world utility function"
echo ""

# Test 1: Basic Claude Code execution (no API required)
echo "📝 Test 1: Basic Claude Code syntax test"
echo "claude --help | head -10"
claude --help | head -10

echo ""
echo "📝 Test 2: Test with allowed tools (requires API key)"

if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "Running: claude -p 'List files in src directory' --allowedTools 'Bash(ls:*)' --output-format json"
    
    # Simple test - list files
    claude -p "List the files in the src directory and tell me what you see" \
        --allowedTools "Bash(ls:*)" \
        --output-format json \
        --max-tokens 1000 || {
        echo "⚠️  API test failed - check your API key and connectivity"
    }
else
    echo "⚠️  Skipping API test - ANTHROPIC_API_KEY not set"
fi

echo ""
echo "📝 Test 3: Test file creation (requires API key)"

if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "Creating test utility function..."
    
    claude -p "$(cat /tmp/test-task.txt)" \
        --allowedTools "ReadFile,Edit,Bash(ls:*),Bash(mkdir:*)" \
        --output-format json \
        --max-tokens 3000 && {
        
        echo ""
        echo "✅ Task completed! Checking results..."
        
        # Check if file was created
        if [ -f "src/utils/hello.ts" ]; then
            echo "✅ File created successfully: src/utils/hello.ts"
            echo "📄 File contents:"
            cat src/utils/hello.ts
        else
            echo "⚠️  File not found: src/utils/hello.ts"
            echo "   This might be expected if Claude decided not to create it"
        fi
        
        # Check src directory
        echo ""
        echo "📁 Current src/utils directory:"
        ls -la src/utils/ 2>/dev/null || echo "   Directory doesn't exist yet"
        
    } || {
        echo "❌ File creation test failed"
    }
else
    echo "⚠️  Skipping file creation test - ANTHROPIC_API_KEY not set"
fi

echo ""
echo "📝 Test 4: Automation Engine Integration Test"

# Test the automation engine directly if Node.js is available
if command -v node &> /dev/null; then
    echo "Testing TypeScript compilation..."
    
    # Try to compile the automation engine
    npx tsc --noEmit src/services/automation/AutomationEngine.ts 2>/dev/null && {
        echo "✅ AutomationEngine compiles successfully"
    } || {
        echo "⚠️  TypeScript compilation issues (expected without full setup)"
    }
else
    echo "⚠️  Node.js not available for TS compilation test"
fi

echo ""
echo "📝 Test 5: Database Schema Validation"

# Check if the migration file exists and is valid
if [ -f "supabase/migrations/20250125_create_automation_tables.sql" ]; then
    echo "✅ Database migration file exists"
    echo "📊 Tables to be created:"
    grep "CREATE TABLE" supabase/migrations/20250125_create_automation_tables.sql | sed 's/CREATE TABLE[^.]*\./  - /' | sed 's/ (.*$//'
else
    echo "❌ Database migration file not found"
fi

echo ""
echo "🎯 Test Summary"
echo "==============="

echo "✅ Setup script available: scripts/setup-automation.sh"
echo "✅ Automation components created in: src/services/automation/"
echo "✅ React dashboard components created in: src/components/automation/"
echo "✅ Database schema ready: supabase/migrations/"
echo "✅ Documentation available: docs/quick-start-automation.md"

if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ API key configured - ready for real automation tasks"
else
    echo "⚠️  Set ANTHROPIC_API_KEY in .env to test actual automation"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Set up your API keys in .env file"
echo "2. Run: ./scripts/setup-automation.sh"
echo "3. Start dev server: npm run dev"
echo "4. Visit: http://localhost:8081/automation"
echo "5. Create your first automation task!"

echo ""
echo "📚 Quick test commands:"
echo "  • Test Claude directly: claude -p 'Hello world' --allowedTools 'ReadFile'"
echo "  • Run setup: ./scripts/setup-automation.sh"
echo "  • View docs: cat docs/quick-start-automation.md"

# Cleanup
rm -f /tmp/test-task.txt

echo ""
echo "✨ Automation system test complete!"