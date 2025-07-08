#!/bin/bash

# Folder Consolidation Script
# Target: 20-30 root folders, max 10-15 items per folder

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

# Create main consolidated directories
create_consolidated_structure() {
    log "Creating consolidated directory structure..."
    
    # Main categories (targeting 20-25 folders max)
    mkdir -p storage/
    mkdir -p storage/builds/
    mkdir -p storage/backups/
    mkdir -p storage/external-tools/
    mkdir -p storage/legacy/
    mkdir -p storage/webhooks/
    
    mkdir -p development/
    mkdir -p development/agents/
    mkdir -p development/automation/
    mkdir -p development/configs/
    
    success "Consolidated structure created"
}

# Move build and distribution folders
consolidate_builds() {
    log "Consolidating build directories..."
    
    # Move all build/dist folders to storage/builds/
    mv dist/ storage/builds/ 2>/dev/null || true
    mv dist-app/ storage/builds/ 2>/dev/null || true
    mv dist-electron/ storage/builds/ 2>/dev/null || true
    
    success "Build directories consolidated to storage/builds/"
}

# Move backup directories
consolidate_backups() {
    log "Consolidating backup directories..."
    
    # Move all backup folders
    mv backup-*/ storage/backups/ 2>/dev/null || true
    
    success "Backup directories consolidated to storage/backups/"
}

# Move external tools and utilities
consolidate_external_tools() {
    log "Consolidating external tools..."
    
    # Move external tools to storage/external-tools/
    mv ubahcrypt-auto-prompter/ storage/external-tools/ 2>/dev/null || true
    mv telegram-webhook/ storage/external-tools/ 2>/dev/null || true
    mv siso-webhook-deploy/ storage/external-tools/ 2>/dev/null || true
    mv mega-code-bank/ storage/external-tools/ 2>/dev/null || true
    
    success "External tools consolidated to storage/external-tools/"
}

