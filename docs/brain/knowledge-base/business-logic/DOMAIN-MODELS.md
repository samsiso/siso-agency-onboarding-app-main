# BUSINESS DOMAIN MODELS

## 🏢 **Core Domain Architecture**

### **Primary Business Entities**
1. **Client Management** - Client onboarding, projects, documents
2. **Task System** - Task management with categories and priorities  
3. **Partnership Program** - Partner applications, leads, commissions
4. **Instagram Leads** - Lead generation and outreach campaigns
5. **Portfolio Management** - Project showcases and case studies
6. **User Engagement** - Points, achievements, leaderboards
7. **Financial Management** - Payments, expenses, invoicing

## 👥 **Client Management Domain**

### **Client Lifecycle States**
```typescript
// Client Status Progression
'prospect' → 'qualified' → 'onboarding' → 'active' → 'completed' | 'cancelled'

// Onboarding Steps Flow
current_step / total_steps (e.g., 3/7)
completed_steps: string[] // Track progress granularly
```

### **Client Data Model**
```typescript
interface ClientData {
  // Identity
  id: string;
  full_name: string;
  email: string | null;
  business_name: string | null;
  phone: string | null;

  // Business Context
  project_name?: string | null;
  company_niche?: string | null;
  professional_role?: string | null;
  website_url?: string | null;

  // Project Status
  status: string; // Client lifecycle state
  progress?: string | null;
  current_step: number;
  total_steps: number;
  completed_steps: string[];

  // Project Management
  development_url?: string | null;
  mvp_build_status?: string | null;
  notion_plan_url?: string | null;
  
  // Financial
  payment_status?: string | null;
  estimated_price?: number | null;

  // Timeline
  initial_contact_date?: string | null;
  start_date?: string | null;
  estimated_completion_date?: string | null;

  // Task Management
  todos?: TodoItem[];
  next_steps?: string | null;
  key_research?: string | null;
  priority?: string | null;
}
```

### **Client Document Types**
```typescript
type DocumentType = 'app_plan' | 'functionalities' | 'wireframes' | 'inspiration';

// Document Management Rules
- app_plan: Primary project specification
- functionalities: Feature requirements and technical specs  
- wireframes: UI/UX design mockups
- inspiration: Reference materials and design inspiration
```

## ✅ **Task Management Domain**

### **Task Categories & Hierarchy**
```typescript
type TaskCategory = 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram';

// Category Business Rules:
// 'main' - Primary project tasks
// 'weekly' - Recurring weekly activities  
// 'daily' - Daily operational tasks
// 'siso_app_dev' - Platform development tasks
// 'onboarding_app' - Client onboarding specific
// 'instagram' - Lead generation and social media
```

### **Priority System**
```typescript
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Priority Ordering Rules
const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

// Visual Priority Mapping
const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400', 
  high: 'bg-red-500/20 text-red-400',
  urgent: 'bg-red-600/30 text-red-300' // Most critical
};
```

### **Task Status Workflow**
```typescript
type TaskStatus = 'pending' | 'in_progress' | 'completed';

// Status Transition Rules
'pending' → 'in_progress' → 'completed'
// Or: 'pending' → 'completed' (quick completion)
// Or: 'in_progress' → 'pending' (put back in queue)
```

### **Task Rollover Logic**
```typescript
interface Task {
  rolled_over_from?: string; // Original task ID if rolled over
  recurring_type?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurring_days?: string[]; // For weekly: ['monday', 'wednesday']
}

// Rollover Business Rules:
// - Incomplete tasks can roll to next period
// - Maintains link to original task for tracking
// - Recurring tasks auto-generate based on schedule
```

## 🤝 **Partnership Program Domain**

### **Partner Application Flow**
```typescript
type PartnerApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Application → Review → Decision → Onboarding (if approved)
```

### **Partner Tier System**
```typescript
type PartnerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

// Tier Progression Logic
interface TierRequirements {
  Bronze: { earnings: 0, deals: 0 };      // Entry level
  Silver: { earnings: 5000, deals: 3 };   // Established
  Gold: { earnings: 15000, deals: 10 };   // High performer
  Platinum: { earnings: 50000, deals: 25 }; // Elite partner
}
```

### **Lead Management Workflow**
```typescript
type ClientLeadStatus = 'prospect' | 'qualified' | 'proposal_sent' | 'negotiating' | 'closed_won' | 'closed_lost';

// Lead Lifecycle:
prospect → qualified → proposal_sent → negotiating → closed_won/closed_lost

// Commission Triggers:
// - qualified: Lead accepted and validated
// - closed_won: Deal completed, commission earned
```

### **Commission Structure**
```typescript
type CommissionStatus = 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';

// Commission Calculation Logic:
// 1. Lead value × partner tier rate = commission amount
// 2. Commission pending until deal closes
// 3. Approval process before payment
// 4. Payment processing and tracking
```

## 📱 **Instagram Leads Domain**

