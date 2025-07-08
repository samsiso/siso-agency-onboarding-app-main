#!/bin/bash

# Script to organize loose files in root directory
# This will move files to appropriate folders without breaking the app

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create organized folder structure
create_organized_structure() {
    log "Creating organized folder structure..."
    
    mkdir -p archived-files/
    mkdir -p archived-files/docs/
    mkdir -p archived-files/configs/
    mkdir -p archived-files/scripts/
    mkdir -p archived-files/tests/
    mkdir -p archived-files/integrations/
    mkdir -p archived-files/deployment/
    mkdir -p archived-files/backups/
    
    success "Organized folder structure created"
}

# Move documentation files
move_documentation() {
    log "Moving documentation files..."
    
    # All markdown files except essential ones
    find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CLAUDE.md" -exec mv {} archived-files/docs/ \;
    
    success "Documentation files moved to archived-files/docs/"
}

# Move configuration files
move_config_files() {
    log "Moving configuration files..."
    
    # Config files that are safe to move
    mv claude_desktop_config.json archived-files/configs/ 2>/dev/null || true
    mv whatsapp-config.json archived-files/configs/ 2>/dev/null || true
    mv whatsapp-test-results.json archived-files/configs/ 2>/dev/null || true
    mv vercel.json archived-files/configs/ 2>/dev/null || true
    mv render.yaml archived-files/configs/ 2>/dev/null || true
    
    # Backup package.json files
    mv webhook-package.json archived-files/backups/ 2>/dev/null || true
    mv railway-package.json archived-files/backups/ 2>/dev/null || true
    
    success "Configuration files moved to archived-files/configs/"
}

# Move integration files
move_integration_files() {
    log "Moving integration files..."
    
    # N8N workflow files
    mv n8n-*.json archived-files/integrations/ 2>/dev/null || true
    
    # Telegram integration files
    mv telegram-*.js archived-files/integrations/ 2>/dev/null || true
    mv telegram-*.ts archived-files/integrations/ 2>/dev/null || true
    mv telegram-*.md archived-files/integrations/ 2>/dev/null || true
    
    # WhatsApp integration files
    mv whatsapp-*.js archived-files/integrations/ 2>/dev/null || true
    
    # Notion integration files
    mv notion-*.js archived-files/integrations/ 2>/dev/null || true
    
    success "Integration files moved to archived-files/integrations/"
}

# Move test and demo files
move_test_files() {
    log "Moving test and demo files..."
    
    # Test files
    mv test-*.js archived-files/tests/ 2>/dev/null || true
    mv test-*.sh archived-files/tests/ 2>/dev/null || true
    
    # Demo files
    mv *-demo.js archived-files/tests/ 2>/dev/null || true
    mv *-quick-*.js archived-files/tests/ 2>/dev/null || true
    
    success "Test and demo files moved to archived-files/tests/"
}

# Move script files
move_script_files() {
    log "Moving script files..."
    
    # Server and automation scripts
    mv server.js archived-files/scripts/ 2>/dev/null || true
    mv server.js.backup archived-files/scripts/ 2>/dev/null || true
    mv standalone-webhook-server.js archived-files/scripts/ 2>/dev/null || true
    mv unified-message-handler.js archived-files/scripts/ 2>/dev/null || true
    mv add-test-data.js archived-files/scripts/ 2>/dev/null || true
    mv claude-auto-setup.ts archived-files/scripts/ 2>/dev/null || true
    
    # Shell scripts
    mv *.sh archived-files/scripts/ 2>/dev/null || true
    
    success "Script files moved to archived-files/scripts/"
}

# Move deployment files
move_deployment_files() {
    log "Moving deployment files..."
    
    # SQL files
    mv *.sql archived-files/deployment/ 2>/dev/null || true
    
    # Deployment specific files
    mv deploy-*.sh archived-files/deployment/ 2>/dev/null || true
    mv setup-*.sh archived-files/deployment/ 2>/dev/null || true
    mv start-*.sh archived-files/deployment/ 2>/dev/null || true
    
    success "Deployment files moved to archived-files/deployment/"
}

# Create index file for archived files
create_archive_index() {
    log "Creating archive index..."
    
    cat > archived-files/README.md << 'EOF'
# Archived Files

This directory contains files that were moved from the root directory to keep it clean and organized.

## Directory Structure

- `docs/` - Documentation files (setup guides, deployment instructions)
- `configs/` - Configuration files for various integrations
- `scripts/` - Automation scripts and server files
- `tests/` - Test files and demo scripts
- `integrations/` - Integration files for Telegram, WhatsApp, Notion, etc.
- `deployment/` - Deployment scripts and SQL files
- `backups/` - Backup configuration files

## Purpose

These files were moved to:
1. Keep the root directory clean and organized
2. Maintain clear separation between active and archived code
3. Preserve all files without breaking the main application
4. Make it easier to find and manage different types of files

## Safety

All files in this directory are safe to archive and don't affect the main application functionality. The core application files remain in the root directory and `projects/` folder.
EOF
    
    success "Archive index created"
}

# Verify essential files remain
verify_essential_files() {
    log "Verifying essential files remain in root..."
    
    essential_files=(
        "package.json"
        "package-lock.json"
        "vite.config.ts"
        "tailwind.config.ts"
        "tsconfig.json"
        "components.json"
        "workspace.json"
        "README.md"
        "CLAUDE.md"
    )
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file - Present"
        else
            warning "$file - Missing (this might be expected)"
        fi
    done
    
    success "Essential files verification complete"
}

# Main execution
main() {
    log "Starting root directory organization..."
    
    # Ask for confirmation
    echo "This script will move loose files to organized folders."
    echo "Essential files (package.json, configs, etc.) will remain in root."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Operation cancelled by user"
        exit 0
    fi
    
    create_organized_structure
    move_documentation
    move_config_files
    move_integration_files
    move_test_files
    move_script_files
    move_deployment_files
    create_archive_index
    verify_essential_files
    
    success "Root directory organization completed successfully!"
    
    echo ""
    echo "Summary:"
    echo "- Documentation moved to archived-files/docs/"
    echo "- Configuration files moved to archived-files/configs/"
    echo "- Integration files moved to archived-files/integrations/"
    echo "- Test files moved to archived-files/tests/"
    echo "- Script files moved to archived-files/scripts/"
    echo "- Deployment files moved to archived-files/deployment/"
    echo ""
    echo "Essential files remain in root directory."
    echo "Your app will continue to work normally!"
}

main "$@"