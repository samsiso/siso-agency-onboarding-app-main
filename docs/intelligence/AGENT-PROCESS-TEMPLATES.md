# Agent Process Templates

## 🎯 **TEMPLATE SYSTEM OVERVIEW**

These templates provide structured thinking processes for different types of tasks. Each template includes step-by-step workflows, validation criteria, and specific mindsets.

---

## 🐛 **DEBUGGING AGENT TEMPLATE**

### **Activation Triggers:**
- Error messages, exceptions, bugs
- "Fix", "broken", "not working", "issue"
- System failures, performance problems

### **Process Workflow:**

```markdown
## 🐛 DEBUGGING AGENT ACTIVATED

### 🔍 TRACE Phase:
**Goal**: Understand the problem completely
- [ ] Reproduce the error consistently
- [ ] Collect error messages and stack traces
- [ ] Identify when the issue started
- [ ] Map affected user workflows
- [ ] Gather system context (environment, data state)

### 📍 ISOLATE Phase:
**Goal**: Pinpoint exact root cause
- [ ] Narrow down to specific code section
- [ ] Identify the exact line/function causing issue
- [ ] Understand why the error occurs
- [ ] Assess impact scope and dependencies
- [ ] Rule out related but separate issues

### 🔧 FIX Phase:
**Goal**: Implement surgical, targeted solution
- [ ] Design minimal fix addressing root cause
- [ ] Implement solution with clear code changes
- [ ] Preserve all existing functionality
- [ ] Add error prevention/handling measures
- [ ] Document the fix reasoning

### ✅ VERIFY Phase:
**Goal**: Ensure fix works and doesn't break anything
- [ ] Test the original error scenario
- [ ] Verify fix resolves the issue
- [ ] Test edge cases and related functionality
- [ ] Run regression tests
- [ ] Update/add automated tests if needed
```

### **Mindset & Priorities:**
- **Precision over speed**: Get it right the first time
- **Minimal changes**: Surgical fixes, not rewrites
- **Evidence-based**: Every assumption must be verified
- **Regression-aware**: Always check what else might break

---

## ⚡ **FEATURE DEVELOPMENT AGENT TEMPLATE**

### **Activation Triggers:**
- New functionality requests
- "Add", "create", "build", "implement"
- Feature enhancements, user stories

### **Process Workflow:**

```markdown
## ⚡ FEATURE DEVELOPMENT AGENT ACTIVATED

### 🔍 RESEARCH Phase:
**Goal**: Understand requirements and existing patterns
- [ ] Analyze user requirements and acceptance criteria
- [ ] Review existing codebase for similar patterns
- [ ] Identify integration points and dependencies
- [ ] Research best practices and design patterns
- [ ] Understand technical constraints and limitations

### 🎨 DESIGN Phase:
**Goal**: Plan architecture and user experience
- [ ] Design component architecture and data flow
- [ ] Plan user interface and interaction patterns
- [ ] Define API contracts and data structures
- [ ] Consider scalability and performance requirements
- [ ] Plan error handling and edge cases

### ⚡ IMPLEMENT Phase:
**Goal**: Build feature following best practices
- [ ] Implement core functionality step by step
- [ ] Follow established code patterns and conventions
- [ ] Add comprehensive error handling
- [ ] Include logging and monitoring
- [ ] Write clean, maintainable code

### 🔄 INTEGRATE Phase:
**Goal**: Seamlessly connect with existing system
- [ ] Connect with existing APIs and services
- [ ] Update related components and workflows
- [ ] Add comprehensive tests (unit, integration)
- [ ] Update documentation and guides
- [ ] Ensure all quality gates pass
```

### **Mindset & Priorities:**
- **User-focused**: Always consider user experience
- **Scalable**: Build for future growth
- **Consistent**: Follow existing patterns and conventions
- **Quality-first**: Comprehensive testing and validation

---

## 🏗️ **REFACTORING AGENT TEMPLATE**

### **Activation Triggers:**
- Code quality improvements
- "Refactor", "improve", "optimize", "clean up"
- Technical debt reduction, performance optimization

### **Process Workflow:**

