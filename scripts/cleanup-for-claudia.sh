#!/bin/bash

# Cleanup Script for SISO Agency + Claudia Integration
# This script organizes the codebase for clean Claudia integration

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

# Backup current state
create_backup() {
    log "Creating backup of current state..."
    local backup_dir="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup critical files
    cp -r src/ "$backup_dir/" 2>/dev/null || true
    cp package.json "$backup_dir/" 2>/dev/null || true
    cp vite.config.ts "$backup_dir/" 2>/dev/null || true
    cp tsconfig.json "$backup_dir/" 2>/dev/null || true
    cp tailwind.config.ts "$backup_dir/" 2>/dev/null || true
    
    success "Backup created in $backup_dir"
}

# Move SISO agency files to project directory
organize_siso_agency() {
    log "Organizing SISO agency files..."
    
    local siso_dir="projects/siso-agency-web"
    
    # Move source files
    if [ -d "src" ]; then
        cp -r src/ "$siso_dir/"
        success "Moved src/ to $siso_dir/"
    fi
    
    # Move public assets
    if [ -d "public" ]; then
        cp -r public/ "$siso_dir/"
        success "Moved public/ to $siso_dir/"
    fi
    
    # Copy configuration files
    cp vite.config.ts "$siso_dir/" 2>/dev/null || true
    cp tsconfig.json "$siso_dir/" 2>/dev/null || true
    cp tailwind.config.ts "$siso_dir/" 2>/dev/null || true
    cp components.json "$siso_dir/" 2>/dev/null || true
    
    # Create SISO agency specific package.json
    cat > "$siso_dir/package.json" << 'EOF'
{
  "name": "siso-agency-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 2222",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.54.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/modifiers": "^9.0.0",
    "@heroicons/react": "^2.1.2",
    "@hookform/resolvers": "^5.0.1",
    "@notionhq/client": "^3.1.3",
    "@octokit/rest": "^22.0.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@solana/web3.js": "^1.98.0",
    "@splinetool/react-spline": "^4.0.0",
    "@splinetool/runtime": "^1.9.59",
    "@supabase/auth-helpers-react": "^0.5.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/auth-ui-shared": "^0.1.8",
    "@supabase/supabase-js": "^2.49.4",
    "@tabler/icons-react": "^3.29.0",
    "@tanstack/react-query": "^5.56.2",
    "@tanstack/react-table": "^8.21.3",
    "@uidotdev/usehooks": "^2.4.1",
    "bn.js": "^5.2.1",
    "canvas-confetti": "^1.9.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "cobe": "^0.6.3",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.5.2",
    "express": "^4.18.2",
    "form-data": "^4.0.0",
    "framer-motion": "^12.9.1",
    "groq-sdk": "^0.26.0",
    "input-otp": "^1.2.4",
    "jotai": "^2.12.3",
    "lucide-react": "^0.474.0",
    "moralis": "^2.25.2",
    "next": "^15.3.4",
    "next-themes": "^0.3.0",
    "node-cron": "^4.1.1",
    "node-fetch": "^2.6.7",
    "notion-to-md": "^3.1.9",
    "openai": "^5.5.0",
    "qrcode-terminal": "^0.12.0",
    "react": "^18.3.1",
    "react-countup": "^6.5.3",
    "react-day-picker": "^8.10.1",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.2.3",
    "react-error-boundary": "^4.1.2",
    "react-helmet": "^6.1.0",
    "react-hook-form": "^7.53.0",
    "react-hot-toast": "^2.5.1",
    "react-hotkeys-hook": "^4.6.1",
    "react-intersection-observer": "^9.16.0",
    "react-resizable-panels": "^2.1.3",
    "react-router-dom": "^6.26.2",
    "react-tsparticles": "^2.12.2",
    "reactflow": "^11.11.4",
    "reaviz": "^16.0.4",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "tsparticles": "^3.8.1",
    "tsparticles-slim": "^2.12.0",
    "uuid": "^9.0.1",
    "vaul": "^0.9.3",
    "whatsapp-web.js": "^1.30.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.8.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  }
}
EOF
    
    success "SISO agency project organized in $siso_dir/"
}

