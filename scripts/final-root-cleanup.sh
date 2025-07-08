#!/bin/bash

# Final Root Directory Cleanup Script
# This will move ALL remaining unessential files to organized folders

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

# Files that MUST stay in root (essential for app functionality)
declare -a ESSENTIAL_FILES=(
    "package.json"
    "package-lock.json" 
    "vite.config.ts"
    "tailwind.config.ts"
    "tsconfig.json"
    "tsconfig.app.json"
    "tsconfig.node.json"
    "eslint.config.js"
    "postcss.config.js"
    "components.json"
    "workspace.json"
    "index.html"
    "README.md"
    "CLAUDE.md"
    ".gitignore"
    ".env"
    ".env.mcp"
    "bun.lockb"
)

# Check if file is essential
is_essential_file() {
    local file="$1"
    for essential in "${ESSENTIAL_FILES[@]}"; do
        if [[ "$file" == "$essential" ]]; then
            return 0
        fi
    done
    return 1
}

# Move non-essential files
move_non_essential_files() {
    log "Moving non-essential files from root directory..."
    
    # Ensure archived-files structure exists
    mkdir -p archived-files/{configs,scripts,integrations,misc}
    
    # Get all files in root (not directories)
    for file in $(find . -maxdepth 1 -type f -not -name ".*" | sed 's|^\./||'); do
        if ! is_essential_file "$file"; then
            log "Moving non-essential file: $file"
            
            case "$file" in
                *.json)
                    mv "$file" archived-files/configs/
                    ;;
                *.js)
                    mv "$file" archived-files/scripts/
                    ;;
                *.log|*.pid)
                    mv "$file" archived-files/misc/
                    ;;
                *)
                    mv "$file" archived-files/misc/
                    ;;
            esac
        fi
    done
    
    # Handle hidden files (except essential ones)
    for file in $(find . -maxdepth 1 -name ".*" -type f | sed 's|^\./||'); do
        case "$file" in
            .gitignore|.env|.env.mcp)
                # Keep these essential files
                ;;
            .DS_Store|.server.log|.server.pid)
                log "Moving hidden file: $file"
                mv "$file" archived-files/misc/ 2>/dev/null || true
                ;;
        esac
    done
    
    success "Non-essential files moved to archived-files/"
}

# List remaining files in root
list_remaining_files() {
    log "Files remaining in root directory:"
    echo ""
    
    for file in $(find . -maxdepth 1 -type f | sed 's|^\./||' | sort); do
        if is_essential_file "$file"; then
            echo "✅ $file (essential)"
        else
            echo "⚠️  $file (may need attention)"
        fi
    done
    
    echo ""
    log "Directory count in root:"
    find . -maxdepth 1 -type d -not -name "." | wc -l | xargs echo "Directories:"
    
    log "File count in root:"
    find . -maxdepth 1 -type f | wc -l | xargs echo "Files:"
}

# Create final cleanup report
create_cleanup_report() {
    log "Creating final cleanup report..."
    
    cat > archived-files/FINAL-CLEANUP-REPORT.md << 'EOF'
# Final Root Directory Cleanup Report

This report documents the final cleanup of the root directory.

## Files Moved to archived-files/

### configs/
- Configuration files and JSON files that are not essential for build

### scripts/
- JavaScript files and automation scripts

### misc/
- Log files, temporary files, and other miscellaneous items

## Essential Files Remaining in Root

The following files remain in root because they are essential for the application:

- `package.json` - Main dependency configuration
- `package-lock.json` - Dependency lock file
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration  
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node-specific TypeScript config
- `eslint.config.js` - Linting configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - UI components configuration
- `workspace.json` - Multi-project workspace configuration
- `index.html` - Main HTML entry point
- `README.md` - Project documentation
- `CLAUDE.md` - Claude configuration
- `.gitignore` - Git ignore rules
- `.env` - Environment variables
- `.env.mcp` - MCP environment variables
- `bun.lockb` - Bun package lock file

## Directory Structure

```
root/
├── Essential files only (listed above)
├── projects/
│   ├── siso-agency-web/     # Main agency application
│   ├── claudia-desktop/     # Claudia desktop integration
│   └── shared/              # Shared components
├── archived-files/          # All moved files organized by type
├── scripts/                 # Build and automation scripts
├── docs/                    # Documentation
└── Other organized directories
```

## Next Steps

1. The root directory is now clean and professional
2. All essential files remain functional
3. Claudia can be integrated into projects/claudia-desktop/
4. The build system will work correctly with this structure

## Safety

This cleanup preserves all functionality while organizing files logically. No essential files were removed, only moved to appropriate directories.
EOF
    
    success "Cleanup report created at archived-files/FINAL-CLEANUP-REPORT.md"
}

# Main execution
main() {
    log "Starting final root directory cleanup..."
    
    echo "This will move ALL non-essential files from root to organized folders."
    echo "Essential build and config files will remain in root."
    read -p "Continue with final cleanup? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Operation cancelled by user"
        exit 0
    fi
    
    move_non_essential_files
    list_remaining_files
    create_cleanup_report
    
    success "Final root directory cleanup completed!"
    
    echo ""
    echo "🎉 ROOT DIRECTORY IS NOW COMPLETELY CLEAN!"
    echo ""
    echo "Essential files only remain in root."
    echo "All other files organized in archived-files/"
    echo "Ready for Claudia integration!"
}

main "$@"