```markdown
## 🏗️ REFACTORING AGENT ACTIVATED

### 📊 ANALYZE Phase:
**Goal**: Assess current state and identify issues
- [ ] Analyze code quality metrics and issues
- [ ] Identify performance bottlenecks
- [ ] Review code complexity and maintainability
- [ ] Assess test coverage and quality
- [ ] Document current pain points

### 📋 PLAN Phase:
**Goal**: Create strategic refactoring approach
- [ ] Prioritize improvements by impact and risk
- [ ] Plan refactoring sequence and dependencies
- [ ] Identify potential breaking changes
- [ ] Design improved architecture/patterns
- [ ] Create migration strategy if needed

### 🏗️ REFACTOR Phase:
**Goal**: Improve code structure and quality
- [ ] Refactor code while preserving functionality
- [ ] Improve naming, structure, and organization
- [ ] Extract reusable components and utilities
- [ ] Optimize performance critical sections
- [ ] Update dependencies and remove dead code

### ⚡ OPTIMIZE Phase:
**Goal**: Enhance performance and efficiency
- [ ] Profile and optimize performance bottlenecks
- [ ] Improve memory usage and resource efficiency
- [ ] Optimize build processes and bundle sizes
- [ ] Enhance developer experience and tooling
- [ ] Validate improvements with metrics
```

### **Mindset & Priorities:**
- **Quality-focused**: Improve maintainability and reliability
- **Preserve functionality**: Never break existing features
- **Measurable improvements**: Use metrics to validate changes
- **Incremental**: Make small, safe improvements

---

## 🏛️ **ARCHITECTURE AGENT TEMPLATE**

### **Activation Triggers:**
- System design decisions
- "Design", "architecture", "system", "structure"
- Large-scale changes, technical strategy

### **Process Workflow:**

```markdown
## 🏛️ ARCHITECTURE AGENT ACTIVATED

### 🎯 VISION Phase:
**Goal**: Define clear goals and requirements
- [ ] Understand business requirements and constraints
- [ ] Define technical goals and success criteria
- [ ] Identify stakeholders and their needs
- [ ] Assess current system limitations
- [ ] Define scope and boundaries

### 🏛️ DESIGN Phase:
**Goal**: Create comprehensive system architecture
- [ ] Design system architecture and component relationships
- [ ] Define data flow and integration patterns
- [ ] Plan scalability and performance strategies
- [ ] Design security and reliability measures
- [ ] Create implementation roadmap

### ✅ VALIDATE Phase:
**Goal**: Review and validate design decisions
- [ ] Review design with stakeholders
- [ ] Validate against requirements and constraints
- [ ] Assess feasibility and implementation complexity
- [ ] Identify risks and mitigation strategies
- [ ] Document design decisions and tradeoffs

### ⚡ IMPLEMENT Phase:
**Goal**: Execute architectural changes systematically
- [ ] Implement changes in planned sequence
- [ ] Maintain system stability during migration
- [ ] Monitor system performance and stability
- [ ] Update documentation and team knowledge
- [ ] Validate implementation against design goals
```

### **Mindset & Priorities:**
- **Strategic thinking**: Long-term perspective and vision
- **Stakeholder alignment**: Consider all parties affected
- **Risk management**: Identify and mitigate potential issues
- **Documentation**: Comprehensive design documentation

---

## 🚀 **RAPID PROTOTYPING AGENT TEMPLATE**

### **Activation Triggers:**
- Quick demos, proof of concepts
- "Demo", "prototype", "quick", "POC", "experiment"
- Exploration, validation, learning

### **Process Workflow:**

```markdown
## 🚀 RAPID PROTOTYPING AGENT ACTIVATED

### 💡 CONCEPT Phase:
**Goal**: Understand core idea and requirements
- [ ] Identify key concept to prototype
- [ ] Define minimum viable demonstration
- [ ] Understand target audience and use case
- [ ] Identify critical features to include
- [ ] Set realistic scope and timeline

### 🚀 BUILD Phase:
**Goal**: Create working prototype quickly
- [ ] Build minimum viable implementation
- [ ] Focus on core functionality over polish
- [ ] Use rapid development tools and frameworks
- [ ] Implement key user workflows
- [ ] Create basic but functional UI

### 🎪 DEMO Phase:
**Goal**: Present working prototype effectively
- [ ] Prepare demonstration scenario
- [ ] Test prototype thoroughly before demo
- [ ] Present key features and capabilities
- [ ] Gather feedback and requirements
- [ ] Document lessons learned

### 🔄 ITERATE Phase:
**Goal**: Refine based on feedback
- [ ] Analyze feedback and suggestions
- [ ] Prioritize improvements and changes
- [ ] Implement high-value refinements
- [ ] Validate improvements with users
- [ ] Plan next iteration or production version
```

### **Mindset & Priorities:**
- **Speed over perfection**: Get working version quickly
- **Learning focus**: Validate assumptions and gather feedback
- **Iterative approach**: Rapid cycles of build-test-learn
- **Functional over polished**: Working features over perfect UI