# Create placeholder for Claudia project
prepare_claudia_directory() {
    log "Preparing Claudia desktop project directory..."
    
    local claudia_dir="projects/claudia-desktop"
    
    # Create placeholder package.json for Claudia
    cat > "$claudia_dir/package.json" << 'EOF'
{
  "name": "claudia-desktop",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "dependencies": {
    "@tauri-apps/api": "^2",
    "@tauri-apps/plugin-dialog": "^2",
    "@tauri-apps/plugin-shell": "^2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-tabs": "^1.1.2",
    "framer-motion": "^11.3.21",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^4.0.0-alpha.20",
    "lucide-react": "^0.474.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
EOF
    
    # Create placeholder README
    cat > "$claudia_dir/README.md" << 'EOF'
# Claudia Desktop Integration

This directory will contain the Claudia desktop application files.

## Integration Steps (TODO)

1. Copy Claudia source files to this directory
2. Update import paths to use shared components
3. Test Tauri build process
4. Verify all Claudia features work
5. Update deployment scripts

## Structure

```
claudia-desktop/
├── src/                    # React frontend
├── src-tauri/             # Rust backend
├── package.json           # Dependencies
└── tauri.conf.json        # Tauri configuration
```

## Commands

```bash
npm run tauri:dev          # Development
npm run tauri:build        # Production build
```
EOF
    
    success "Claudia project directory prepared"
}

# Create shared components structure
create_shared_structure() {
    log "Creating shared components structure..."
    
    local shared_dir="projects/shared"
    
    # Create directories
    mkdir -p "$shared_dir/src/components"
    mkdir -p "$shared_dir/src/hooks"
    mkdir -p "$shared_dir/src/types"
    mkdir -p "$shared_dir/src/utils"
    
    # Create package.json for shared components
    cat > "$shared_dir/package.json" << 'EOF'
{
  "name": "siso-shared",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.474.0",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^9.9.0",
    "typescript": "^5.5.3"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
EOF
    
    # Create shared index file
    cat > "$shared_dir/src/index.ts" << 'EOF'
// Shared components exports
export * from './components';
export * from './hooks';
export * from './types';
export * from './utils';
EOF
    
    success "Shared components structure created"
}

# Move docs to organized structure
organize_documentation() {
    log "Organizing documentation..."
    
    # Keep docs directory but create better structure
    mkdir -p docs/projects/siso-agency
    mkdir -p docs/projects/claudia
    mkdir -p docs/projects/shared
    
    # Create integration documentation
    cat > docs/projects/INTEGRATION-GUIDE.md << 'EOF'
# SISO Agency + Claudia Integration Guide

This guide covers the integration of Claudia desktop app with SISO Agency platform.

## Project Structure

- `projects/siso-agency-web/` - Main agency web application
- `projects/claudia-desktop/` - Claudia desktop application
- `projects/shared/` - Shared components and utilities

## Integration Steps

1. **Code Organization**: Move existing code to project directories
2. **Dependency Management**: Set up project-specific dependencies
3. **Shared Components**: Extract reusable components to shared library
4. **Build System**: Configure independent builds for each project
5. **Testing**: Verify both projects work independently and together

## Development Workflow

1. Work on projects independently using project-specific scripts
2. Build and test projects separately
3. Use shared components for common UI elements
4. Deploy projects to their respective platforms

## Next Steps

- [ ] Complete code migration to projects/
- [ ] Set up Claudia integration
- [ ] Test independent builds
- [ ] Update deployment workflows
EOF
    
    success "Documentation organized"
}

# Clean up root directory
clean_root_directory() {
    log "Cleaning up root directory..."
    
    # Move config files to configs directory
    mv *.config.* configs/ 2>/dev/null || true
    mv *.json configs/ 2>/dev/null || true
    mv *.md configs/ 2>/dev/null || true
    
    # Keep essential files in root
    mv configs/package.json . 2>/dev/null || true
    mv configs/workspace.json . 2>/dev/null || true
    mv configs/README.md . 2>/dev/null || true
    
    success "Root directory cleaned up"
}

# Main execution
main() {
    log "Starting SISO Agency + Claudia integration cleanup..."
    
    # Ask for confirmation
    echo "This script will reorganize your codebase for Claudia integration."
    echo "A backup will be created before making changes."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Operation cancelled by user"
        exit 0
    fi
    
    create_backup
    organize_siso_agency
    prepare_claudia_directory
    create_shared_structure
    organize_documentation
    
    success "Cleanup completed successfully!"
    
    echo ""
    echo "Next steps:"
    echo "1. Test the SISO agency project: npm run project:siso:dev"
    echo "2. Copy Claudia files to projects/claudia-desktop/"
    echo "3. Run: npm run project:claudia:dev"
    echo "4. Extract shared components to projects/shared/"
    echo ""
    echo "Your codebase is now ready for Claudia integration!"
}

main "$@"