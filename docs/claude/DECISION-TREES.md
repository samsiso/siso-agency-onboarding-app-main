# 🌳 **Claude Code Decision Trees for SISO Agency Platform**

---

## 🎯 **Autonomous Decision Framework**

This document provides decision trees for common development scenarios, enabling Claude Code to make intelligent autonomous decisions based on established patterns and project context.

---

## 🎨 **UI/UX DEVELOPMENT DECISIONS**

### 🎨 **Component Creation Decision Tree**
```
NEW COMPONENT NEEDED?
├── YES → Check existing components first
│   ├── Similar component exists?
│   │   ├── YES → Extend/modify existing component
│   │   │   ├── Add props for new functionality
│   │   │   ├── Use composition pattern
│   │   │   └── Maintain backward compatibility
│   │   └── NO → Create new component
│   │       ├── Use shadcn/ui base if available
│   │       ├── Apply SISO brand guidelines (orange/yellow)
│   │       ├── Follow TypeScript interface patterns
│   │       ├── Include error handling and loading states
│   │       └── Add to component library documentation
│   └── Check component complexity
│       ├── Simple (< 50 lines) → Single file component
│       ├── Medium (50-200 lines) → Component with hooks
│       └── Complex (> 200 lines) → Split into subcomponents
└── NO → Use existing component or compose existing ones
```

### 🎨 **Styling Decision Tree**
```
STYLING APPROACH NEEDED?
├── Component styling → Tailwind CSS classes
│   ├── Base styles → Use design system tokens
│   ├── Interactive states → Use hover/focus/active variants
│   ├── Responsive → Apply mobile-first breakpoints
│   └── Brand colors → Use SISO orange/yellow palette
├── Layout styling → CSS Grid or Flexbox
│   ├── Card layouts → Use Grid with gap utilities
│   ├── Navigation → Use Flexbox with justify/align
│   ├── Forms → Use Flexbox column with spacing
│   └── Complex layouts → Combine Grid + Flexbox
├── Animation → Framer Motion or Tailwind transitions
│   ├── Simple transitions → Tailwind transition utilities
│   ├── Complex animations → Framer Motion components
│   ├── Loading states → Spin animations or skeletons
│   └── Page transitions → Framer Motion page variants
└── Custom CSS needed?
    ├── NO → Stick to Tailwind utilities
    └── YES → Create utility classes in globals.css
```

### 🎯 **User Experience Decision Tree**
```
UX PATTERN NEEDED?
├── Data display → Choose appropriate pattern
│   ├── Large datasets → Use tables with pagination
│   ├── Dashboard metrics → Use card layouts
│   ├── Lists → Use virtualization for 100+ items
│   └── Detailed views → Use drawer or modal patterns
├── User input → Choose form pattern
│   ├── Simple forms → React Hook Form + Zod
│   ├── Multi-step → Wizard pattern with progress
│   ├── Complex forms → Split into sections/tabs
│   └── Real-time → Use Supabase subscriptions
├── Navigation → Choose navigation pattern
│   ├── Admin areas → Sidebar with nested menus
│   ├── Client areas → Top navigation with breadcrumbs
│   ├── Mobile → Bottom tab navigation
│   └── Complex flows → Breadcrumb navigation
└── Feedback → Choose feedback pattern
    ├── Success → Toast notifications
    ├── Errors → Inline validation messages
    ├── Loading → Skeleton screens or spinners
    └── Empty states → Helpful guidance and actions
```

---

## 🗄️ **DATABASE DEVELOPMENT DECISIONS**