### **Lead Generation Workflow**
```typescript
// Lead Sources
type LeadSource = 'instagram_dm' | 'instagram_comment' | 'referral' | 'organic' | 'paid_ad';

// Lead Qualification Stages  
'unqualified' → 'qualified' → 'contacted' → 'proposal_sent' → 'closed'

// Outreach Campaign Logic
interface OutreachCampaign {
  target_audience: string;
  message_templates: string[];
  follow_up_sequence: string[];
  success_metrics: {
    response_rate: number;
    conversion_rate: number;
  };
}
```

## 💰 **Financial Management Domain**

### **Payment Status Workflow**
```typescript
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

// Payment Lifecycle:
pending → partial → paid
// Or: pending → paid (full payment)
// Or: pending → overdue (missed deadline)
```

### **Expense Categories**
```typescript
// Business expense categorization
type ExpenseCategory = 'software' | 'marketing' | 'hardware' | 'travel' | 'education' | 'other';

// Expense Validation Rules:
// - Require receipt for amounts > $50
// - Auto-categorize based on vendor patterns
// - Tax deductible flagging
```

## 🎯 **User Engagement Domain**

### **Points System Logic**
```typescript
// Point Allocation Rules
const pointsSystem = {
  task_completed: 10,
  daily_checkin: 5,
  perfect_week: 50,
  client_milestone: 25,
  course_completed: 30,
  referral_successful: 100
};

// Achievement Triggers
interface Achievement {
  id: string;
  name: string;
  description: string;
  points_required?: number;
  tasks_required?: number;
  streak_required?: number;
  badge_icon: string;
}
```

### **Leaderboard Rankings**
```typescript
// Ranking Criteria
interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  streak_days: number;
  rank: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Ranking Algorithm:
// 1. Primary: Total points accumulated
// 2. Secondary: Recent activity (weekly/monthly)
// 3. Tiebreaker: Current streak length
```

## 📊 **Data Validation Rules**

### **Client Validation**
```typescript
const clientValidation = {
  email: 'required|email',
  business_name: 'required|min:2',
  phone: 'optional|phone_format',
  estimated_price: 'optional|number|min:0',
  priority: 'required|in:low,medium,high,urgent'
};
```

### **Task Validation**
```typescript
const taskValidation = {
  title: 'required|min:3|max:100',
  priority: 'required|in:low,medium,high,urgent',
  category: 'required|in:main,weekly,daily,siso_app_dev,onboarding_app,instagram',
  due_date: 'optional|date|after:today',
  assigned_to: 'required|exists:users,id'
};
```

### **Partnership Validation**
```typescript
const partnershipValidation = {
  name: 'required|min:2|max:50',
  email: 'required|email|unique:partners',
  expected_referrals: 'required|number|min:1|max:100',
  experience_level: 'required|in:beginner,intermediate,advanced,expert',
  terms_accepted: 'required|boolean|true'
};
```

## 🔄 **Business Process Workflows**

### **Client Onboarding Process**
```typescript
// Step-by-step client journey
const onboardingSteps = [
  { step: 1, name: 'Initial Contact', duration: '1 day' },
  { step: 2, name: 'Requirements Gathering', duration: '2-3 days' },
  { step: 3, name: 'Proposal Creation', duration: '1-2 days' },
  { step: 4, name: 'Contract Negotiation', duration: '1-5 days' },
  { step: 5, name: 'Project Kickoff', duration: '1 day' },
  { step: 6, name: 'Development Phase', duration: '2-8 weeks' },
  { step: 7, name: 'Testing & Delivery', duration: '1-2 weeks' }
];

// Progress Tracking Logic:
// - Each step has validation criteria
// - Cannot proceed without completing prerequisites  
// - Automatic notifications for step transitions
// - Rollback capability for revisions
```

### **Partner Onboarding Process**
```typescript
const partnerOnboardingSteps = [
  { step: 1, name: 'Application Submission', auto: false },
  { step: 2, name: 'Application Review', duration: '2-5 days' },
  { step: 3, name: 'Interview Process', duration: '1 week' },
  { step: 4, name: 'Background Check', duration: '3-5 days' },
  { step: 5, name: 'Contract Execution', duration: '1-2 days' },
  { step: 6, name: 'Training & Certification', duration: '1 week' },
  { step: 7, name: 'Go-Live Activation', auto: true }
];
```

## ✅ **Business Rules Summary**

### **Critical Business Logic**
1. **Task Priority Ordering**: urgent > high > medium > low
2. **Client Progress Tracking**: Sequential step completion required
3. **Partner Tier Progression**: Based on earnings + deals closed
4. **Commission Calculation**: Deal value × tier rate
5. **Points System**: Activity-based with achievement bonuses
6. **Data Integrity**: All entities require proper validation
7. **Status Workflows**: Define allowed state transitions
8. **Rollover Logic**: Maintain task continuity across periods
9. **Real-time Updates**: Supabase subscriptions for live data
10. **Permission System**: Role-based access control (admin/client/partner)

---

**Usage**: Reference these domain models when implementing business logic to ensure consistency with established rules and workflows.