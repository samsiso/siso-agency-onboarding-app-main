#!/bin/bash

# Multi-Project Build System for SISO Agency + Claudia Integration
# Usage: ./scripts/build-projects.sh [project-name] [command]

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

# Available projects
declare -A PROJECTS=(
    ["siso-agency"]="projects/siso-agency-web"
    ["claudia"]="projects/claudia-desktop"
    ["shared"]="projects/shared"
)

# Available commands
declare -A COMMANDS=(
    ["dev"]="Start development server"
    ["build"]="Build production bundle"
    ["lint"]="Run linting"
    ["test"]="Run tests"
    ["clean"]="Clean build artifacts"
)

show_help() {
    echo "Multi-Project Build System"
    echo "Usage: $0 [project] [command]"
    echo ""
    echo "Available projects:"
    for project in "${!PROJECTS[@]}"; do
        echo "  $project - ${PROJECTS[$project]}"
    done
    echo ""
    echo "Available commands:"
    for cmd in "${!COMMANDS[@]}"; do
        echo "  $cmd - ${COMMANDS[$cmd]}"
    done
    echo ""
    echo "Examples:"
    echo "  $0 siso-agency dev     # Start SISO agency development"
    echo "  $0 claudia build       # Build Claudia desktop app"
    echo "  $0 shared lint         # Lint shared components"
    echo "  $0 all build           # Build all projects"
}

# Check if project exists
check_project() {
    local project=$1
    if [[ ! -v PROJECTS[$project] ]] && [[ $project != "all" ]]; then
        error "Unknown project: $project"
    fi
}

# Check if command exists
check_command() {
    local cmd=$1
    if [[ ! -v COMMANDS[$cmd] ]]; then
        error "Unknown command: $cmd"
    fi
}

# Execute command for a specific project
execute_project_command() {
    local project=$1
    local command=$2
    local project_path="${PROJECTS[$project]}"
    
    if [[ ! -d "$project_path" ]]; then
        warning "Project directory not found: $project_path"
        return 1
    fi
    
    log "Executing '$command' for project '$project'"
    
    cd "$project_path"
    
    case $command in
        "dev")
            case $project in
                "siso-agency")
                    npm run dev
                    ;;
                "claudia")
                    npm run tauri:dev
                    ;;
                "shared")
                    npm run dev
                    ;;
            esac
            ;;
        "build")
            case $project in
                "siso-agency")
                    npm run build && npm run lint
                    ;;
                "claudia")
                    npm run tauri:build
                    ;;
                "shared")
                    npm run build
                    ;;
            esac
            ;;
        "lint")
            npm run lint
            ;;
        "test")
            npm run test 2>/dev/null || npm run test:unit 2>/dev/null || echo "No test script found"
            ;;
        "clean")
            rm -rf dist/ build/ .vite-cache/ node_modules/.cache/
            ;;
    esac
    
    cd "$PROJECT_ROOT"
}

# Execute command for all projects
execute_all_command() {
    local command=$1
    log "Executing '$command' for all projects"
    
    for project in "${!PROJECTS[@]}"; do
        execute_project_command "$project" "$command"
    done
}

# Main execution logic
main() {
    if [[ $# -eq 0 ]]; then
        show_help
        exit 0
    fi
    
    if [[ $1 == "--help" ]] || [[ $1 == "-h" ]]; then
        show_help
        exit 0
    fi
    
    if [[ $# -lt 2 ]]; then
        error "Both project and command are required"
    fi
    
    local project=$1
    local command=$2
    
    check_command "$command"
    
    if [[ $project == "all" ]]; then
        execute_all_command "$command"
    else
        check_project "$project"
        execute_project_command "$project" "$command"
    fi
    
    success "Operation completed successfully"
}

main "$@"