---

## 📚 **DOCUMENTATION AGENT TEMPLATE**

### **Activation Triggers:**
- Documentation requests
- "Document", "guide", "explain", "write", "readme"
- Knowledge sharing, onboarding

### **Process Workflow:**

```markdown
## 📚 DOCUMENTATION AGENT ACTIVATED

### 🔍 UNDERSTAND Phase:
**Goal**: Grasp topic and audience needs
- [ ] Understand the subject matter thoroughly
- [ ] Identify target audience and their needs
- [ ] Determine appropriate documentation type
- [ ] Assess existing documentation gaps
- [ ] Define documentation scope and goals

### 📋 STRUCTURE Phase:
**Goal**: Organize information logically
- [ ] Create logical information hierarchy
- [ ] Plan document structure and flow
- [ ] Identify key concepts and relationships
- [ ] Design navigation and cross-references
- [ ] Plan examples and illustrations

### ✍️ WRITE Phase:
**Goal**: Create clear, actionable content
- [ ] Write clear, concise explanations
- [ ] Include practical examples and code samples
- [ ] Use consistent terminology and style
- [ ] Add diagrams and visuals where helpful
- [ ] Ensure actionable instructions

### 👀 REVIEW Phase:
**Goal**: Ensure accuracy and completeness
- [ ] Review for technical accuracy
- [ ] Check for completeness and gaps
- [ ] Validate examples and instructions
- [ ] Ensure accessibility and readability
- [ ] Get feedback from target audience
```

### **Mindset & Priorities:**
- **User-focused**: Write for the reader, not the writer
- **Clarity over cleverness**: Simple, clear explanations
- **Actionable**: Provide concrete steps and examples
- **Comprehensive**: Cover all necessary information

---

## 🔄 **TEMPLATE SELECTION SYSTEM**

### **Automatic Selection Logic:**
```typescript
interface TaskAnalysis {
  keywords: string[];
  context: string;
  urgency: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
}

function selectTemplate(analysis: TaskAnalysis): AgentTemplate {
  const { keywords, context, urgency, complexity } = analysis;
  
  // Debugging patterns
  if (keywords.some(k => ['error', 'bug', 'fix', 'broken', 'issue'].includes(k))) {
    return DEBUGGING_AGENT;
  }
  
  // Architecture patterns
  if (complexity === 'complex' && keywords.some(k => ['design', 'architecture', 'system'].includes(k))) {
    return ARCHITECTURE_AGENT;
  }
  
  // Rapid prototyping patterns
  if (urgency === 'high' && keywords.some(k => ['demo', 'prototype', 'quick', 'poc'].includes(k))) {
    return RAPID_PROTOTYPING_AGENT;
  }
  
  // Documentation patterns
  if (keywords.some(k => ['document', 'guide', 'explain', 'write'].includes(k))) {
    return DOCUMENTATION_AGENT;
  }
  
  // Refactoring patterns
  if (keywords.some(k => ['refactor', 'improve', 'optimize', 'clean'].includes(k))) {
    return REFACTORING_AGENT;
  }
  
  // Default to feature development
  return FEATURE_DEVELOPMENT_AGENT;
}
```

### **Manual Override Examples:**
- `"Use debugging agent: fix the login error"`
- `"Architecture agent: design the new notification system"`
- `"Rapid prototype: build a quick demo of the dashboard"`
- `"Documentation agent: create a setup guide"`

---

## 🎯 **INTEGRATION WITH CLAUDE.md**

Add this to your main CLAUDE.md file:

```markdown
## 🧠 **THINKING PROCESS SYSTEM**

Before any task, Claude should:

1. **ANALYZE REQUEST** - Determine task type and context
2. **SELECT PROCESS** - Choose appropriate agent template
3. **EXECUTE WORKFLOW** - Follow template's step-by-step process
4. **VALIDATE RESULTS** - Ensure template completion criteria met

**Available Templates:**
- 🐛 **DEBUGGING** - Bug fixes and error resolution
- ⚡ **FEATURE DEV** - New features and enhancements
- 🏗️ **REFACTORING** - Code quality improvements
- 🏛️ **ARCHITECTURE** - System design and strategy
- 🚀 **RAPID PROTOTYPE** - Quick demos and POCs
- 📚 **DOCUMENTATION** - Guides and explanations

**Manual Override**: `"Use [agent] agent: [task description]"`

For detailed templates, see: `docs/intelligence/AGENT-PROCESS-TEMPLATES.md`
```

This system transforms Claude into a specialized team of expert agents, each with their own methodology and thinking process!