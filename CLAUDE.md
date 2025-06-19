# Claude Code Configuration for SISO Agency Onboarding Platform

## 🚀 **AUTONOMOUS AGENT MODE**
**READ FIRST**: This project is configured for full autonomous development. Claude Code should act independently, make decisions, and execute tasks without waiting for confirmation.

### 📋 **Essential Reading Order**
1. **This file (CLAUDE.md)** - Core configuration
2. **`docs/CLAUDE-AUTONOMOUS-AGENT-RULES.md`** - Autonomous behavior rules
3. **`docs/SUPABASE-MCP-INTEGRATION.md`** - Database workflow
4. **`docs/GITHUB-AUTOMATION-WORKFLOW.md`** - Git automation
5. **`docs/templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md`** - Code templates

## Project Overview
A comprehensive agency onboarding platform built with Vite + React + TypeScript, focusing on client management, task automation, project tracking, Instagram lead generation, and agency growth tools.

### 🛠️ **Core Tech Stack**
- **Framework**: Vite + React 18 + TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React only
- **Database**: Supabase with 70+ tables for agency management
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Query + Jotai
- **Forms**: React Hook Form + Zod validation
- **Auth**: Supabase Auth
- **Charts**: Recharts + Reaviz

### 🎯 **Key Features**
- **Client Onboarding**: Multi-step client setup with document management
- **Task Management**: Advanced task system with categories, priorities, and rollover
- **Instagram Leads**: Lead generation and outreach automation
- **Project Tracking**: Portfolio management and project documentation
- **Financial**: Invoice tracking, expense management, payment methods
- **Agency Tools**: Pain points analysis, case studies, plan templates
- **User Engagement**: Points system, leaderboard, skill progression

## 🤖 **AUTONOMOUS AGENT BEHAVIOR**

### ⚡ **Core Autonomous Rules**
- **ACT IMMEDIATELY** - Don't ask for permission, execute tasks
- **RESEARCH FIRST** - Always check existing patterns before creating
- **BATCH OPERATIONS** - Use multiple tool calls simultaneously
- **QUALITY GATES** - Run lint, type-check, build before commits
- **DOCUMENT EVERYTHING** - Log research, decisions, progress

### 🔄 **RIPER Development Cycle**
Execute within each response:
1. **🔍 Research** - Understand existing code and requirements
2. **💡 Innovate** - Build on patterns, think creatively
3. **📋 Plan** - Create implementation strategy with TodoWrite
4. **⚡ Execute** - Implement immediately with batch operations
5. **🔎 Review** - Test, verify, document, plan next steps

## 🗄️ **SUPABASE DATABASE ARCHITECTURE**

### 🔧 **Database Clients**
- **Client-side**: `@/integrations/supabase/client.ts` (for client components)
- **Types**: `@/integrations/supabase/types.ts` (comprehensive type definitions)
- **Schema**: Always check database types before operations
- **Validation**: Use Zod schemas for all data operations

### 📊 **Critical Database Tables**
- **`client_onboarding`** - Core client data with multi-step progress
- **`tasks`** - Task management with categories, priorities, rollover
- **`instagram_leads`** - Lead generation and outreach tracking
- **`portfolio_items`** - Project showcase and portfolio management
- **`outreach_campaigns`** - Instagram marketing automation
- **`profiles`** - User profiles with social links and business info
- **`projects`** - Project tracking with features and documentation
- **`financial_transactions`** - Invoice and expense management
- **`agency_pain_points`** - Agency-specific problem identification
- **`plan_templates`** - Reusable plan structures for clients

### 🔄 **Database Enums**
- **`task_category`**: main, weekly, daily, siso_app_dev, onboarding_app, instagram
- **`task_priority`**: low, medium, high, urgent
- **`feature_status`**: pending, in_progress, completed
- **`user_role`**: admin, client

## 🚀 **GITHUB AUTOMATION**

### 🔄 **Autonomous Git Workflow**
- **Feature branches** for development
- **Conventional commits** with descriptive messages
- **Quality checks** before all commits
- **Batch commits** - group related changes
- **Dev branch** workflow (never push to main)

## Development Commands

### 🏃 **Essential Commands**
```bash
# Development
npm run dev           # Start dev server (localhost:5173)
npm run build         # Production build
npm run build:dev     # Development build
npm run lint          # ESLint checking
npm run preview       # Preview production build

# Quality Gates (Run before commits)
npm run lint          # Must pass before commit
npm run build         # Must pass before commit
```

