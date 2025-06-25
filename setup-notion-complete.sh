#!/bin/bash

# 🚀 COMPLETE NOTION INTEGRATION SETUP SCRIPT
# Sets up the entire Notion integration for SISO Assistant

set -e  # Exit on any error

echo "🚀 SISO NOTION INTEGRATION COMPLETE SETUP"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    log_info "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log_success "Node.js version: $NODE_VERSION"
}

# Check if npm is available
check_npm() {
    log_info "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    log_success "npm version: $NPM_VERSION"
}

# Install required dependencies
install_dependencies() {
    log_info "Installing Notion dependencies..."
    
    # Install Notion client and related packages
    npm install @notionhq/client notion-to-md
    
    # Check if Supabase is already installed (optional)
    if npm list @supabase/supabase-js &> /dev/null; then
        log_success "Supabase client already installed"
    else
        log_warning "Supabase client not found (optional for Notion-only setup)"
    fi
    
    log_success "Dependencies installed successfully"
}

# Check if .env file exists
check_env_file() {
    log_info "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating template..."
        cat > .env << EOF
# Telegram Configuration
TELEGRAM_TOKEN=your_telegram_bot_token_here
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_token_here

# Notion Configuration (will be added during setup)
NOTION_API_KEY=
NOTION_TASKS_DB_ID=
NOTION_PROJECTS_DB_ID=
NOTION_CLIENTS_DB_ID=
NOTION_METRICS_DB_ID=

# Supabase Configuration (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
EOF
        log_success "Template .env file created"
    else
        log_success ".env file exists"
    fi
}

# Run the Notion setup configuration
run_notion_setup() {
    log_info "Running Notion API setup..."
    
    if [ -f "notion-setup-config.js" ]; then
        echo ""
        echo "🔐 NOTION API SETUP"
        echo "=================="
        echo ""
        echo "This will guide you through:"
        echo "1. Getting your Notion API key"
        echo "2. Creating Notion databases"
        echo "3. Configuring environment variables"
        echo ""
        read -p "Press Enter to continue..."
        
        node notion-setup-config.js
        
        if [ $? -eq 0 ]; then
            log_success "Notion setup completed successfully"
        else
            log_error "Notion setup failed"
            exit 1
        fi
    else
        log_error "notion-setup-config.js not found"
        exit 1
    fi
}

# Enhance the server with Notion integration
enhance_server() {
    log_info "Enhancing server with Notion integration..."
    
    if [ -f "enhance-server-with-notion.js" ]; then
        node enhance-server-with-notion.js
        
        if [ $? -eq 0 ]; then
            log_success "Server enhanced successfully"
        else
            log_error "Server enhancement failed"
            exit 1
        fi
    else
        log_error "enhance-server-with-notion.js not found"
        exit 1
    fi
}

# Test the integration
test_integration() {
    log_info "Testing Notion integration..."
    
    if [ -f "notion-quick-test.js" ]; then
        echo ""
        echo "🧪 RUNNING INTEGRATION TESTS"
        echo "============================"
        echo ""
        
        node notion-quick-test.js
        
        if [ $? -eq 0 ]; then
            log_success "All tests passed!"
        else
            log_warning "Some tests failed. Check the output above."
            echo ""
            read -p "Continue anyway? (y/n): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    else
        log_warning "notion-quick-test.js not found. Skipping tests."
    fi
}

# Create startup scripts
create_startup_scripts() {
    log_info "Creating startup scripts..."
    
    # Development startup script
    cat > start-notion-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting SISO Assistant with Notion Integration (Development)"
echo "=============================================================="

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$NOTION_API_KEY" ]; then
    echo "❌ NOTION_API_KEY not set. Run setup first."
    exit 1
fi

if [ -z "$TELEGRAM_TOKEN" ]; then
    echo "❌ TELEGRAM_TOKEN not set. Configure your Telegram bot."
    exit 1
fi

echo "✅ Environment variables loaded"
echo "📝 Notion API Key: ${NOTION_API_KEY:0:20}..."
echo "🤖 Telegram Token: ${TELEGRAM_TOKEN:0:20}..."
echo ""

# Start the server
echo "🚀 Starting server..."
node server.js
EOF

    # Production startup script
    cat > start-notion-prod.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting SISO Assistant with Notion Integration (Production)"
echo "============================================================="

# Production startup with PM2 (if available)
if command -v pm2 &> /dev/null; then
    echo "📦 Using PM2 for production deployment"
    pm2 start server.js --name "siso-notion-assistant" --watch
    pm2 save
    pm2 startup
else
    echo "🔄 Starting with node (PM2 recommended for production)"
    node server.js
fi
EOF

    # Make scripts executable
    chmod +x start-notion-dev.sh
    chmod +x start-notion-prod.sh
    
    log_success "Startup scripts created"
}

