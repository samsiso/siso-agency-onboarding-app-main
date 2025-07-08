# 🚀 **Claude Code Autonomous Agent Rules for SISO Agency Platform**

---

## 🎯 **CORE AUTONOMOUS DEVELOPMENT RULES**

### ⚡ **Technology Stack (PROJECT SPECIFIC)**
- **Framework**: Vite + React 18 (functional components + hooks ONLY)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React ONLY (no other icon libraries)
- **Database**: Supabase with comprehensive schema (70+ tables)
- **Validation**: Zod schemas for all data operations
- **State Management**: React Query + Jotai
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite (not Webpack, not Next.js)

---

## 🔴 **CRITICAL AUTONOMOUS BEHAVIOR RULES**

### 🤖 **IMMEDIATE ACTION REQUIREMENTS**
- **NEVER ASK FOR PERMISSION** - Execute tasks immediately upon request
- **BATCH ALL OPERATIONS** - Use multiple tool calls simultaneously for efficiency
- **RESEARCH BEFORE CREATING** - Always check existing patterns and components
- **QUALITY GATES MANDATORY** - Run lint, type-check, and build before commits
- **DOCUMENT EVERYTHING** - Log all research, decisions, and progress

### 🔄 **RIPER METHODOLOGY (WITHIN Each Prompt)**
Execute the full RIPER cycle within each prompt response:
1. **🔍 Research**: Analyze request and existing codebase patterns
2. **💡 Innovate**: Think creatively within established architecture
3. **📋 Plan**: Create detailed implementation strategy (use TodoWrite)
4. **⚡ Execute**: Implement immediately with batch tool operations
5. **🔎 Review**: Test results, verify quality, plan next steps

### 📊 **PROGRESS TRACKING MANDATORY**
- **TodoWrite tool** - Track all multi-step tasks
- **Prompt-tracker.md** - Update session progress
- **Documentation logs** - Record research findings
- **Thought logs** - Document complex decision processes

---

## 🏗️ **SISO PROJECT ARCHITECTURE RULES**

### 📁 **Directory Structure Compliance**
```
src/
├── components/          # Follow existing organization
│   ├── admin/          # Admin-specific functionality
│   ├── auth/           # Authentication components
│   ├── client/         # Client portal components
│   ├── dashboard/      # Dashboard widgets and layouts
│   ├── partnership/    # Partnership program features
│   ├── ui/            # Base shadcn/ui components
│   └── [feature]/     # Feature-specific folders
├── hooks/             # Custom React hooks
├── pages/             # Page components (route-based)
├── integrations/      # Supabase and external APIs
├── lib/              # Utilities and shared logic
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

### 🎯 **Component Creation Rules**
1. **Check existing components first** - Never duplicate functionality
2. **Follow shadcn/ui patterns** - Use established component library
3. **TypeScript interfaces required** - No `any` types allowed
4. **Responsive design mandatory** - Mobile-first approach
5. **Error boundaries included** - Proper error handling
6. **Loading states implemented** - User experience priority

### 🗄️ **Database Operation Rules**
1. **Use Supabase client** from `@/integrations/supabase/client.ts`
2. **Reference type definitions** from `@/integrations/supabase/types.ts`
3. **Zod validation required** - All data operations must be validated
4. **Error handling mandatory** - Try/catch blocks for all database calls
5. **Optimistic updates** - Use React Query patterns
6. **Real-time subscriptions** - Leverage Supabase real-time when appropriate

---

## 🎨 **SISO BRAND & UI STANDARDS**

### 🌈 **Brand Colors (DO NOT OVERRIDE)**
- **Primary**: Orange/Yellow SISO brand theme
- **Backgrounds**: Clean whites and light grays
- **Accents**: Orange highlights for CTAs
- **Text**: Dark grays for optimal readability

### 🎯 **UI Design Principles**
1. **Agency-Professional** - Clean, business-focused aesthetics
2. **Data-Driven** - Clear metrics and progress indicators
3. **User-Centric** - Intuitive workflows and navigation
4. **Consistent** - Follow established component patterns
5. **Accessible** - WCAG compliance requirements
6. **Responsive** - Mobile-first responsive design

---

## 🚀 **AUTONOMOUS WORKFLOW PATTERNS**

### 💻 **Development Workflow**
1. **Research Phase** - Use Grep/Glob to understand existing patterns
2. **Planning Phase** - Create TodoWrite list for complex features
3. **Implementation Phase** - Batch file operations for efficiency
4. **Testing Phase** - Run quality gates (lint, type-check, build)
5. **Documentation Phase** - Update relevant documentation files

### 📝 **File Operation Efficiency**
- **Read multiple files concurrently** when analyzing related components
- **Batch tool calls** for file creation and editing
- **Use Task agent** for complex cross-file research
- **Parallel operations** whenever possible

### 🔧 **Quality Gates (MANDATORY)**
```bash
# Run before every commit
npm run lint          # ESLint must pass
npm run build         # TypeScript compilation must succeed
# Optional but recommended
npm run preview       # Test production build
```

---

## 🗄️ **SUPABASE INTEGRATION PATTERNS**

### 📊 **Key Tables for Agency Operations**
- **`client_onboarding`** - Multi-step client setup process
- **`tasks`** - Task management with categories and priorities
- **`instagram_leads`** - Lead generation and outreach automation
- **`portfolio_items`** - Project showcase and case studies
- **`outreach_campaigns`** - Marketing campaign management
- **`agency_pain_points`** - Problem identification and solutions
- **`financial_transactions`** - Invoice and expense tracking

### 🔄 **Database Query Patterns**
```typescript
// Always use proper typing
const { data, error } = await supabase
  .from('client_onboarding')
  .select('*')
  .eq('status', 'active')

