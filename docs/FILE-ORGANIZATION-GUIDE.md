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
