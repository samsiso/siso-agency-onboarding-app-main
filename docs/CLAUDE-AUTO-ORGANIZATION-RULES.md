# Claude Auto-Organization Rules

## 🤖 PROMPT ENGINEERING FOR FILE ORGANIZATION

When Claude creates, outputs, or suggests files, it should AUTOMATICALLY determine the correct location based on these rules:

### 📁 **DIRECTORY MAPPING RULES**

#### Documentation Files (.md)
- **Guides/Tutorials**: `docs/guides/`
  - Setup, installation, how-to guides
  - Keywords: setup, install, guide, tutorial, how-to
  
- **Reference/API**: `docs/reference/`
  - API documentation, specifications, references
  - Keywords: api, reference, spec, documentation
  
- **Testing**: `docs/testing/`
  - Test documentation, procedures, test plans
  - Keywords: test, testing, spec, validation
  
- **Deployment**: `docs/deployment/`
  - Deployment guides, CI/CD, infrastructure
  - Keywords: deploy, deployment, build, ci, cd
  
- **Architecture**: `docs/architecture/`
  - System design, architecture decisions
  - Keywords: architecture, design, structure, system
  
- **Integrations**: `docs/integrations/`
  - MCP, API, third-party integrations
  - Keywords: integration, mcp, api, webhook
  
- **Agent/Bot Docs**: `development/agents/docs/`
  - Agent documentation, bot guides
  - Keywords: agent, bot, automation, autonomous
  
- **Database**: `docs/database/`
  - Database schemas, SQL, Supabase docs
  - Keywords: database, sql, supabase, schema

#### Configuration Files
- **Development Configs**: `development/configs/`
  - MCP configs, agent configs, dev settings
  - Files: *.json (dev-related), mcp configs
  
- **Archive Configs**: `archived-files/configs/`
  - Old configs, backup configurations
  - Files: deprecated configs, backup files

#### Code Files
- **SISO Agency**: `projects/siso-agency-web/src/`
  - All SISO agency related code
  
- **Claudia Desktop**: `projects/claudia-desktop/src/`
  - All Claudia desktop app code
  
- **Shared Components**: `projects/shared/src/`
  - Reusable components between projects

#### Scripts & Automation
- **Build Scripts**: `scripts/`
  - Build, deployment, automation scripts
  
- **Agent Scripts**: `development/agents/`
  - Agent-specific scripts and configs
  
- **Archive Scripts**: `archived-files/scripts/`
  - Old, unused, or deprecated scripts

### 🎯 **CLAUDE BEHAVIOR RULES**

#### When Creating Files:
1. **ANALYZE CONTENT**: Look at file purpose and content
2. **MATCH KEYWORDS**: Use keyword mapping above
3. **DETERMINE LOCATION**: Choose appropriate directory
4. **CREATE PATH**: `Write` to correct full path, not root
5. **EXPLAIN CHOICE**: Brief note why placed there

#### Example Prompts:
```
❌ BAD: Write to "API-GUIDE.md" 
✅ GOOD: Write to "docs/reference/API-GUIDE.md"

❌ BAD: Write to "agent-config.json"
✅ GOOD: Write to "development/configs/agent-config.json"

❌ BAD: Write to "DEPLOYMENT-GUIDE.md"
✅ GOOD: Write to "docs/deployment/DEPLOYMENT-GUIDE.md"
```

#### Content Analysis Examples:
```
File: "MCP-SETUP-GUIDE.md"
Content: "How to setup MCP servers..."
→ Location: docs/guides/MCP-SETUP-GUIDE.md
→ Reason: Setup guide with MCP integration focus

File: "agent-performance-config.json"  
Content: Agent configuration settings
→ Location: development/agents/agent-performance-config.json
→ Reason: Agent-specific configuration

File: "UserService.tsx"
Content: React component for user management
→ Location: projects/siso-agency-web/src/components/UserService.tsx
→ Reason: SISO agency React component
```

### 🔄 **AUTO-ORGANIZATION WORKFLOW**

1. **File Creation Trigger**:
   - When Claude suggests creating a file
   - Analyze filename + first few lines of content
   - Apply mapping rules automatically

2. **Path Determination**:
   ```typescript
   function determineFilePath(filename: string, content: string): string {
     // Analyze filename patterns
     if (filename.includes('GUIDE') || filename.includes('SETUP')) {
       return 'docs/guides/';
     }
     
     // Analyze content keywords
     if (content.includes('agent') || content.includes('bot')) {
       return 'development/agents/docs/';
     }
     
     // Default categorization
     return 'docs/misc/';
   }
   ```

3. **Execution**:
   - Use full path in `Write` command
   - Create directory structure if needed
   - Provide brief explanation of placement

### 📋 **ESSENTIAL FILES (STAY IN ROOT)**

Never move these files from root:
- `README.md` - Project overview
- `CLAUDE.md` - Claude configuration  
- `package.json` - Dependencies
- `vite.config.ts` - Build config
- `tailwind.config.ts` - Styling config
- `tsconfig.json` - TypeScript config
- `workspace.json` - Multi-project config
- `index.html` - Entry point

### 🎯 **IMPLEMENTATION PROMPT**

**Add this to Claude's context:**

```
ORGANIZATIONAL INTELLIGENCE: 
When creating any file, automatically determine the correct location using these rules:
1. Analyze filename and content keywords
2. Match to directory mapping (guides→docs/guides/, agents→development/agents/docs/, etc.)
3. Use full path in Write command (e.g., "docs/guides/SETUP.md" not "SETUP.md")
4. Brief explanation: "Creating in docs/guides/ because [reason]"

Never place files in root unless they're essential config files.
Always organize intelligently based on content and purpose.
```

### 🔧 **AUTOMATION COMMANDS**

```bash
# Run intelligent organizer
./scripts/intelligent-file-organizer.sh

# Check for loose files
find . -maxdepth 1 -type f -name "*.md" -o -name "*.json" -o -name "*.js"

# Verify organization
tree docs/ development/ -L 2
```

---

**🎯 GOAL**: Zero loose files in root, everything intelligently organized by content and purpose!