// Handle errors properly
if (error) {
  console.error('Database error:', error)
  throw new Error(`Failed to fetch clients: ${error.message}`)
}
```

### ⚡ **React Query Integration**
- **Cache management** - Use appropriate cache keys
- **Optimistic updates** - Immediate UI feedback
- **Error boundaries** - Graceful error handling
- **Real-time sync** - Supabase subscriptions where needed

---

## 🤖 **AI AGENT RESPONSE FORMAT**

### 📝 **Response Structure Requirements**
- **Horizontal dividers** (`---`) between sections
- **Emojis for visual impact** and section identification
- **Clear action summaries** at the end of each response
- **Progress indicators** (current task X/total tasks)
- **Next steps clearly defined**

### 🎯 **Communication Standards**
- **Concise and direct** - No unnecessary elaboration
- **Action-oriented** - Focus on what was accomplished
- **Future-planning** - Clear next steps provided
- **Problem-solving** - Address issues proactively

---

## 📊 **DOCUMENTATION & RESEARCH STANDARDS**

### 📋 **Documentation Workflow**
1. **Research Logs** - Record findings in `docs/research-logs/`
2. **Thought Logs** - Document decision processes in `docs/thought-logs/`
3. **Progress Tracking** - Update `prompt-tracker.md` each session
4. **Feature Documentation** - Update relevant docs after implementation

### 🔍 **Research Methodology**
- **Existing Patterns** - Always check current implementation
- **Similar Components** - Reference related functionality
- **Database Schema** - Understand data relationships
- **User Experience** - Consider agency user workflows

---

## 🎯 **SUCCESS METRICS FOR AUTONOMOUS DEVELOPMENT**

### ✅ **Technical Quality Indicators**
- **Zero TypeScript errors** in production builds
- **Zero ESLint warnings** after code completion
- **Proper error handling** in all async operations
- **Responsive design** across all viewport sizes
- **Performance optimization** with React best practices

### ⚡ **Efficiency Indicators**
- **Immediate task execution** without confirmation requests
- **Proactive problem identification** and resolution
- **Comprehensive implementations** that consider edge cases
- **Clear documentation** of changes and decisions
- **Minimal back-and-forth** communication needed

### 📈 **Business Value Indicators**
- **Agency workflow optimization** - Streamlined user processes
- **Data accuracy** - Proper validation and error handling
- **User experience enhancement** - Intuitive and professional UI
- **Feature completeness** - End-to-end functionality implementation

---

## 🛠️ **TROUBLESHOOTING & ERROR HANDLING**

### 🐛 **Common Development Scenarios**
1. **Supabase Connection Issues** - Check client configuration
2. **TypeScript Errors** - Verify type definitions match database schema
3. **Build Failures** - Review import paths and dependencies
4. **Component Conflicts** - Check for duplicate component names
5. **Styling Issues** - Verify Tailwind class compatibility

### 🔧 **Debugging Workflow**
1. **Check browser console** for runtime errors
2. **Review TypeScript compiler** output for type issues
3. **Verify Supabase queries** in database logs
4. **Test responsive design** across viewport sizes
5. **Validate data flow** from database to UI

---

## ⚡ **IMMEDIATE ACTIONS FOR EVERY PROMPT**

### 📋 **Mandatory Checklist**
1. ✅ **Update TodoWrite** - Track current task progress
2. ✅ **Research existing patterns** - Use Grep/Glob for code search
3. ✅ **Execute RIPER cycle** - Complete methodology within response
4. ✅ **Use batch operations** - Multiple tool calls for efficiency
5. ✅ **Apply SISO branding** - Consistent orange/yellow theme
6. ✅ **TypeScript compliance** - Strict typing throughout
7. ✅ **Quality gates** - Lint and build verification
8. ✅ **Document changes** - Update relevant logs and tracking
9. ✅ **Test immediately** - Verify functionality works
10. ✅ **Plan next steps** - Clear direction for continuation

---

**🚀 AUTONOMOUS AGENT STATUS**: Ready for immediate execution with comprehensive understanding of SISO Agency Platform architecture, business requirements, and technical standards.

**🎯 MISSION**: Build exceptional agency onboarding experiences through autonomous, quality-driven development that maintains architectural consistency and delivers measurable business value.