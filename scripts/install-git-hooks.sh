#!/bin/bash

# SISO Agency - Git Hooks Installer
# Installs the Self-Updating Context Engine hooks for team development

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${BLUE}🔧 Installing SISO Context Engine Git Hooks...${NC}"

# Get the git repository root
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "${RED}❌ Error: Not in a Git repository${NC}"
    exit 1
fi

HOOKS_DIR="$GIT_ROOT/.git/hooks"
SOURCE_HOOK="$GIT_ROOT/.git/hooks/pre-push"

# Check if we're in the correct repository
if [ ! -f "$GIT_ROOT/scripts/brain-commit-processor.js" ]; then
    echo "${RED}❌ Error: brain-commit-processor.js not found. Are you in the SISO project directory?${NC}"
    exit 1
fi

# Install pre-push hook
if [ -f "$SOURCE_HOOK" ]; then
    echo "${GREEN}✅ Pre-push hook already exists${NC}"
    
    # Check if it's our hook or a different one
    if grep -q "SISO Agency - Self-Updating Context Engine" "$SOURCE_HOOK"; then
        echo "${GREEN}✅ SISO Context Engine hook is already installed${NC}"
    else
        echo "${YELLOW}⚠️  Existing pre-push hook detected (not SISO's)${NC}"
        echo "${YELLOW}   Consider backing up your existing hook before proceeding${NC}"
        read -p "Replace existing hook? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "${YELLOW}⏹️  Hook installation cancelled${NC}"
            exit 0
        fi
    fi
else
    echo "${BLUE}📝 Installing pre-push hook...${NC}"
fi

# Verify hook is executable
if [ -f "$SOURCE_HOOK" ]; then
    chmod +x "$SOURCE_HOOK"
    echo "${GREEN}✅ Pre-push hook is executable${NC}"
fi

# Test hook installation
echo "${BLUE}🧪 Testing hook installation...${NC}"

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "${RED}❌ Warning: Node.js not found. The hook requires Node.js to function.${NC}"
    echo "${YELLOW}   Please install Node.js: https://nodejs.org/${NC}"
else
    echo "${GREEN}✅ Node.js is available${NC}"
fi

# Check if brain processor script exists and is executable
BRAIN_SCRIPT="$GIT_ROOT/scripts/brain-commit-processor.js"
if [ -f "$BRAIN_SCRIPT" ]; then
    if [ -x "$BRAIN_SCRIPT" ]; then
        echo "${GREEN}✅ Brain processor script is executable${NC}"
    else
        chmod +x "$BRAIN_SCRIPT"
        echo "${GREEN}✅ Made brain processor script executable${NC}"
    fi
else
    echo "${RED}❌ Error: Brain processor script not found at $BRAIN_SCRIPT${NC}"
    exit 1
fi

# Environment variables check
echo "${BLUE}🔧 Environment Setup:${NC}"
if [ -z "$OPENAI_API_KEY" ]; then
    echo "${YELLOW}⚠️  OPENAI_API_KEY not set${NC}"
    ENV_MISSING=1
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "${YELLOW}⚠️  VITE_SUPABASE_URL not set${NC}"
    ENV_MISSING=1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "${YELLOW}⚠️  VITE_SUPABASE_ANON_KEY not set${NC}"
    ENV_MISSING=1
fi

if [ "$ENV_MISSING" = "1" ]; then
    echo "${YELLOW}📝 Note: The hook will skip processing if environment variables are missing${NC}"
    echo "${YELLOW}   This won't block your development workflow${NC}"
else
    echo "${GREEN}✅ All required environment variables are set${NC}"
fi

echo
echo "${GREEN}🎉 SISO Context Engine hooks installed successfully!${NC}"
echo
echo "${BLUE}📋 What happens now:${NC}"
echo "   • Every 'git push' will automatically process commits"
echo "   • Commit summaries and embeddings are stored in Supabase"
echo "   • Claude gets smarter context about your codebase"
echo "   • Failed processing won't block your pushes"
echo
echo "${BLUE}💡 Manual usage:${NC}"
echo "   node scripts/brain-commit-processor.js [commit-hash]"
echo
echo "${GREEN}✨ Happy coding with enhanced Claude context!${NC}" 