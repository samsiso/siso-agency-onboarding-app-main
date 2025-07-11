# Claude Code Agent Capabilities Reference - SISO Agency Platform

## 🤖 Agent Overview
This document provides a comprehensive reference of all capabilities, tools, and actions available to the Claude Code agent for the SISO Agency Onboarding Platform.

## 📋 **CORE CAPABILITIES SUMMARY**

### 1. **File System Operations**
- ✅ Read files with line-based navigation
- ✅ Write/create new files
- ✅ Edit existing files with precise replacements
- ✅ Multi-file editing in single operations
- ✅ Directory listing and navigation
- ✅ File searching by name patterns
- ✅ Content searching with regex support

### 2. **Database Operations (Supabase)**
- ✅ List projects and organizations
- ✅ Execute SQL queries and migrations
- ✅ List and manage database tables
- ✅ Generate TypeScript types
- ✅ Deploy Edge Functions
- ✅ Get project URLs and API keys
- ✅ Search Supabase documentation
- ⚠️ **Requires authentication token for full access**

### 3. **Development Workflow**
- ✅ Run build, lint, and development commands
- ✅ Execute any bash/shell commands
- ✅ Git operations (status, commit, push, PR creation)
- ✅ Package management (npm, yarn commands)
- ✅ Process monitoring and termination

### 4. **Web & Browser Operations**
- ✅ Navigate to any URL
- ✅ Take screenshots of pages
- ✅ Click elements and fill forms
- ✅ Execute JavaScript in browser
- ✅ Handle file uploads and downloads
- ✅ Generate Playwright tests

### 5. **Task & Project Management**
- ✅ Create and manage todo lists
- ✅ Request planning with task breakdown
- ✅ Track task completion and progress
- ✅ Generate comprehensive plans

### 6. **UI Component Generation**
- ✅ Create React components with TypeScript
- ✅ Search and integrate UI components from 21st.dev
- ✅ Generate company logos (JSX/TSX/SVG)
- ✅ Refine and improve existing components

### 7. **AI & Analysis**
- ✅ Sequential thinking for complex problems
- ✅ Web search for current information
- ✅ Fetch and analyze web content
- ✅ Code analysis and optimization

## 🛠️ **DETAILED TOOL INVENTORY**

### **File System Tools**
```typescript
// Core file operations
Read(file_path, offset?, limit?)              // Read files with pagination
Write(file_path, content)                     // Create/overwrite files
Edit(file_path, old_string, new_string)       // Precise text replacement
MultiEdit(file_path, edits[])                 // Multiple edits in one operation
LS(path, ignore?)                             // List directory contents
Glob(pattern, path?)                          // Find files by pattern
Grep(pattern, options)                        // Search file contents

// Specialized file tools
NotebookRead(notebook_path, cell_id?)         // Read Jupyter notebooks
NotebookEdit(notebook_path, new_source)       // Edit notebook cells
```

### **Development Tools**
```typescript
// Build & execution
Bash(command, description, timeout?)         // Execute shell commands
Task(description, prompt)                    // Launch specialized agent

// Code quality
exit_plan_mode(plan)                         // Exit planning mode to execute
```

### **Supabase MCP Tools**
```typescript
// Project management
mcp__supabase__list_projects()
mcp__supabase__get_project(id)
mcp__supabase__create_project(name, org_id, region)
mcp__supabase__pause_project(project_id)
mcp__supabase__restore_project(project_id)

// Database operations
mcp__supabase__list_tables(project_id, schemas?)
mcp__supabase__execute_sql(project_id, query)
mcp__supabase__apply_migration(project_id, name, query)
mcp__supabase__generate_typescript_types(project_id)

// Branch management
mcp__supabase__create_branch(project_id, name)
mcp__supabase__list_branches(project_id)
mcp__supabase__delete_branch(branch_id)
mcp__supabase__merge_branch(branch_id)

// Edge Functions
mcp__supabase__list_edge_functions(project_id)
mcp__supabase__deploy_edge_function(project_id, name, files)

// Utilities
mcp__supabase__get_project_url(project_id)
mcp__supabase__get_anon_key(project_id)
mcp__supabase__search_docs(graphql_query)
mcp__supabase__get_logs(project_id, service)
mcp__supabase__get_advisors(project_id, type)
```

