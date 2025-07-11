# SISO Agency Platform with Claudia Integration

## Overview
The SISO Agency Platform now includes full Claudia desktop integration, providing direct access to Claude Code functionality through a Tauri-based desktop application.

## Prerequisites
1. **Rust** - Install from [rustup.rs](https://rustup.rs/)
2. **Node.js** - Version 18 or higher
3. **Claude Code CLI** - Must be installed and accessible in your PATH

## Setup Instructions

### 1. Install Dependencies
```bash
# Install Node dependencies including Tauri
npm install

# The Tauri CLI is now included in devDependencies
```

### 2. Run in Development Mode
```bash
# Run the Tauri desktop app in development mode
npm run tauri:dev
```

This will:
- Start the Vite development server on http://localhost:5173
- Launch the Tauri desktop application
- Enable hot reload for both frontend and backend changes

### 3. Build for Production
```bash
# Build the desktop application
npm run tauri:build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`

## Using Claudia Integration

### Access Dev Tools
1. Launch the app using `npm run tauri:dev`
2. Navigate to the Dev Tools page from the sidebar
3. Click on "Claudia CC Agents" to access the integrated Claude Code functionality

### Features Available
- **Real Claude Code Integration**: Direct access to Claude Code CLI
- **Agent Management**: Create and manage AI agents
- **Project Management**: View and manage Claude Code projects
- **Session History**: Access past Claude Code sessions
- **MCP Integration**: Full Model Context Protocol support
- **Live Execution**: Run Claude Code commands directly from the UI

### Key Differences from Web Version
- **Desktop Native**: Runs as a desktop application, not in browser
- **No API Keys Required**: Uses your existing Claude Code installation
- **Full System Access**: Can access local files and run system commands
- **Real-time Updates**: Live streaming of Claude Code output

## Troubleshooting

### "Failed to connect to Claudia backend"
- Ensure you're running the app with `npm run tauri:dev`, not `npm run dev`
- The regular web dev server cannot access Tauri APIs

### "Claude Code not found"
- Make sure Claude Code CLI is installed: `npm install -g @anthropic/claude-cli`
- Verify it's accessible: `claude --version`

### Build Errors
- Ensure Rust is properly installed: `rustc --version`
- Update Rust if needed: `rustup update`
- Clear build cache: `rm -rf src-tauri/target`

## Development Notes

### File Structure
```
siso-agency-onboarding-app/
├── src/                      # React frontend
│   ├── components/
│   │   ├── claudia/         # Claudia-specific components
│   │   └── dev-tools/       # Dev tools components
│   └── lib/
│       └── claudia-api.ts   # Claudia API interface
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── commands/        # Tauri command handlers
│   │   ├── claude_binary.rs # Claude Code integration
│   │   └── main.rs          # Main Tauri application
│   └── Cargo.toml           # Rust dependencies
```

### API Usage
The Claudia API is available through:
```typescript
import claudiaApi from "@/lib/claudia-api";

// Check Claude version
const version = await claudiaApi.checkClaudeVersion();

// List projects
const projects = await claudiaApi.listProjects();

// Open new session
await claudiaApi.openNewSession("/path/to/project");
```

## Security Notes
- The Tauri app runs with full system permissions
- Claude Code commands are executed in a sandboxed environment
- File system access is controlled through Tauri's permission system

## Next Steps
1. Customize the UI to match your workflow
2. Add keyboard shortcuts for common operations
3. Integrate with your existing SISO agency workflows
4. Configure MCP servers for additional capabilities