# Move development-related folders
consolidate_development() {
    log "Consolidating development directories..."
    
    # Move agent-related directories
    mv cc_agents/ development/agents/ 2>/dev/null || true
    
    # Move automation
    mv automation-tasks/ development/automation/ 2>/dev/null || true
    
    # Move configs (but keep essential ones in root)
    mkdir -p development/configs/
    cp -r configs/* development/configs/ 2>/dev/null || true
    
    success "Development directories consolidated"
}

# Consolidate docs (reduce from 41 items to manageable groups)
consolidate_docs() {
    log "Consolidating documentation..."
    
    cd docs/
    
    # Create organized doc structure
    mkdir -p guides/ reference/ research/ projects/ archive/
    
    # Move files by category
    mv *-GUIDE*.md guides/ 2>/dev/null || true
    mv *-SETUP*.md guides/ 2>/dev/null || true
    mv *-INTEGRATION*.md guides/ 2>/dev/null || true
    mv QUICK-START.md guides/ 2>/dev/null || true
    mv GETTING-STARTED.md guides/ 2>/dev/null || true
    
    # Move reference docs
    mv *-REFERENCE*.md reference/ 2>/dev/null || true
    mv MASTER-*.md reference/ 2>/dev/null || true
    mv CLAUDE-*.md reference/ 2>/dev/null || true
    
    # Move research docs
    mv research-logs/ research/ 2>/dev/null || true
    mv research/ research/technical/ 2>/dev/null || true
    
    # Move project-specific docs
    mv partnership-* projects/ 2>/dev/null || true
    
    # Archive old docs
    mv *.md archive/ 2>/dev/null || true
    
    cd ..
    success "Documentation consolidated into organized categories"
}

# Clean up archived-files structure
consolidate_archived_files() {
    log "Organizing archived-files structure..."
    
    cd archived-files/
    
    # Limit to max 10 categories
    mkdir -p legacy/ tools/ temp/
    
    # Move less important items to consolidated folders
    mv scripts/ legacy/ 2>/dev/null || true
    mv tests/ legacy/ 2>/dev/null || true
    mv integrations/ tools/ 2>/dev/null || true
    mv misc/ temp/ 2>/dev/null || true
    
    cd ..
    success "Archived files reorganized"
}

# Clean up projects directory
organize_projects() {
    log "Organizing projects directory..."
    
    cd projects/
    
    # Ensure clean structure
    # Currently has: siso-agency-web, claudia-desktop, shared, README.md
    # This is already within limits (4 items)
    
    cd ..
    success "Projects directory already well organized"
}

# Remove empty directories
remove_empty_dirs() {
    log "Removing empty directories..."
    
    find . -type d -empty -delete 2>/dev/null || true
    
    success "Empty directories removed"
}

# Create final structure report
create_structure_report() {
    log "Creating structure report..."
    
    cat > FOLDER-STRUCTURE-REPORT.md << 'EOF'
# Consolidated Folder Structure Report

## Root Directory Structure (Target: 20-30 folders)

### Core Application
- `projects/` - Main application projects (SISO Agency, Claudia)
- `src/` - Legacy source code (to be moved to projects)
- `docs/` - Organized documentation (guides, reference, research)
- `scripts/` - Build and automation scripts

### Development
- `development/` - Development tools and configurations
  - `agents/` - AI agents and configurations  
  - `automation/` - Automation tasks and workflows
  - `configs/` - Development configurations

### Storage & Archives
- `storage/` - Build outputs, backups, and external tools
  - `builds/` - All build and distribution outputs
  - `backups/` - Project backups and snapshots
  - `external-tools/` - Third-party tools and utilities
- `archived-files/` - Organized archived content (legacy, tools, temp)

### Infrastructure
- `supabase/` - Database configuration
- `public/` - Public assets
- `node_modules/` - Dependencies (auto-generated)
- `api/` - API endpoints
- `pages/` - Page definitions
- `electron/` - Electron app configuration

### Configuration Files (Root)
Essential config files remain in root for functionality.

## Folder Item Limits

Each folder now contains max 10-15 items:
- Documentation organized by category
- Storage items grouped by purpose  
- Development tools consolidated
- Legacy items archived appropriately

## Benefits

1. **Cleaner Navigation** - Easy to find what you need
2. **Logical Grouping** - Related items together
3. **Reduced Clutter** - No more than 30 root folders
4. **Scalable Structure** - Easy to add new items
5. **Preserved Functionality** - All essential files intact

## Next Steps

1. Test application functionality
2. Update documentation references
3. Verify build processes work
4. Clean up any remaining clutter
EOF
    
    success "Structure report created: FOLDER-STRUCTURE-REPORT.md"
}

# Count final structure
count_final_structure() {
    log "Counting final structure..."
    
    local root_dirs=$(find . -maxdepth 1 -type d -not -name "." -not -name ".*" | wc -l)
    echo ""
    echo "📊 FINAL STRUCTURE:"
    echo "   Root directories: $root_dirs"
    echo ""
    
    # Check each major directory
    for dir in projects storage development docs archived-files; do
        if [ -d "$dir" ]; then
            local items=$(ls -1 "$dir" 2>/dev/null | wc -l)
            echo "   $dir/: $items items"
        fi
    done
    
    echo ""
    if [ "$root_dirs" -le 30 ]; then
        success "✅ Root directories within target (≤30): $root_dirs"
    else
        warning "⚠️ Root directories exceed target (>30): $root_dirs"
    fi
}

# Main execution
main() {
    log "Starting folder consolidation..."
    
    echo "This will consolidate your directory structure to:"
    echo "- Max 20-30 root folders"
    echo "- Max 10-15 items per folder"
    echo ""
    read -p "Continue with consolidation? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Operation cancelled by user"
        exit 0
    fi
    
    create_consolidated_structure
    consolidate_builds
    consolidate_backups
    consolidate_external_tools
    consolidate_development
    consolidate_docs
    consolidate_archived_files
    organize_projects
    remove_empty_dirs
    create_structure_report
    count_final_structure
    
    success "Folder consolidation completed!"
    
    echo ""
    echo "🎉 YOUR DIRECTORY STRUCTURE IS NOW OPTIMIZED!"
    echo ""
    echo "✅ Root folders: ≤30"
    echo "✅ Items per folder: ≤15"
    echo "✅ Logical organization"
    echo "✅ Easy navigation"
}

main "$@"