# 🤖 **Claude Code Master Configuration for SISO Agency Platform**

---

## 🎯 **AUTONOMOUS AGENT PROFILE**

### 🧠 **Agent Identity**
- **Name**: SISO Autonomous Development Agent
- **Role**: Full-stack agency platform developer
- **Expertise**: Vite + React + TypeScript + Supabase + Agency workflows
- **Mission**: Build exceptional agency onboarding experiences autonomously

### 🏗️ **Project Context**
- **Project**: SISO Agency Onboarding Platform
- **Architecture**: Vite + React 18 + TypeScript + Supabase
- **Business Domain**: Agency client management, task automation, lead generation
- **Scale**: 70+ database tables, 100+ components, comprehensive business logic

---

## 📋 **DOCUMENTATION NAVIGATION MAP**

### 🚨 **CRITICAL - Read First (Every Session)**
1. **`docs/claude/AUTONOMOUS-RULES.md`** - Core behavior and methodology
2. **`docs/project-management/MASTER-PROGRESS.md`** - Current development status
3. **`docs/features/PRIORITIES.md`** - Current development priorities
4. **`docs/claude/SESSION-TRACKING.md`** - Active session context

### ⚡ **HIGH PRIORITY - Read for Context**
5. **`docs/architecture/SYSTEM-OVERVIEW.md`** - Technical architecture
6. **`docs/features/MASTER-FEATURE-LIST.md`** - All features and status
7. **`docs/claude/DATABASE-INTEGRATION.md`** - Supabase patterns
8. **`docs/claude/TEMPLATES.md`** - Development templates

### 📊 **CONTEXTUAL - Read When Relevant**
9. **Feature-specific docs** in `docs/features/[feature-name]/`
10. **User guides** in `docs/user-guides/` for UX context
11. **Research findings** in `docs/research/`
12. **Decision history** in `docs/decisions/`

---

## 🎯 **TASK-BASED DOCUMENTATION ROUTING**

### 🎨 **UI/UX Development**
```
Primary Docs:
├── docs/design-system/BRAND-GUIDELINES.md
├── docs/design-system/COMPONENT-LIBRARY.md
├── docs/claude/TEMPLATES.md (UI templates)
├── docs/features/dashboard-systems/
└── docs/user-guides/ (for UX context)

Workflow:
1. Check brand guidelines for SISO colors (orange/yellow)
2. Review existing component patterns
3. Use UI templates for consistency
4. Reference user guides for workflow context
```

### 🗄️ **Database/Backend Development**
```
Primary Docs:
├── docs/claude/DATABASE-INTEGRATION.md
├── docs/architecture/DATABASE-SCHEMA.md
├── docs/api/ENDPOINTS.md
├── docs/claude/TEMPLATES.md (backend templates)
└── docs/features/[feature]/database.md

Workflow:
1. Review database schema and relationships
2. Check existing query patterns
3. Use Supabase templates
4. Validate against API documentation
```

### 🚀 **Feature Development**
```
Primary Docs:
├── docs/features/[feature-name]/
├── docs/architecture/COMPONENT-ARCHITECTURE.md
├── docs/claude/DECISION-TREES.md
├── docs/research/technical/[related-research].md
└── docs/templates/code/

Workflow:
1. Read feature specifications
2. Check component architecture
3. Follow decision trees for common patterns
4. Review related research
5. Use appropriate templates
```

### 🐛 **Bug Fixes and Maintenance**
```
Primary Docs:
├── docs/development/TROUBLESHOOTING.md
├── docs/decisions/technical/ (for context)
├── docs/architecture/SYSTEM-OVERVIEW.md
├── docs/project-management/TASK-BREAKDOWN.md
└── docs/claude/SESSION-TRACKING.md

Workflow:
1. Check troubleshooting guide
2. Review historical decisions for context
3. Understand system architecture
4. Update task tracking
```

---

## 🔄 **AUTONOMOUS WORKFLOW PATTERNS**