### 🗄️ **Query Pattern Decision Tree**
```
DATABASE OPERATION NEEDED?
├── Single record → Use .single() with proper error handling
│   ├── By ID → Use .eq('id', id)
│   ├── By unique field → Use .eq('field', value)
│   └── With relations → Use select with joins
├── Multiple records → Choose fetching strategy
│   ├── Small dataset (< 100) → Fetch all at once
│   ├── Medium dataset (100-1000) → Use pagination
│   ├── Large dataset (> 1000) → Use virtual scrolling
│   └── Real-time → Add Supabase subscription
├── Complex queries → Optimize query structure
│   ├── Multiple tables → Use joins in select
│   ├── Aggregations → Use Postgres functions
│   ├── Filtering → Use indexed columns when possible
│   └── Sorting → Add database indexes for performance
└── Mutations → Choose mutation pattern
    ├── Single insert → Use .insert().single()
    ├── Bulk operations → Use .insert() with array
    ├── Updates → Use .update() with .eq()
    └── Upserts → Use .upsert() for insert-or-update
```

### 🔄 **State Management Decision Tree**
```
STATE MANAGEMENT NEEDED?
├── Local component state → Use useState or useReducer
│   ├── Simple state → useState
│   ├── Complex state → useReducer
│   └── Computed state → useMemo for derived values
├── Cross-component state → Choose sharing strategy
│   ├── Parent-child → Props passing
│   ├── Distant components → Context or global state
│   ├── Form state → React Hook Form
│   └── URL state → URL params or search params
├── Server state → Use React Query
│   ├── Fetching → useQuery with proper keys
│   ├── Mutations → useMutation with optimistic updates
│   ├── Real-time → Combine with Supabase subscriptions
│   └── Caching → Configure stale time and cache time
└── Global state → Use Jotai atoms
    ├── User state → Global user atom
    ├── App settings → Global settings atom
    ├── UI state → Modal, drawer, theme atoms
    └── Business logic → Feature-specific atoms
```

### 🔒 **Security Decision Tree**
```
SECURITY CONSIDERATION?
├── Authentication → Check user state
│   ├── Protected route → Use auth guard component
│   ├── Conditional rendering → Check user permissions
│   ├── API calls → Include auth headers
│   └── Sensitive data → Validate user access
├── Authorization → Check permissions
│   ├── Admin features → Check admin role
│   ├── Client data → Verify client relationship
│   ├── User data → Ensure user ownership
│   └── Public data → No restrictions needed
├── Data validation → Validate all inputs
│   ├── Client-side → Zod schemas for forms
│   ├── Database → Use RLS policies
│   ├── API → Validate request payloads
│   └── URLs → Sanitize dynamic content
└── Error handling → Secure error responses
    ├── User errors → Friendly error messages
    ├── System errors → Log without exposing details
    ├── Auth errors → Generic "unauthorized" messages
    └── Validation errors → Specific field feedback
```

---

## 🚀 **FEATURE DEVELOPMENT DECISIONS**

### 🎯 **Feature Architecture Decision Tree**
```
NEW FEATURE DEVELOPMENT?
├── Feature scope analysis
│   ├── Single page → Create page component + hooks
│   ├── Multiple pages → Create feature folder structure
│   ├── Cross-cutting → Create shared utilities/hooks
│   └── Integration → Plan API and database changes
├── Component organization
│   ├── Feature-specific → Create in feature folder
│   ├── Reusable → Add to shared components
│   ├── Complex → Split into subcomponents
│   └── External → Consider third-party libraries
├── Data layer design
│   ├── New tables → Design schema with relationships
│   ├── Existing tables → Plan column additions
│   ├── Complex queries → Consider database functions
│   └── Real-time needs → Plan subscription patterns
└── Integration points
    ├── Other features → Check dependencies
    ├── External APIs → Plan integration patterns
    ├── User permissions → Design access controls
    └── Business logic → Plan validation rules
```

