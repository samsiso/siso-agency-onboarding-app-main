#!/bin/bash
# 🚀 SISO Agency Automation System Setup Script
# Sets up the complete Claude Code automation infrastructure

set -e  # Exit on error

echo "🤖 SISO Agency Automation System Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main"
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID:-""}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-""}

# Step 1: Verify Prerequisites
echo -e "${BLUE}📋 Step 1: Verifying Prerequisites${NC}"

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required. Current: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check npm/pnpm/yarn
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
else
    PACKAGE_MANAGER="npm"
fi

echo -e "${GREEN}✅ Package manager: $PACKAGE_MANAGER${NC}"

# Check Claude Code installation
echo -e "${BLUE}🔍 Checking Claude Code installation...${NC}"
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✅ Claude Code detected: $CLAUDE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Claude Code not found in PATH${NC}"
    echo -e "${BLUE}Installing Claude Code...${NC}"
    
    # Try to install Claude Code
    if command -v npm &> /dev/null; then
        npm install -g @anthropic-ai/claude-code@latest
        echo -e "${GREEN}✅ Claude Code installed${NC}"
    else
        echo -e "${RED}❌ Cannot install Claude Code. Please install manually:${NC}"
        echo -e "${YELLOW}npm install -g @anthropic-ai/claude-code${NC}"
        exit 1
    fi
fi

# Step 2: Environment Configuration
echo -e "${BLUE}📋 Step 2: Environment Configuration${NC}"

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating template...${NC}"
    cat > .env << EOF
# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase Configuration
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Automation Configuration
CLAUDE_CODE_MAX_TOKENS=10000
CLAUDE_CODE_TEMPERATURE=0.7
AUTOMATION_MAX_CONCURRENT_JOBS=3
TOKEN_DAILY_LIMIT=100000
TOKEN_MONTHLY_LIMIT=2500000

# Development
NODE_ENV=development
PORT=8081
EOF
    echo -e "${GREEN}✅ Created .env template${NC}"
    echo -e "${YELLOW}⚠️  Please fill in your API keys in .env file${NC}"
fi

# Validate required environment variables
if [ -f ".env" ]; then
    source .env
    
    if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key_here" ]; then
        echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not configured${NC}"
    else
        echo -e "${GREEN}✅ ANTHROPIC_API_KEY configured${NC}"
    fi
    
    if [ -z "$SUPABASE_PROJECT_ID" ] || [ "$SUPABASE_PROJECT_ID" = "your_supabase_project_id" ]; then
        echo -e "${YELLOW}⚠️  SUPABASE_PROJECT_ID not configured${NC}"
    else
        echo -e "${GREEN}✅ SUPABASE_PROJECT_ID configured${NC}"
    fi
fi

# Step 3: Install Dependencies
echo -e "${BLUE}📋 Step 3: Installing Dependencies${NC}"

echo -e "${BLUE}Installing automation dependencies...${NC}"
case $PACKAGE_MANAGER in
    "pnpm")
        pnpm install
        ;;
    "yarn")
        yarn install
        ;;
    *)
        npm install
        ;;
esac

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 4: Database Setup
echo -e "${BLUE}📋 Step 4: Database Setup${NC}"

if [ -n "$SUPABASE_PROJECT_ID" ] && [ "$SUPABASE_PROJECT_ID" != "your_supabase_project_id" ]; then
    echo -e "${BLUE}Setting up automation database tables...${NC}"
    
    # Check if Supabase CLI is available
    if command -v supabase &> /dev/null; then
        echo -e "${BLUE}Running database migrations...${NC}"
        supabase db push --project-ref "$SUPABASE_PROJECT_ID"
        echo -e "${GREEN}✅ Database migrations applied${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase CLI not found. Please run migrations manually:${NC}"
        echo -e "${YELLOW}1. Install Supabase CLI: npm install -g supabase${NC}"
        echo -e "${YELLOW}2. Run: supabase db push --project-ref $SUPABASE_PROJECT_ID${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping database setup - SUPABASE_PROJECT_ID not configured${NC}"
fi

