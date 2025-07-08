# 🗄️ **Supabase MCP Integration Guide for SISO Agency Platform**

---

## 🎯 **Supabase MCP Setup for Autonomous Development**

### 🔧 **MCP Configuration**
```json
{
  "mcps": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/cli", "mcp"],
      "env": {
        "SUPABASE_PROJECT_URL": "your-project-url",
        "SUPABASE_ANON_KEY": "your-anon-key",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
      }
    }
  }
}
```

### 🚀 **Autonomous Database Operations**
Claude Code should leverage Supabase MCP for:
- **Real-time database testing** during development
- **Schema validation** before implementation
- **Query optimization** and performance testing
- **Data relationship verification** across complex schema
- **Migration testing** and rollback scenarios

---

## 🏗️ **SISO DATABASE ARCHITECTURE OVERVIEW**

### 📊 **Core Agency Management Tables**

#### **Client Management System**
- **`client_onboarding`** - Multi-step client setup process
- **`client_documents`** - Document management per client
- **`client_plans`** - Plan assignments and tracking
- **`client_user_auth`** - Authentication linking
- **`client_user_links`** - User-client relationships

#### **Task & Project Management**
- **`tasks`** - Advanced task system with categories and priorities
- **`task_rollover_history`** - Task rollover tracking
- **`projects`** - Project lifecycle management
- **`project_features`** - Feature breakdown and tracking
- **`project_documentation`** - Project documentation system
- **`calendar_events`** - Calendar integration

#### **Instagram Lead Generation**
- **`instagram_leads`** - Lead data and outreach status
- **`instagram_posts`** - Post tracking and engagement
- **`outreach_campaigns`** - Campaign management
- **`outreach_activities`** - Activity logging and tracking
- **`outreach_accounts`** - Account management

#### **Financial Management**
- **`financial_transactions`** - Income and expense tracking
- **`invoices`** - Invoice management
- **`payment_methods`** - Payment options
- **`expense_categories`** - Expense categorization
- **`vendors`** - Vendor management

#### **Agency Operations**
- **`agency_pain_points`** - Problem identification
- **`agency_types`** - Agency categorization
- **`case_studies`** - Success stories and examples
- **`plan_templates`** - Reusable plan structures
- **`bulk_plan_creations`** - Bulk operations

#### **User Engagement System**
- **`profiles`** - User profiles and business info
- **`points_log`** - Point earning tracking
- **`leaderboard_entries`** - Ranking system
- **`user_skill_progress`** - Skill development tracking
- **`login_streaks`** - Engagement tracking

---

## 🔧 **AUTONOMOUS DATABASE WORKFLOWS**

### 🎯 **Query Patterns for Agency Operations**

#### **Client Onboarding Workflow**
```typescript
// Autonomous client creation with full validation
const createClientWorkflow = async (clientData: ClientOnboardingData) => {
  // 1. Validate data structure
  const validatedData = clientOnboardingSchema.parse(clientData)
  
  // 2. Create client record
  const { data: client, error: clientError } = await supabase
    .from('client_onboarding')
    .insert({
      company_name: validatedData.companyName,
      contact_name: validatedData.contactName,
      email: validatedData.email,
      project_name: validatedData.projectName,
      current_step: 1,
      total_steps: 5,
      status: 'active'
    })
    .select()
    .single()

  if (clientError) throw new Error(`Client creation failed: ${clientError.message}`)

  // 3. Create initial client documents
  const { error: docError } = await supabase
    .from('client_documents')
    .insert([
      {
        client_id: client.id,
        title: 'Welcome Document',
        document_type: 'welcome',
        content: 'Welcome to SISO agency platform...'
      },
      {
        client_id: client.id,
        title: 'Project Requirements',
        document_type: 'requirements',
        content: ''
      }
    ])

  if (docError) throw new Error(`Document creation failed: ${docError.message}`)

  return client
}
```

#### **Task Management Automation**
```typescript
// Autonomous task creation with rollover logic
const createTaskWithRollover = async (taskData: TaskCreationData) => {
  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert({
      title: taskData.title,
      description: taskData.description,
      category: taskData.category, // main, weekly, daily, siso_app_dev, onboarding_app, instagram
      priority: taskData.priority, // low, medium, high, urgent
      assigned_to: taskData.assignedTo,
      assigned_client_id: taskData.clientId,
      due_date: taskData.dueDate,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw new Error(`Task creation failed: ${error.message}`)

  // Auto-create calendar event if due date exists
  if (taskData.dueDate) {
    await supabase
      .from('calendar_events')
      .insert({
        title: `Task: ${taskData.title}`,
        start_time: taskData.dueDate,
        end_time: new Date(new Date(taskData.dueDate).getTime() + 60 * 60 * 1000), // 1 hour duration
        task_id: newTask.id,
        user_id: taskData.assignedTo
      })
  }

  return newTask
}
```

