#!/bin/bash

# SISO Agency Platform - MCP Setup Script
# This script configures your existing MCP tools for Claude Code

echo "🚀 Configuring MCP tools for SISO Agency Platform..."
echo "📋 You have 22 MCP servers configured including:"
echo "   • Supabase (database access)"
echo "   • GitHub (repository management)" 
echo "   • Task managers & automation tools"
echo "   • AI reasoning & memory systems"
echo "   • Web automation & analysis tools"

# Copy configuration to Claude Desktop location (macOS)
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
mkdir -p "$CLAUDE_CONFIG_DIR"

if [ -f "claude_desktop_config.json" ]; then
    cp claude_desktop_config.json "$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
    echo "✅ Claude Desktop configuration copied to: $CLAUDE_CONFIG_DIR"
    echo "   Your configuration includes all 22 MCP servers with credentials"
else
    echo "❌ claude_desktop_config.json not found in current directory"
    exit 1
fi

echo ""
echo "🔧 NEXT STEPS:"
echo "1. ✅ Configuration file is ready with your credentials"
echo "2. 🔄 Restart Claude Desktop application"
echo "3. 🧪 Test MCP integration:"
echo "   • Ask Claude Code to list Supabase tables"
echo "   • Request GitHub repository status"
echo "   • Try task management features"
echo ""
echo "📖 For SISO-specific usage patterns, see:"
echo "   docs/claude/MCP-SETUP-GUIDE.md"
echo "   docs/claude/DATABASE-INTEGRATION.md"
echo "   docs/claude/GITHUB-WORKFLOW.md"
echo ""
echo "🎯 Your extensive MCP toolkit is ready for SISO autonomous development!"
echo "🔥 You have premium tools like Magic, Memory, Task Managers, and more!"

# Make script executable
chmod +x setup-mcp.sh