### 🔄 **API Integration Decision Tree**
```
API INTEGRATION NEEDED?
├── Internal API → Use Supabase patterns
│   ├── Simple CRUD → Direct table operations
│   ├── Complex logic → Use Postgres functions
│   ├── Real-time → Add subscriptions
│   └── Batch operations → Use transactions
├── External API → Choose integration approach
│   ├── Simple HTTP → Use fetch with error handling
│   ├── Authentication → Secure credential storage
│   ├── Rate limiting → Implement retry logic
│   └── Complex workflows → Create dedicated service
├── Data transformation → Plan data mapping
│   ├── Simple mapping → Transform in components
│   ├── Complex mapping → Create utility functions
│   ├── Validation → Use Zod schemas
│   └── Caching → Use React Query
└── Error handling → Plan error scenarios
    ├── Network errors → Retry with exponential backoff
    ├── API errors → Parse and display user-friendly messages
    ├── Timeout errors → Provide fallback or retry options
    └── Auth errors → Redirect to login or refresh tokens
```

---

## 🐛 **DEBUGGING AND MAINTENANCE DECISIONS**

### 🐛 **Issue Resolution Decision Tree**
```
BUG IDENTIFIED?
├── Reproduce issue → Verify bug exists
│   ├── Local reproduction → Debug locally first
│   ├── Environment specific → Check environment differences
│   ├── User-specific → Check user permissions/data
│   └── Intermittent → Add logging to identify patterns
├── Classify issue severity
│   ├── Critical → Immediate fix required
│   │   ├── Data loss → Restore data + fix
│   │   ├── System down → Emergency fix + deploy
│   │   └── Security issue → Patch + security review
│   ├── High → Fix in current sprint
│   │   ├── Feature broken → Fix core functionality
│   │   ├── User workflow blocked → Provide workaround + fix
│   │   └── Performance issue → Optimize queries/code
│   ├── Medium → Plan for next sprint
│   │   ├── Minor functionality → Schedule fix
│   │   ├── UI/UX issue → Improve user experience
│   │   └── Technical debt → Refactor code
│   └── Low → Add to backlog
│       ├── Nice-to-have → Consider for future release
│       ├── Edge case → Document workaround
│       └── Cosmetic → Schedule when time allows
└── Fix strategy
    ├── Quick fix → Minimal change, test thoroughly
    ├── Proper fix → Refactor code, add tests
    ├── Architectural → May require design changes
    └── Workaround → Temporary solution while planning proper fix
```

### 🔧 **Code Quality Decision Tree**
```
CODE QUALITY CONCERN?
├── Performance issue → Identify bottleneck
│   ├── Rendering → Use React.memo, useMemo, useCallback
│   ├── Database → Optimize queries, add indexes
│   ├── Network → Implement caching, reduce requests
│   └── Bundle size → Code splitting, tree shaking
├── Maintainability issue → Refactor code
│   ├── Complex function → Split into smaller functions
│   ├── Duplicate code → Extract shared utilities
│   ├── Poor naming → Rename for clarity
│   └── Missing tests → Add unit/integration tests
├── Security concern → Address vulnerability
│   ├── Input validation → Add Zod validation
│   ├── Authentication → Strengthen auth checks
│   ├── Data exposure → Review RLS policies
│   └── XSS/injection → Sanitize inputs/outputs
└── Documentation gap → Add documentation
    ├── Complex logic → Add inline comments
    ├── New feature → Update feature docs
    ├── API changes → Update API documentation
    └── Decision rationale → Add to decision log
```

---

## 📊 **DECISION OUTCOME TRACKING**

### 📝 **Decision Documentation Pattern**
For each significant decision made using these trees:

1. **Record in `docs/decisions/`** with context and rationale
2. **Update relevant feature documentation**
3. **Add to templates if pattern is reusable**
4. **Update decision trees if new patterns emerge**

### 🔄 **Continuous Improvement**
- **Review decisions** after implementation to validate choices
- **Update trees** based on real-world outcomes
- **Add new scenarios** as project complexity grows
- **Simplify trees** when patterns become well-established

---

**🌳 DECISION TREES STATUS**: Comprehensive autonomous decision framework ready for SISO Agency Platform development, covering UI/UX, database, feature development, and maintenance scenarios with clear, actionable paths for optimal outcomes.