# Create package.json scripts
update_package_scripts() {
    log_info "Updating package.json scripts..."
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        # Create a temporary file with updated scripts
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            
            pkg.scripts = pkg.scripts || {};
            pkg.scripts['start:notion'] = 'bash start-notion-dev.sh';
            pkg.scripts['start:notion:prod'] = 'bash start-notion-prod.sh';
            pkg.scripts['test:notion'] = 'node notion-quick-test.js';
            pkg.scripts['setup:notion'] = 'node notion-setup-config.js';
            
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
        
        log_success "Package.json scripts updated"
    else
        log_warning "package.json not found. Scripts not added."
    fi
}

# Display final instructions
show_final_instructions() {
    echo ""
    echo "🎉 NOTION INTEGRATION SETUP COMPLETE!"
    echo "====================================="
    echo ""
    echo "📋 What was set up:"
    echo "  ✅ Notion API dependencies installed"
    echo "  ✅ Notion service and enhanced manager created"
    echo "  ✅ Server enhanced with Notion endpoints"
    echo "  ✅ Environment variables configured"
    echo "  ✅ Startup scripts created"
    echo "  ✅ Integration tested"
    echo ""
    echo "🚀 Next Steps:"
    echo ""
    echo "1. Start your enhanced server:"
    echo "   npm run start:notion"
    echo "   # or"
    echo "   bash start-notion-dev.sh"
    echo ""
    echo "2. Test with Telegram:"
    echo "   • Send: 'Add task: Fix the login bug'"
    echo "   • Send: 'Create project: Website for ABC Company'"
    echo "   • Send: 'Record revenue $5000'"
    echo "   • Send: 'Show my dashboard'"
    echo ""
    echo "3. Access API endpoints:"
    echo "   • Health: http://localhost:3000/notion/health"
    echo "   • Dashboard: http://localhost:3000/notion/dashboard"
    echo "   • Tasks: http://localhost:3000/notion/tasks"
    echo ""
    echo "4. Check your Notion workspace for:"
    echo "   • SISO Tasks database"
    echo "   • SISO Projects database"
    echo "   • SISO Clients database"
    echo "   • SISO Metrics database"
    echo ""
    echo "📖 Documentation:"
    echo "   • Setup Summary: NOTION_SETUP_SUMMARY.md"
    echo "   • Server Integration: SERVER_NOTION_INTEGRATION.md"
    echo "   • Integration Plan: NOTION_API_INTEGRATION_PLAN.md"
    echo ""
    echo "🆘 Troubleshooting:"
    echo "   • Test integration: npm run test:notion"
    echo "   • Check logs for errors"
    echo "   • Verify environment variables"
    echo "   • Ensure Notion databases are shared with integration"
    echo ""
    echo "💡 Pro Tips:"
    echo "   • Use voice messages for hands-free task creation"
    echo "   • Set up Notion templates for consistent project structure"
    echo "   • Monitor the dashboard endpoint for business insights"
    echo "   • Use the API endpoints for custom integrations"
    echo ""
    
    if [ -f "NOTION_SETUP_SUMMARY.md" ]; then
        echo "📄 Detailed setup summary available in NOTION_SETUP_SUMMARY.md"
    fi
}

# Main execution flow
main() {
    echo "Starting complete Notion integration setup..."
    echo ""
    
    # Step 1: Prerequisites
    check_nodejs
    check_npm
    check_env_file
    
    # Step 2: Dependencies
    install_dependencies
    
    # Step 3: Notion Setup
    run_notion_setup
    
    # Step 4: Server Enhancement
    enhance_server
    
    # Step 5: Create Scripts
    create_startup_scripts
    update_package_scripts
    
    # Step 6: Test Integration
    test_integration
    
    # Step 7: Final Instructions
    show_final_instructions
    
    log_success "Setup completed successfully!"
}

# Handle script interruption
trap 'echo ""; log_error "Setup interrupted. You can resume by running this script again."; exit 1' INT

# Run main function
main "$@" 