#### **Instagram Lead Outreach Pipeline**
```typescript
// Autonomous lead processing with outreach tracking
const processInstagramLead = async (leadData: InstagramLeadData) => {
  // 1. Create or update lead
  const { data: lead, error: leadError } = await supabase
    .from('instagram_leads')
    .upsert({
      username: leadData.username,
      full_name: leadData.fullName,
      bio: leadData.bio,
      followers_count: leadData.followersCount,
      following_count: leadData.followingCount,
      posts_count: leadData.postsCount,
      is_verified: leadData.isVerified,
      status: 'new',
      outreach_account: leadData.outreachAccount
    })
    .select()
    .single()

  if (leadError) throw new Error(`Lead processing failed: ${leadError.message}`)

  // 2. Create outreach activity
  const { error: activityError } = await supabase
    .from('outreach_activities')
    .insert({
      lead_id: lead.id,
      activity_type: 'initial_contact',
      status: 'scheduled',
      scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      account_id: leadData.outreachAccountId
    })

  if (activityError) throw new Error(`Activity creation failed: ${activityError.message}`)

  return lead
}
```

### 📊 **Analytics & Reporting Queries**

#### **Agency Performance Dashboard**
```typescript
// Autonomous dashboard data aggregation
const getDashboardMetrics = async (userId: string) => {
  // Batch queries for efficiency
  const [
    clientsData,
    tasksData,
    leadsData,
    portfolioData,
    revenueData
  ] = await Promise.all([
    // Active clients count
    supabase
      .from('client_onboarding')
      .select('id', { count: 'exact' })
      .eq('status', 'active'),
    
    // Task completion stats
    supabase
      .from('tasks')
      .select('status', { count: 'exact' })
      .eq('assigned_to', userId),
    
    // Lead conversion metrics
    supabase
      .from('instagram_leads')
      .select('status, app_plan_status', { count: 'exact' })
      .eq('assigned_to', userId),
    
    // Portfolio completion
    supabase
      .from('portfolio_items')
      .select('development_status', { count: 'exact' })
      .eq('user_id', userId),
    
    // Revenue tracking
    supabase
      .from('financial_transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .eq('type', 'income')
  ])

  return {
    clients: {
      total: clientsData.count || 0,
      active: clientsData.count || 0
    },
    tasks: {
      total: tasksData.count || 0,
      completed: tasksData.data?.filter(t => t.status === 'completed').length || 0
    },
    leads: {
      total: leadsData.count || 0,
      converted: leadsData.data?.filter(l => l.app_plan_status === 'completed').length || 0
    },
    portfolio: {
      total: portfolioData.count || 0,
      completed: portfolioData.data?.filter(p => p.development_status === 'completed').length || 0
    },
    revenue: {
      total: revenueData.data?.reduce((sum, t) => sum + t.amount, 0) || 0,
      thisMonth: revenueData.data?.filter(t => 
        new Date(t.created_at).getMonth() === new Date().getMonth()
      ).reduce((sum, t) => sum + t.amount, 0) || 0
    }
  }
}
```

---

## 🔄 **REAL-TIME SUBSCRIPTIONS FOR AGENCY OPERATIONS**

### ⚡ **Critical Real-time Updates**

#### **Task Status Changes**
```typescript
// Autonomous real-time task tracking
const subscribeToTaskUpdates = (userId: string) => {
  return supabase
    .channel('task-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `assigned_to=eq.${userId}`
      },
      (payload) => {
        // Auto-update UI state
        queryClient.invalidateQueries(['tasks', userId])
        
        // Auto-create notifications
        if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
          // Award points for completion
          awardPointsForTaskCompletion(payload.new.id)
        }
      }
    )
    .subscribe()
}
```

#### **Client Progress Updates**
```typescript
// Autonomous client progress tracking
const subscribeToClientProgress = () => {
  return supabase
    .channel('client-progress')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'client_onboarding'
      },
      (payload) => {
        // Auto-advance workflow if step completed
        if (payload.new.current_step > payload.old.current_step) {
          autoAdvanceClientWorkflow(payload.new.id)
        }
      }
    )
    .subscribe()
}
```

---

## 🛠️ **ERROR HANDLING & VALIDATION PATTERNS**

### 🚨 **Autonomous Error Recovery**

#### **Database Connection Issues**
```typescript
// Resilient database operations with retry logic
const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error)
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  throw new Error('Max retries exceeded')
}
```

#### **Data Validation with Zod**
```typescript
// Comprehensive validation schemas
const clientOnboardingSchema = z.object({
  companyName: z.string().min(1, 'Company name required'),
  contactName: z.string().min(1, 'Contact name required'),
  email: z.string().email('Valid email required'),
  projectName: z.string().min(1, 'Project name required'),
  companyNiche: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal(''))
})

const taskCreationSchema = z.object({
  title: z.string().min(1, 'Task title required'),
  description: z.string().optional(),
  category: z.enum(['main', 'weekly', 'daily', 'siso_app_dev', 'onboarding_app', 'instagram']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedTo: z.string().uuid('Valid user ID required'),
  clientId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional()
})
```

