# 🏗️ Multi-Project Structure for SISO Agency + Claudia Integration

This directory contains the organized project structure for the SISO Agency platform with Claudia desktop integration support.

## 📁 Project Structure

```
projects/
├── siso-agency-web/          # Main SISO agency web application
│   ├── src/                  # Source code from main src/
│   ├── public/               # Public assets  
│   ├── package.json          # Web app dependencies
│   └── vite.config.ts        # Web app build config
├── claudia-desktop/          # Claudia desktop app integration
│   ├── src/                  # Claudia React frontend
│   ├── src-tauri/            # Tauri Rust backend
│   ├── package.json          # Claudia dependencies
│   └── tauri.conf.json       # Tauri configuration
└── shared/                   # Shared components and utilities
    ├── components/           # Reusable UI components
    ├── hooks/               # Shared React hooks
    ├── types/               # TypeScript type definitions
    └── utils/               # Utility functions
```

## 🚀 Getting Started

### Building Individual Projects

Use the new build system to work with specific projects:

```bash
# SISO Agency Web App
npm run project:siso:dev          # Start development server
npm run project:siso:build        # Build production bundle

# Claudia Desktop App  
npm run project:claudia:dev        # Start Tauri development
npm run project:claudia:build      # Build desktop app

# Shared Components
npm run project:shared:build       # Build shared library
```

### Building All Projects

```bash
npm run projects:build:all         # Build all projects
npm run projects:lint:all          # Lint all projects
npm run projects:clean:all         # Clean all build artifacts
```

### Manual Build Script Usage

You can also use the build script directly:

```bash
# Development
./scripts/build-projects.sh siso-agency dev
./scripts/build-projects.sh claudia dev

# Production builds
./scripts/build-projects.sh siso-agency build
./scripts/build-projects.sh claudia build

# Utilities
./scripts/build-projects.sh all lint
./scripts/build-projects.sh all clean
```

## 🔧 Project Configuration

### SISO Agency Web App (projects/siso-agency-web/)
- **Framework**: Vite + React + TypeScript
- **Port**: 2222 (configured in vite.config.ts)
- **Build Output**: dist/siso-agency/
- **Features**: Full agency platform with client management, tasks, Instagram leads

### Claudia Desktop App (projects/claudia-desktop/)
- **Framework**: Tauri + React + TypeScript
- **Backend**: Rust with SQLite
- **Build Output**: dist/claudia-desktop/
- **Features**: Desktop GUI for Claude Code with agent management

### Shared Library (projects/shared/)
- **Purpose**: Common components and utilities
- **Build Output**: dist/shared/
- **Usage**: Imported by both siso-agency and claudia projects

## 🛠️ Development Workflow

1. **Start Development**: Use `npm run project:siso:dev` or `npm run project:claudia:dev`
2. **Make Changes**: Edit files in the respective project directories
3. **Build**: Use `npm run project:PROJECT:build` to build specific projects
4. **Test**: Run linting and tests before committing
5. **Deploy**: Use project-specific deployment scripts

## 📦 Dependency Management

Each project has its own `package.json`:
- **Root package.json**: Contains build scripts and shared dev dependencies
- **Project package.json**: Contains project-specific dependencies
- **Shared package.json**: Contains shared utility dependencies

## 🔄 Migration Status

- ✅ Multi-project build system created
- ✅ Directory structure organized
- ✅ Build scripts configured
- ⏳ Move existing code to project folders (next step)
- ⏳ Integrate Claudia code
- ⏳ Test both projects independently

## 📝 Next Steps

1. Move existing SISO agency code to `projects/siso-agency-web/`
2. Move Claudia code to `projects/claudia-desktop/`
3. Extract shared components to `projects/shared/`
4. Update import paths in both projects
5. Test independent builds
6. Update deployment configurations

## 🎯 Benefits

- **Separation of Concerns**: Each project has its own build configuration
- **Independent Development**: Work on SISO agency and Claudia separately
- **Shared Components**: Reuse common code across projects
- **Scalable Architecture**: Easy to add new projects in the future
- **Clean Organization**: Clear project boundaries and responsibilities