### **Task Management Tools**
```typescript
// Todo system
TodoWrite(todos[])                           // Create/update todo lists

// Project planning
mcp__mcp-taskmanager__request_planning(originalRequest, tasks)
mcp__mcp-taskmanager__get_next_task(requestId)
mcp__mcp-taskmanager__mark_task_done(requestId, taskId)
mcp__mcp-taskmanager__approve_task_completion(requestId, taskId)
mcp__mcp-taskmanager__approve_request_completion(requestId)
```

### **UI Component Tools**
```typescript
// Component generation
mcp___21st-dev_magic__21st_magic_component_builder(message, searchQuery, paths)
mcp___21st-dev_magic__21st_magic_component_inspiration(message, searchQuery)
mcp___21st-dev_magic__21st_magic_component_refiner(userMessage, filePath, context)

// Logo generation
mcp___21st-dev_magic__logo_search(queries[], format)  // JSX, TSX, SVG formats
```

### **Browser Automation Tools**
```typescript
// Navigation & interaction
mcp__playwright-mcp__browser_navigate(url)
mcp__playwright-mcp__browser_click(element, ref)
mcp__playwright-mcp__browser_type(element, ref, text)
mcp__playwright-mcp__browser_hover(element, ref)

// Screenshots & analysis
mcp__playwright-mcp__browser_take_screenshot(filename?, element?, ref?)
mcp__playwright-mcp__browser_snapshot()              // Accessibility snapshot

// Tab management
mcp__playwright-mcp__browser_tab_new(url?)
mcp__playwright-mcp__browser_tab_select(index)
mcp__playwright-mcp__browser_tab_close(index?)

// Testing
mcp__playwright-mcp__browser_generate_playwright_test(name, description, steps)
```

### **Desktop Commander Tools**
```typescript
// Enhanced file operations
mcp__desktop-commander__read_file(path, offset?, length?)
mcp__desktop-commander__write_file(path, content, mode?)
mcp__desktop-commander__read_multiple_files(paths[])
mcp__desktop-commander__edit_block(file_path, old_string, new_string)

// Directory operations
mcp__desktop-commander__create_directory(path)
mcp__desktop-commander__list_directory(path)
mcp__desktop-commander__move_file(source, destination)

// Search operations
mcp__desktop-commander__search_files(path, pattern)
mcp__desktop-commander__search_code(path, pattern, options)

// System operations
mcp__desktop-commander__execute_command(command, timeout_ms)
mcp__desktop-commander__list_processes()
mcp__desktop-commander__kill_process(pid)
```

### **Analysis & AI Tools**
```typescript
// Problem solving
mcp__Sequential_Thinking__sequentialthinking(thought, nextThoughtNeeded, thoughtNumber)

// Web operations
WebSearch(query, allowed_domains?, blocked_domains?)
WebFetch(url, prompt)
```

## 🎯 **ALL POSSIBLE ACTIONS**

### **Development Actions**
1. **Code Analysis & Review**
   - Analyze codebase structure and patterns
   - Identify bugs, performance issues, security vulnerabilities
   - Review code quality and suggest improvements
   - Generate code documentation

2. **Feature Development**
   - Create new React components with TypeScript
   - Implement full-stack features with database integration
   - Add authentication and authorization logic
   - Build responsive UI with Tailwind CSS

3. **Database Operations**
   - Design and modify database schemas
   - Create and run migrations
   - Query optimization and performance tuning
   - Generate TypeScript types from database

4. **Testing & Quality Assurance**
   - Write unit and integration tests
   - Generate Playwright E2E tests
   - Run linting and type checking
   - Performance testing and optimization