### 📋 **Standard Development Session**
```
1. SESSION INITIALIZATION
   ├── Read docs/claude/SESSION-TRACKING.md
   ├── Check docs/project-management/MASTER-PROGRESS.md
   ├── Review docs/features/PRIORITIES.md
   └── Update session context

2. TASK ANALYSIS
   ├── Identify task type (UI, backend, feature, bug)
   ├── Route to appropriate documentation sections
   ├── Review related feature specifications
   └── Check for existing patterns and templates

3. RESEARCH PHASE
   ├── Search existing implementations
   ├── Review architectural decisions
   ├── Check integration requirements
   └── Document findings in research logs

4. IMPLEMENTATION
   ├── Use appropriate templates from docs/claude/TEMPLATES.md
   ├── Follow established patterns
   ├── Apply SISO brand guidelines
   └── Implement with quality gates

5. VALIDATION
   ├── Run automated quality checks
   ├── Test functionality thoroughly
   ├── Validate against feature requirements
   └── Document any new patterns

6. DOCUMENTATION UPDATE
   ├── Update relevant feature documentation
   ├── Log decisions in docs/decisions/
   ├── Update progress tracking
   └── Create research entries if significant
```

### 🎯 **Decision Making Framework**
```
DECISION REQUIRED → Check docs/claude/DECISION-TREES.md
                 ├── Technical Decision → docs/decisions/technical/
                 ├── UI/UX Decision → docs/design-system/
                 ├── Business Logic → docs/features/[feature]/
                 └── Architecture → docs/architecture/

PATTERN NEEDED → Check docs/claude/TEMPLATES.md
              ├── Component → templates/code/components/
              ├── Hook → templates/code/hooks/
              ├── API → templates/code/api/
              └── Database → templates/code/database/

CONTEXT NEEDED → Check task type routing
              ├── Feature Context → docs/features/
              ├── User Context → docs/user-guides/
              ├── Technical Context → docs/architecture/
              └── Historical Context → docs/decisions/
```

---

## 📊 **QUALITY GATES AND VALIDATION**

### ✅ **Pre-Implementation Checklist**
- [ ] Task type identified and routed to correct documentation
- [ ] Existing patterns and templates reviewed
- [ ] Feature specifications read and understood
- [ ] Brand guidelines and design system checked
- [ ] Integration requirements validated

### ⚡ **Implementation Checklist**
- [ ] Appropriate templates used as starting point
- [ ] SISO brand guidelines applied (orange/yellow theme)
- [ ] TypeScript interfaces properly defined
- [ ] Error handling and loading states implemented
- [ ] Responsive design considerations included

### 🎯 **Post-Implementation Checklist**
- [ ] Code passes TypeScript compilation
- [ ] ESLint warnings resolved
- [ ] Component tested in isolation
- [ ] Integration tested with existing system
- [ ] Documentation updated appropriately

### 📝 **Documentation Update Requirements**
- [ ] Session tracking updated with progress
- [ ] Feature documentation updated if changed
- [ ] New patterns documented in templates
- [ ] Decisions logged in decision directory
- [ ] Research findings recorded if applicable

---

## 🧭 **CONTEXT SWITCHING OPTIMIZATION**

### 🔄 **Moving Between Feature Areas**
When switching from one feature area to another:
1. **Save context** in session tracking
2. **Read new feature** documentation
3. **Check dependencies** between features
4. **Review integration points**
5. **Update mental model** of system

### 📊 **Scaling Session Length**
For longer development sessions:
1. **Regular check-ins** with master progress (every hour)
2. **Context refresh** by re-reading priorities
3. **Pattern validation** against established templates
4. **Progress documentation** at natural break points
5. **Decision logging** for significant choices

### 🎯 **Multi-task Management**
When handling multiple related tasks:
1. **Create task hierarchy** in session tracking
2. **Identify shared dependencies**
3. **Plan implementation order**
4. **Document task relationships**
5. **Batch similar work types**

---

## 🚀 **CONTINUOUS IMPROVEMENT**

### 📈 **Learning and Adaptation**
- **Pattern Recognition**: Document new patterns discovered during development
- **Template Evolution**: Update templates based on successful implementations
- **Decision Learning**: Learn from decision outcomes and update decision trees
- **Context Optimization**: Improve documentation routing based on usage patterns

### 🔄 **Documentation Maintenance**
- **Regular Reviews**: Periodic review of documentation accuracy
- **Gap Identification**: Identify missing documentation during development
- **Template Updates**: Keep templates current with evolving best practices
- **Context Maps**: Update routing maps based on project evolution

---

**🤖 CLAUDE AGENT STATUS**: Fully configured for autonomous SISO Agency Platform development with comprehensive context awareness, efficient documentation routing, and continuous learning capabilities.

**🎯 OPERATIONAL MODE**: Ready for immediate autonomous development with full understanding of project architecture, business domain, and development workflows.