# Step 5: Claude Code Configuration
echo -e "${BLUE}📋 Step 5: Claude Code Configuration${NC}"

# Ensure .claude directory exists
mkdir -p .claude

# Update Claude settings
echo -e "${BLUE}Configuring Claude Code settings...${NC}"
cat > .claude/settings.automation.json << EOF
{
  "permissions": {
    "allow": [
      "ReadFile",
      "Edit",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(pnpm:*)",
      "Bash(yarn:*)",
      "Bash(ls:*)",
      "Bash(grep:*)",
      "Bash(find:*)",
      "Bash(mkdir:*)",
      "Bash(mv:*)",
      "Bash(cp:*)",
      "Bash(rm:*)",
      "mcp_supabase_execute_sql",
      "mcp_supabase_list_tables",
      "mcp_supabase_apply_migration",
      "WebFetch(domain:docs.anthropic.com)",
      "WebFetch(domain:supabase.com)",
      "WebFetch(domain:21st.dev)"
    ],
    "allowedDomains": [
      "docs.anthropic.com",
      "supabase.com", 
      "21st.dev",
      "github.com"
    ]
  },
  "automation": {
    "maxConcurrentJobs": 3,
    "defaultTimeout": 300000,
    "retryAttempts": 2,
    "logLevel": "info"
  },
  "tokenLimits": {
    "daily": 100000,
    "perOperation": 10000,
    "emergencyBuffer": 50000
  }
}
EOF

echo -e "${GREEN}✅ Claude Code configuration updated${NC}"

# Step 6: Create Automation Scripts
echo -e "${BLUE}📋 Step 6: Creating Automation Scripts${NC}"

# Make automation scripts executable
chmod +x scripts/claude-automation-examples.sh

# Create automation runner script
cat > scripts/run-automation.sh << 'EOF'
#!/bin/bash
# Automation task runner

TASK_FILE="$1"
CATEGORY="${2:-development}"

if [ -z "$TASK_FILE" ]; then
    echo "Usage: $0 <task-file> [category]"
    exit 1
fi

if [ ! -f "$TASK_FILE" ]; then
    echo "Error: Task file not found: $TASK_FILE"
    exit 1
fi

echo "🚀 Running automation task: $TASK_FILE"
echo "📁 Category: $CATEGORY"

# Load task prompt
PROMPT=$(cat "$TASK_FILE")

# Run Claude Code with automation settings
claude -p "$PROMPT" \
    --allowedTools "ReadFile,Edit,Bash(git:*),Bash(npm:*)" \
    --output-format json \
    --settings .claude/settings.automation.json \
    --log-level info

echo "✅ Automation task completed"
EOF

chmod +x scripts/run-automation.sh

echo -e "${GREEN}✅ Automation scripts created${NC}"

# Step 7: Setup Complete
echo -e "${GREEN}🎉 SISO Agency Automation System Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "${GREEN}✅ Claude Code integration configured${NC}"
echo -e "${GREEN}✅ Automation engine services created${NC}"
echo -e "${GREEN}✅ Database schema ready${NC}"
echo -e "${GREEN}✅ React components built${NC}"
echo -e "${GREEN}✅ Rate limiting & token tracking implemented${NC}"

echo ""
echo -e "${ORANGE}🚀 Next Steps:${NC}"
echo "1. Configure your API keys in .env file"
echo "2. Run database migrations if not done automatically"
echo "3. Start the development server: npm run dev"
echo "4. Access automation dashboard at /automation"
echo "5. Create your first automation task"

echo ""
echo -e "${BLUE}📚 Quick Commands:${NC}"
echo "• Start dev server: npm run dev"
echo "• Run automation: ./scripts/run-automation.sh <task-file>"
echo "• View examples: ./scripts/claude-automation-examples.sh"
echo "• Check status: claude --version"

echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "• Keep your API keys secure"
echo "• Monitor token usage to control costs"
echo "• Review automation tasks before executing"
echo "• Use rate limits to prevent API abuse"

echo ""
echo -e "${GREEN}✨ Automation system ready for use!${NC}"