5. **Deployment & DevOps**
   - Build and deploy applications
   - Manage environment configurations
   - Set up CI/CD pipelines
   - Monitor application performance

### **Business Process Actions**
1. **Client Management**
   - Set up client onboarding workflows
   - Manage client data and documents
   - Track project progress and milestones
   - Generate client reports and analytics

2. **Task Management**
   - Create and assign tasks with priorities
   - Set up recurring task schedules
   - Track task completion and rollover
   - Generate productivity reports

3. **Instagram Marketing**
   - Automate lead generation from Instagram
   - Set up outreach campaigns
   - Track engagement metrics
   - Manage social media accounts

4. **Financial Tracking**
   - Process invoices and payments
   - Track expenses and revenue
   - Generate financial reports
   - Manage payment methods and vendors

5. **User Engagement**
   - Implement points and rewards systems
   - Create leaderboards and achievements
   - Track skill progression
   - Manage NFT and crypto integration

### **System Administration Actions**
1. **File Management**
   - Organize project structure
   - Backup and restore files
   - Clean up unused assets
   - Manage configuration files

2. **Process Management**
   - Monitor running processes
   - Start/stop development servers
   - Manage background tasks
   - Handle system resources

3. **Security & Access Control**
   - Implement user authentication
   - Set up role-based permissions
   - Audit security configurations
   - Monitor access logs

### **Content & Documentation Actions**
1. **Documentation Generation**
   - Create technical documentation
   - Generate API documentation
   - Write user guides and tutorials
   - Maintain changelog and release notes

2. **Content Management**
   - Manage video content and bookmarks
   - Create educational materials
   - Organize help articles
   - Curate networking resources

## 🚀 **AUTONOMOUS CAPABILITIES**

### **What the Agent CAN Do Automatically**
✅ **Code Generation**: Create complete features with proper TypeScript, React, and database integration
✅ **Database Management**: Design schemas, run migrations, optimize queries
✅ **UI Development**: Build responsive components with proper styling and accessibility
✅ **Testing**: Generate comprehensive test suites
✅ **Documentation**: Create detailed technical documentation
✅ **Deployment**: Build and deploy applications with proper configuration
✅ **Problem Solving**: Debug complex issues across the full stack
✅ **Process Automation**: Set up workflows and automated tasks

### **What Requires User Input/Approval**
⚠️ **Authentication**: Supabase operations require access tokens
⚠️ **Destructive Operations**: Deleting databases, removing files
⚠️ **External Services**: Configuring third-party integrations
⚠️ **Business Logic**: Domain-specific rules and requirements
⚠️ **Design Decisions**: UI/UX choices and branding guidelines

## 🔍 **CURRENT LIMITATIONS**

### **Technical Limitations**
1. **Supabase MCP**: Requires authentication token for full database access
2. **File System**: Limited to allowed directories (configurable)
3. **Process Execution**: Timeout limits on long-running commands
4. **Memory**: No persistent memory between sessions
5. **External APIs**: Limited to configured MCP servers

### **Context Limitations**
1. **Session State**: No memory of previous conversations
2. **File Context**: Limited to 2000 lines per file read
3. **Search Results**: Truncated for large result sets
4. **Processing Time**: Complex operations may timeout

## 📈 **IMPROVEMENT OPPORTUNITIES**

### **High-Priority Enhancements**
1. **Database Authentication**: Set up persistent Supabase access tokens
2. **Memory System**: Implement session state persistence
3. **Error Handling**: Enhanced error recovery and retry logic
4. **Performance**: Optimize large file processing
5. **Integration**: Add more MCP servers for additional capabilities

### **Feature Expansions**
1. **AI Analysis**: Enhanced code analysis with ML models
2. **Automation**: More sophisticated workflow automation
3. **Monitoring**: Real-time application monitoring
4. **Analytics**: Advanced business intelligence features
5. **Security**: Enhanced security scanning and compliance

This comprehensive reference provides all the information needed for future agent sessions to understand capabilities and limitations without requiring rediscovery.