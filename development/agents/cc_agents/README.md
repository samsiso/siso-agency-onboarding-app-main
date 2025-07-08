# Claude Agents for siso-agency-onboarding-app-main-dev

This directory contains Claude Code agents that are automatically synchronized across all your projects.

## Available Agents

### AI Integration Agent
- **File**: `ai-integration-agent.claudia.json`
- **Icon**: bot
- **Model**: opus
- **Task**: Integrate AI capabilities with RAG system and optimized prompts

### Browser Testing Agent
- **File**: `browser-testing-agent.claudia.json`
- **Icon**: globe
- **Model**: sonnet
- **Task**: Create comprehensive E2E tests for the application with visual regression testing

### CI/CD Pipeline Agent
- **File**: `ci-cd-pipeline-agent.claudia.json`
- **Icon**: git-branch
- **Model**: sonnet
- **Task**: Set up comprehensive CI/CD pipeline with automated testing and deployment

### Git Commit Bot
- **File**: `git-commit-bot.claudia.json`
- **Icon**: bot
- **Model**: sonnet
- **Task**: Push all changes.

### Performance Optimization Agent
- **File**: `performance-optimization-agent.claudia.json`
- **Icon**: code
- **Model**: sonnet
- **Task**: Analyze and optimize application performance across all layers

### Security Hardening Agent
- **File**: `security-hardening-agent.claudia.json`
- **Icon**: shield
- **Model**: opus
- **Task**: Perform comprehensive security audit and implement hardening measures

### security-scanner.claudia.json
- **File**: `security-scanner.claudia.json`
- **Status**: Available (parsing error in README generation)

### Supabase Master Agent
- **File**: `supabase-master-agent.claudia.json`
- **Icon**: database
- **Model**: opus
- **Task**: Set up a new Supabase project with authentication, database schema, and Edge Functions

### UI/UX Design Agent (21st.dev)
- **File**: `ui-ux-design-agent.claudia.json`
- **Icon**: code
- **Model**: opus
- **Task**: Create a modern, accessible component library with 21st.dev

### Unit Tests Bot
- **File**: `unit-tests-bot.claudia.json`
- **Icon**: code
- **Model**: opus
- **Task**: Generate unit tests for this codebase.

## How to Use

1. Open Claude Code in this project directory
2. Use `/agent` command to see available agents
3. Select an agent and it will be context-aware for this specific project

## Auto-Sync

These agents are automatically distributed from the `claudia-main` project. To update:

1. Modify agents in `claudia-main/cc_agents/`
2. Run: `node claudia-main/distribute-agents.js`
3. All projects will get the updated agents

## MCP Integration

All agents have access to the same MCP servers:
- Sentry (error monitoring)
- Supabase (database operations) 
- GitHub, Brave Search, Notion
- And 9 more powerful tools

Generated on: 2025-07-06T15:38:17.192Z
