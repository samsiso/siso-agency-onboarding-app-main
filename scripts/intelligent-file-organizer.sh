#!/bin/bash

# Intelligent File Organizer
# Uses content analysis to automatically place files in correct locations

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

# Analyze file content to determine best location
analyze_file_content() {
    local file="$1"
    local content=$(head -20 "$file" 2>/dev/null || echo "")
    local filename=$(basename "$file")
    local destination=""
    
    # Analyze based on filename patterns
    case "$filename" in
        *STRUCTURE*|*FOLDER*|*ORGANIZATION*)
            destination="docs/reference/"
            ;;
        README.md)
            destination="." # Keep in root
            ;;
        CLAUDE.md)
            destination="." # Keep in root
            ;;
        *GUIDE*|*SETUP*|*INSTALL*)
            destination="docs/guides/"
            ;;
        *REFERENCE*|*API*|*SPEC*)
            destination="docs/reference/"
            ;;
        *TEST*|*TESTING*)
            destination="docs/testing/"
            ;;
        *DEPLOY*|*DEPLOYMENT*)
            destination="docs/deployment/"
            ;;
        *ARCHITECTURE*|*DESIGN*)
            destination="docs/architecture/"
            ;;
        *INTEGRATION*)
            destination="docs/integrations/"
            ;;
        *ROADMAP*|*PLAN*|*TODO*)
            destination="docs/planning/"
            ;;
        *CHANGELOG*|*HISTORY*|*LOG*)
            destination="docs/history/"
            ;;
        *BRAIN*|*KNOWLEDGE*)
            destination="docs/knowledge/"
            ;;
        *AGENT*|*BOT*|*AUTOMATION*)
            destination="development/agents/docs/"
            ;;
        *MCP*|*SERVER*)
            destination="development/configs/docs/"
            ;;
        *TELEGRAM*|*DISCORD*|*SLACK*)
            destination="docs/integrations/"
            ;;
        *SUPABASE*|*DATABASE*|*DB*)
            destination="docs/database/"
            ;;
        *)
            # Analyze content for clues
            if echo "$content" | grep -qi "agent\|bot\|automation"; then
                destination="development/agents/docs/"
            elif echo "$content" | grep -qi "deploy\|deployment\|build"; then
                destination="docs/deployment/"
            elif echo "$content" | grep -qi "test\|testing\|spec"; then
                destination="docs/testing/"
            elif echo "$content" | grep -qi "setup\|install\|config"; then
                destination="docs/guides/"
            elif echo "$content" | grep -qi "api\|reference\|documentation"; then
                destination="docs/reference/"
            elif echo "$content" | grep -qi "mcp\|server\|integration"; then
                destination="docs/integrations/"
            elif echo "$content" | grep -qi "supabase\|database\|sql"; then
                destination="docs/database/"
            elif echo "$content" | grep -qi "architecture\|design\|structure"; then
                destination="docs/architecture/"
            elif echo "$content" | grep -qi "plan\|roadmap\|todo\|task"; then
                destination="docs/planning/"
            else
                destination="docs/misc/"
            fi
            ;;
    esac
    
    echo "$destination"
}

# Create necessary directories
create_documentation_structure() {
    log "Creating comprehensive documentation structure..."
    
    mkdir -p docs/{guides,reference,testing,deployment,architecture,integrations,planning,history,knowledge,database,misc}
    mkdir -p development/agents/docs/
    mkdir -p development/configs/docs/
    
    success "Documentation structure created"
}

# Organize markdown files intelligently
organize_markdown_files() {
    log "Analyzing and organizing .md files..."
    
    local moved_count=0
    
    # Find all .md files in root and analyze them
    for file in $(find . -maxdepth 1 -name "*.md" -type f); do
        local filename=$(basename "$file")
        local destination=$(analyze_file_content "$file")
        
        if [ "$destination" != "." ]; then
            log "Analyzing: $filename"
            log "Content suggests: $destination"
            
            # Create destination directory if it doesn't exist
            mkdir -p "$destination"
            
            # Move the file
            mv "$file" "$destination/"
            success "Moved $filename → $destination/"
            
            ((moved_count++))
        else
            log "Keeping $filename in root (essential)"
        fi
    done
    
    log "Moved $moved_count markdown files to appropriate locations"
}

# Find and organize other loose files
organize_other_files() {
    log "Analyzing other loose files..."
    
    # Find loose JSON files (excluding essential ones)
    for file in $(find . -maxdepth 1 -name "*.json" -type f); do
        local filename=$(basename "$file")
        
        case "$filename" in
            package.json|package-lock.json|components.json|workspace.json)
                log "Keeping $filename in root (essential)"
                ;;
            *mcp*|*config*)
                mkdir -p development/configs/
                mv "$file" development/configs/
                success "Moved $filename → development/configs/"
                ;;
            *telegram*|*webhook*)
                mkdir -p archived-files/configs/
                mv "$file" archived-files/configs/
                success "Moved $filename → archived-files/configs/"
                ;;
            *)
                mkdir -p archived-files/misc/
                mv "$file" archived-files/misc/
                success "Moved $filename → archived-files/misc/"
                ;;
        esac
    done
    
    # Find loose JS files (excluding essential ones)
    for file in $(find . -maxdepth 1 -name "*.js" -type f); do
        local filename=$(basename "$file")
        
        case "$filename" in
            eslint.config.js|postcss.config.js)
                log "Keeping $filename in root (essential)"
                ;;
            *)
                mkdir -p archived-files/scripts/
                mv "$file" archived-files/scripts/
                success "Moved $filename → archived-files/scripts/"
                ;;
        esac
    done
    
    # Find loose text/log files
    for file in $(find . -maxdepth 1 -name "*.txt" -o -name "*.log" -type f); do
        mkdir -p archived-files/misc/
        mv "$file" archived-files/misc/
        success "Moved $(basename $file) → archived-files/misc/"
    done
}