---

## 📊 **PERFORMANCE OPTIMIZATION PATTERNS**

### ⚡ **Query Optimization for Large Datasets**

#### **Efficient Pagination**
```typescript
// Autonomous pagination with cursor-based loading
const getPaginatedLeads = async (
  pageSize = 20,
  cursor?: string,
  filters?: LeadFilters
) => {
  let query = supabase
    .from('instagram_leads')
    .select(`
      id,
      username,
      full_name,
      followers_count,
      status,
      app_plan_status,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(pageSize)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.minFollowers) {
    query = query.gte('followers_count', filters.minFollowers)
  }

  const { data, error } = await query

  if (error) throw new Error(`Lead pagination failed: ${error.message}`)

  return {
    data,
    nextCursor: data.length === pageSize ? data[data.length - 1].created_at : null,
    hasMore: data.length === pageSize
  }
}
```

#### **Optimized Joins and Aggregations**
```typescript
// Complex data aggregation with proper joins
const getClientDashboardData = async (clientId: string) => {
  const { data, error } = await supabase
    .from('client_onboarding')
    .select(`
      id,
      company_name,
      project_name,
      current_step,
      total_steps,
      status,
      client_documents(
        id,
        title,
        document_type,
        created_at
      ),
      tasks:tasks!assigned_client_id(
        id,
        title,
        status,
        priority,
        due_date
      ),
      client_plans(
        id,
        status,
        project_plans(
          id,
          name,
          description
        )
      )
    `)
    .eq('id', clientId)
    .single()

  if (error) throw new Error(`Client dashboard data failed: ${error.message}`)

  return data
}
```

---

## 🎯 **AUTONOMOUS TESTING WITH SUPABASE MCP**

### 🧪 **Database Testing Patterns**

#### **Schema Validation Testing**
```typescript
// Autonomous schema compliance testing
const validateDatabaseSchema = async () => {
  // Test critical table relationships
  const tests = [
    {
      name: 'Client-Task Relationship',
      query: () => supabase
        .from('tasks')
        .select('assigned_client_id, client_onboarding(*)')
        .not('assigned_client_id', 'is', null)
        .limit(1)
    },
    {
      name: 'User-Portfolio Relationship',
      query: () => supabase
        .from('portfolio_items')
        .select('user_id, profiles(*)')
        .limit(1)
    },
    {
      name: 'Lead-Outreach Relationship',
      query: () => supabase
        .from('outreach_activities')
        .select('lead_id, instagram_leads(*)')
        .limit(1)
    }
  ]

  for (const test of tests) {
    try {
      const { data, error } = await test.query()
      if (error) throw error
      console.log(`✅ ${test.name}: PASSED`)
    } catch (error) {
      console.error(`❌ ${test.name}: FAILED`, error)
    }
  }
}
```

#### **Data Integrity Verification**
```typescript
// Autonomous data consistency checks
const verifyDataIntegrity = async () => {
  // Check for orphaned records
  const orphanedTasks = await supabase
    .from('tasks')
    .select('id, assigned_client_id')
    .not('assigned_client_id', 'is', null)
    .not('assigned_client_id', 'in', 
      `(${await supabase.from('client_onboarding').select('id')})`
    )

  if (orphanedTasks.data?.length) {
    console.warn('Found orphaned tasks:', orphanedTasks.data)
  }

  // Verify enum constraints
  const invalidTaskCategories = await supabase
    .from('tasks')
    .select('id, category')
    .not('category', 'in', 
      '(main,weekly,daily,siso_app_dev,onboarding_app,instagram)'
    )

  if (invalidTaskCategories.data?.length) {
    console.error('Invalid task categories found:', invalidTaskCategories.data)
  }
}
```

---

## 🚀 **AUTONOMOUS DEVELOPMENT CHECKLIST**

### ✅ **Pre-Implementation Validation**
1. **Schema Understanding** - Review relevant table structures
2. **Relationship Mapping** - Understand foreign key constraints
3. **Enum Validation** - Verify allowed values for enum fields
4. **Index Optimization** - Consider query performance implications
5. **Security Rules** - Understand RLS policies and permissions

### ⚡ **Implementation Verification**
1. **Type Safety** - Ensure TypeScript compatibility
2. **Error Handling** - Implement comprehensive try/catch blocks
3. **Performance Testing** - Verify query efficiency
4. **Real-time Testing** - Validate subscription functionality
5. **Data Validation** - Confirm Zod schema compliance

### 🎯 **Post-Implementation Testing**
1. **Integration Testing** - Verify end-to-end workflows
2. **Performance Monitoring** - Check for query bottlenecks
3. **Error Logging** - Implement proper error tracking
4. **User Experience** - Validate loading states and feedback
5. **Documentation** - Update implementation notes

---

**🚀 SUPABASE MCP READY**: Claude Code is equipped with comprehensive database integration patterns for autonomous development of the SISO Agency Platform, enabling efficient, reliable, and scalable agency management operations.