# 🚀 **React + TypeScript AI Agent Rules & Development Guidelines**

---

## 🎯 **CORE DEVELOPMENT RULES**

### ⚡ **Technology Stack (STRICT)**
- **Frontend**: React 18+ with TypeScript (functional components + hooks ONLY)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React only
- **Build**: Vite
- **NO exceptions**: No Angular, Vue, Next.js, Svelte, or overlapping libraries

---

## 🔴 **CRITICAL REQUIREMENTS FROM USER FEEDBACK**

### 🌑 **UI & Theme (MANDATORY)**
- **ALWAYS** use black/dark theme for ALL UI components
- **NEVER** create white/light themed interfaces
- Use dark Tailwind classes: `bg-gray-900`, `text-white`, `border-gray-700`
- Apply orange accents for SISO branding: `text-orange-500`, `bg-orange-600`

### 🔄 **Git Workflow (STRICT)**
- **NO auto-push** after every prompt
- **Push frequency**: Only every 5 prompts (track in prompt-tracker.md)
- **Branch**: Always push to `dev` branch, never main
- **Commits**: Granular, descriptive messages

### 📝 **Documentation (REQUIRED)**
- **Research Logging**: Document ALL research findings in relevant files
- **Thought Logs**: Maintain thought log for each feature/sprint
- **Progress Tracking**: Update progress.md with detailed notes
- **Knowledge Retention**: Save discoveries for future reference

---

## 🤖 **AI AGENT BEHAVIOR RULES**

### 🔬 **RIPER System (WITHIN Each Prompt)**
Execute the full RIPER cycle within each prompt response:
1. **🔍 Research**: Analyze request and gather context
2. **💡 Innovate**: Think creatively about solutions
3. **📋 Plan**: Create detailed implementation plan
4. **⚡ Execute**: Implement the solution
5. **🔎 Review**: Evaluate results and plan next steps

### 🚀 **Response Format Requirements**
- Use horizontal dividers (`---`) to separate sections
- Use emojis for visual impact and section identification
- Always include at end of response:
  - Current RIPER step
  - Next RIPER step  
  - Clear suggestion for next action
  - Prompt count (X/5)
  - Any additional metadata

### 🎯 **Development Environment**
- Use existing dev environment at `http://localhost:8081`
- Act autonomously - plan and execute without waiting for confirmation
- Only ask for clarification when truly needed
- Make all changes immediately, don't output code to user

---

## ⚛️ **REACT + TYPESCRIPT STANDARDS**

### 🔧 **Code Requirements**
- **Components**: Functional components with TypeScript interfaces only
- **Hooks**: Custom hooks with proper TypeScript typing
- **Styling**: Tailwind CSS classes, no inline CSS
- **Icons**: Lucide React icons only
- **Imports**: Use proper path aliases (@/components, @/hooks, etc.)

### 📝 **TypeScript Standards**
- Strict typing, no `any` types
- Explicit interfaces for all props
- Proper error handling with typed errors
- Use TypeScript utility types when appropriate

### 🎨 **Dark Theme Standards**
- Primary background: `bg-gray-900`
- Secondary background: `bg-gray-800`
- Text: `text-white` or `text-gray-100`
- Borders: `border-gray-700`
- Accents: `text-orange-500`, `bg-orange-600`

---

## 🖥️ **CURSOR IDE OPTIMIZATION RULES**

### 🎯 **Code Citations & References**
- **ALWAYS** use Cursor's citation format: ```startLine:endLine:filepath
- Example: ```12:15:src/components/UserCard.tsx
- Include line numbers when referencing specific code sections
- Use file paths relative to workspace root

### 📁 **File Management & Navigation**
- **Use file_search tool** for finding files by name/pattern
- **Use codebase_search tool** for semantic code searches
- **Reference existing files** before creating new ones
- **Check file structure** with list_dir before making assumptions
- **Work with Cursor's file indexing** - it knows the entire codebase

### 🤖 **AI Integration Best Practices**
- **Complement Cursor's AI**, don't duplicate its efforts
- **Use semantic search** for understanding existing patterns
- **Leverage codebase context** - Cursor has full project understanding
- **Work incrementally** - make focused changes Cursor can track
- **Use proper file paths** - Cursor tracks file relationships

### ⌨️ **Terminal & Command Usage**
- **Use run_terminal_cmd tool** for executing commands
- **Prefer non-interactive commands** (use --yes flags)
- **Run background processes** with is_background: true
- **Chain related commands** efficiently
- **Use proper working directory** context

### 🔧 **Development Workflow in Cursor**
- **Make atomic changes** - one logical change per edit
- **Test immediately** after changes in localhost:8081
- **Use Cursor's error detection** - check for linter errors
- **Leverage autocomplete** - let Cursor suggest imports
- **Work with existing patterns** that Cursor has learned

### 🌐 **Multi-file Operations**
- **Use parallel tool calls** for reading multiple files
- **Coordinate changes** across related files
- **Maintain consistency** in naming and structure
- **Update imports** when moving or renaming files
- **Check dependencies** before making changes

### 🐛 **Debugging & Error Handling**
- **Use Cursor's error highlighting** - check for red underlines
- **Read error messages carefully** from terminal output
- **Fix issues incrementally** - one error at a time
- **Test changes immediately** in development server
- **Document solutions** for future reference

### 📊 **Codebase Understanding**
- **Search before creating** - avoid duplicate functionality
- **Follow existing patterns** - Cursor learns from codebase
- **Maintain architectural consistency** - respect existing structure
- **Use proper TypeScript** - Cursor provides excellent TS support
- **Leverage existing utilities** - don't reinvent the wheel

---

## 📊 **TRACKING & METRICS**

### 🔢 **Prompt Counter System**
- Track current prompt number in prompt-tracker.md
- Push to git every 5 prompts
- Log all files modified/created each prompt
- Update progress.md with session progress

### 📝 **Documentation System**
- Use existing templates in `docs/templates/`
- Log research in `docs/research-logs/`
- Log development thoughts in `docs/thought-logs/`
- Update relevant documentation after each feature

---

## 🛠️ **AVAILABLE TOOLS & RESOURCES**

### 📁 **Existing Templates**
- `docs/templates/react-component-template.tsx`
- `docs/templates/react-hook-template.ts`
- `docs/templates/automation-scripts.md`

### 🔧 **When Code Templates Needed**
- Reference existing template files
- Generate new templates in `docs/templates/` if needed
- Keep rules document clean of code examples

---

## ⚡ **IMMEDIATE ACTIONS FOR EVERY PROMPT**

1. **Update prompt counter** in prompt-tracker.md
2. **Execute RIPER cycle** within the response
3. **Use codebase_search/file_search** to understand existing code
4. **Check file structure** with list_dir before making assumptions
5. **Document any research** in appropriate logs
6. **Use dark theme** for all UI components
7. **Focus on React + TypeScript** exclusively
8. **Use proper Cursor citations** (```line:line:filepath format)
9. **Test changes immediately** in localhost:8081
10. **Update progress.md** with session progress
11. **Check if git push needed** (every 5 prompts)

---

**🕒 Last Updated**: 2025-01-25  
**🔢 Current Prompt**: 3/5 (Next push at prompt 5)  
**🌑 Theme**: Dark theme enforced  
**⚛️ Focus**: React + TypeScript only  
**📝 Status**: Rules document cleaned and focused