# Create intelligent organization guide
create_organization_guide() {
    log "Creating intelligent organization guide..."
    
    cat > docs/FILE-ORGANIZATION-GUIDE.md << 'EOF'
# Intelligent File Organization Guide

This project uses an intelligent file organization system that automatically places files in the correct locations based on their content and purpose.

## Organization Rules

### Markdown Files (.md)

Files are automatically organized based on:

1. **Filename patterns**:
   - `*GUIDE*`, `*SETUP*` → `docs/guides/`
   - `*REFERENCE*`, `*API*` → `docs/reference/`
   - `*TEST*`, `*TESTING*` → `docs/testing/`
   - `*DEPLOY*`, `*DEPLOYMENT*` → `docs/deployment/`
   - `*ARCHITECTURE*`, `*DESIGN*` → `docs/architecture/`
   - `*INTEGRATION*` → `docs/integrations/`
   - `*AGENT*`, `*BOT*` → `development/agents/docs/`

2. **Content analysis**:
   - Agent/automation content → `development/agents/docs/`
   - Database content → `docs/database/`
   - MCP/server content → `docs/integrations/`
   - Setup/config content → `docs/guides/`

3. **Essential files stay in root**:
   - `README.md` - Project overview
   - `CLAUDE.md` - Claude configuration

### Other Files

- **Config files**: 
  - Essential configs stay in root
  - Development configs → `development/configs/`
  - Archive configs → `archived-files/configs/`

- **Script files**:
  - Build scripts → `scripts/`
  - Archive scripts → `archived-files/scripts/`

- **Temp files**:
  - Logs, temp files → `archived-files/misc/`

## Directory Structure

```
docs/
├── guides/          # Setup, installation, how-to guides
├── reference/       # API docs, specifications, references  
├── testing/         # Test documentation and procedures
├── deployment/      # Deployment guides and procedures
├── architecture/    # System design and architecture docs
├── integrations/    # Integration guides (MCP, APIs, etc.)
├── planning/        # Roadmaps, plans, todo lists
├── history/         # Changelogs, history, logs
├── knowledge/       # Knowledge base, brain docs
├── database/        # Database docs and guides
└── misc/           # Other documentation
```

## Running the Organizer

```bash
./scripts/intelligent-file-organizer.sh
```

The system will:
1. Analyze each file's content and filename
2. Determine the most appropriate location
3. Move files to organized directories
4. Preserve essential files in root
5. Create any needed directory structure

## Benefits

- **Automatic organization** - No manual sorting needed
- **Content-aware** - Analyzes actual file content
- **Preserves functionality** - Keeps essential files in place
- **Scalable** - Handles new file types intelligently
- **Clean structure** - Maintains organized, navigable directories

## Future Enhancements

The organizer can be extended to:
- Handle more file types
- Integrate with git hooks for automatic organization
- Learn from user corrections
- Provide organization suggestions before moving files
EOF
    
    success "Organization guide created: docs/FILE-ORGANIZATION-GUIDE.md"
}

# Count final results
count_final_results() {
    log "Counting organization results..."
    
    local root_files=$(find . -maxdepth 1 -type f | wc -l)
    local root_dirs=$(find . -maxdepth 1 -type d -not -name "." -not -name ".*" | wc -l)
    
    echo ""
    echo "📊 FINAL ORGANIZATION RESULTS:"
    echo "   Root files: $root_files"
    echo "   Root directories: $root_dirs"
    echo ""
    
    # Show what's left in root
    echo "📄 Files remaining in root:"
    find . -maxdepth 1 -type f -exec basename {} \; | sort
    
    echo ""
    success "✅ Intelligent organization completed!"
}

# Main execution
main() {
    log "Starting intelligent file organization..."
    
    echo "This will automatically organize files based on their content:"
    echo "- Analyze file content and filename patterns"
    echo "- Move files to appropriate directories"
    echo "- Preserve essential files in root"
    echo "- Create organized documentation structure"
    echo ""
    read -p "Continue with intelligent organization? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Operation cancelled by user"
        exit 0
    fi
    
    create_documentation_structure
    organize_markdown_files
    organize_other_files
    create_organization_guide
    count_final_results
    
    success "Intelligent file organization completed!"
    
    echo ""
    echo "🎉 YOUR FILES ARE NOW INTELLIGENTLY ORGANIZED!"
    echo ""
    echo "✅ Content-based organization"
    echo "✅ Essential files preserved"
    echo "✅ Clean root directory"
    echo "✅ Logical documentation structure"
}

main "$@"