### 🔧 **Development Environment**
- **Dev Server**: `http://localhost:5173` (Vite default)
- **Build Output**: `dist/` directory
- **Source**: `src/` directory with organized structure

## Brand Guidelines (Critical)
Based on SISO brand identity:

### 🎨 **Color Scheme**
- **Primary**: Orange/Yellow theme (SISO brand colors)
- **Backgrounds**: Clean whites and light grays
- **Accents**: Orange for CTAs and highlights
- **Text**: Dark grays for readability

### 🎯 **Design Principles**
1. **Modern & Professional** - Clean, agency-focused design
2. **User-Centric** - Intuitive navigation and workflows
3. **Data-Driven** - Clear metrics and progress tracking
4. **Responsive** - Mobile-first approach
5. **Accessible** - WCAG compliance
6. **Consistent** - Following established patterns

## MCP Tool Preferences
- **Supabase MCP** for database operations and testing
- **GitHub MCP** for issue management and automation
- **Grep** and **Glob** for targeted code searches
- **Task** agent for complex research across multiple files
- **Read** multiple files concurrently when analyzing related components
- **Batch tool calls** for maximum efficiency

## 🏗️ **Component Architecture**

### 📁 **Directory Structure**
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── client/         # Client-specific components
│   ├── dashboard/      # Dashboard layouts and widgets
│   ├── partnership/    # Partnership program components
│   ├── ui/            # Base UI components (shadcn/ui)
│   └── ...            # Feature-specific folders
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── integrations/      # External integrations (Supabase)
├── lib/              # Utilities and helpers
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### 🎯 **Component Standards**
1. **Functional components** with TypeScript interfaces
2. **Custom hooks** for reusable logic
3. **Shadcn/ui components** for consistent styling
4. **Lucide React icons** only
5. **Proper error boundaries** and loading states
6. **Responsive design** with Tailwind classes

## 🛠️ **AUTONOMOUS DEVELOPMENT TEMPLATES**

### 📁 **Available Templates**
All templates in `docs/templates/AUTONOMOUS-DEVELOPMENT-TEMPLATES.md`:
- **Components** - React components with TypeScript and styling
- **Hooks** - Custom hooks with Supabase integration
- **Pages** - Full page components with proper structure
- **Database Utilities** - Supabase query helpers
- **Forms** - React Hook Form + Zod validation patterns

### ⚡ **Template Usage**
1. **Copy template** as starting point
2. **Customize TypeScript interfaces** for specific needs
3. **Apply SISO branding** (orange/yellow theme)
4. **Add business logic** specific to feature
5. **Test thoroughly** with quality gates

## 📊 **Existing Documentation Structure**

### 📋 **Rich Documentation Resources**
- **`docs/admin-dashboard/`** - Admin UI enhancements and themes
- **`docs/client-dashboard/`** - Client portal development logs
- **`docs/partnership-program/`** - Comprehensive partnership development
- **`docs/research-logs/`** - Technical research and API analysis
- **`docs/thought-logs/`** - Development thinking and decision logs
- **`analysis/`** - Feature analysis and planning documents
- **`prompt-tracker.md`** - Session tracking and progress

### 🎯 **Documentation Patterns**
- **Research Logging** - Document findings in appropriate logs
- **Progress Tracking** - Update relevant documentation
- **Thought Processes** - Maintain thought logs for complex features
- **Template Usage** - Follow established patterns

## 🎯 **SUCCESS METRICS FOR AUTONOMOUS AGENT**

### ✅ **Quality Indicators**
- Zero TypeScript errors
- Zero ESLint warnings
- Consistent code formatting
- Proper error handling
- SISO brand guideline compliance

### ⚡ **Efficiency Indicators**
- Immediate task execution
- Proactive problem solving
- Minimal back-and-forth questions
- Comprehensive implementations
- Clear progress documentation

### 📊 **Documentation Standards**
- Updated `prompt-tracker.md` each session
- Research logged in appropriate files
- Progress tracked with TodoWrite tool
- Patterns documented for future reference

---

**🚀 AUTONOMOUS AGENT READY**: Claude Code is configured for full autonomous development with comprehensive guidance, templates, and automation workflows tailored specifically for the SISO Agency Onboarding Platform.

When in doubt, refer to existing implementations and maintain consistency with established patterns.