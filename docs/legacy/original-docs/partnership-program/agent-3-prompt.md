# 💾 **AGENT 3 PROMPT: Backend Integration & Database Setup**

---

## 🎯 **YOUR MISSION**

You are tasked with setting up the complete backend infrastructure for the partnership program, including Supabase database schema, API endpoints, and email integration. This is the foundation that will power both the landing page and partner dashboard.

---

## 🗄️ **DATABASE SCHEMA CREATION**

### **Tables to Create in Supabase**:

#### **1. partner_applications**
```sql
CREATE TABLE partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  company VARCHAR(255),
  network_description TEXT,
  expected_referrals INTEGER,
  experience_level VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **2. partners**
```sql
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES partner_applications(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  company VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'Bronze', -- Bronze, Silver, Gold, Platinum
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **3. client_leads**
```sql
CREATE TABLE client_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  business_name VARCHAR(255),
  project_description TEXT,
  estimated_value DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'prospect', -- prospect, qualified, mvp, signed, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **4. commissions**
```sql
CREATE TABLE commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  client_lead_id UUID REFERENCES client_leads(id),
  project_value DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  commission_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **5. app_plans**
```sql
CREATE TABLE app_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_lead_id UUID REFERENCES client_leads(id),
  partner_id UUID REFERENCES partners(id),
  business_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  features JSONB,
  timeline_estimate VARCHAR(100),
  investment_range VARCHAR(100),
  generated_content TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, shared, approved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Row Level Security (RLS) Policies**:
```sql
-- Enable RLS on all tables
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_plans ENABLE ROW LEVEL SECURITY;

-- Partners can only see their own data
CREATE POLICY "Partners can view own data" ON partners
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Partners can view own leads" ON client_leads
  FOR ALL USING (partner_id IN (SELECT id FROM partners WHERE auth.uid()::text = id::text));
```

---

## 🔗 **API ENDPOINTS & INTEGRATION**

### **Create These New Files**:
- `src/api/partnership.ts`
- `src/hooks/usePartnerApplication.ts`
- `src/hooks/usePartnerStats.ts`
- `src/types/partnership.ts`

### **API Functions to Implement**:

#### **`src/api/partnership.ts`**:
```typescript
// Application submission
export async function submitPartnerApplication(data: PartnerApplicationData)
export async function getApplicationStatus(email: string)

// Statistics for landing page
export async function getPartnershipStats()
export async function getLeaderboardData(period: 'monthly' | 'quarterly' | 'yearly')

// Partner dashboard data
export async function getPartnerProfile(partnerId: string)
export async function getPartnerCommissions(partnerId: string)
export async function getPartnerLeads(partnerId: string)
```

#### **`src/hooks/usePartnerApplication.ts`**:
```typescript
export function usePartnerApplication() {
  // Handle form submission with loading states
  // Show success/error messages
  // Trigger email notifications
}
```

#### **`src/hooks/usePartnerStats.ts`**:
```typescript
export function usePartnerStats() {
  // Fetch real-time statistics for landing page
  // Replace mock data in PartnershipStats component
  // Cache data with SWR or React Query
}
```

### **TypeScript Interfaces**:

#### **`src/types/partnership.ts`**:
```typescript
export interface PartnerApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  networkDescription: string;
  expectedReferrals: number;
  experienceLevel: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalEarnings: number;
  totalDeals: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface PartnershipStats {
  activePartners: number;
  totalCommissionsPaid: number;
  successfulProjects: number;
  averageCommission: number;
}
```

---

## 📧 **EMAIL INTEGRATION SETUP**

### **Create Supabase Edge Functions**:

#### **`supabase/functions/partner-application-notification/index.ts`**:
```typescript
// Triggered when new application is submitted
// Send confirmation email to applicant
// Send notification email to admin team
// Update application status
```

#### **`supabase/functions/partner-welcome-email/index.ts`**:
```typescript
// Triggered when application is approved
// Send welcome email with dashboard access
// Provide onboarding materials
// Set up partner account
```

### **Email Templates**:
- **Application Confirmation**: "Thank you for applying to our partnership program"
- **Application Approval**: "Welcome to the SISO Partnership Program"
- **Commission Notification**: "You've earned a new commission"
- **Monthly Report**: "Your partnership performance summary"

---

## 🔄 **DATA MIGRATION & SEEDING**

### **Create Migration Files**:
- `supabase/migrations/20250125_create_partnership_tables.sql`
- `supabase/migrations/20250125_setup_rls_policies.sql`

### **Sample Data for Testing**:

#### **`supabase/seed.sql`**:
```sql
-- Insert sample partner applications
INSERT INTO partner_applications (name, email, phone, company, network_description, expected_referrals, status) VALUES
('Sarah Johnson', 'sarah@example.com', '+44 7700 900123', 'Johnson Consulting', 'Network of 50+ small businesses', 5, 'approved'),
('Mike Chen', 'mike@example.com', '+44 7700 900124', 'Chen Digital', 'Tech startup connections', 3, 'approved'),
('Emma Davis', 'emma@example.com', '+44 7700 900125', 'Davis Marketing', 'Local business network', 4, 'pending');

-- Insert sample partners
INSERT INTO partners (name, email, tier, total_earnings, total_deals) VALUES
('Sarah Johnson', 'sarah@example.com', 'Platinum', 4500.00, 18),
('Mike Chen', 'mike@example.com', 'Gold', 3200.00, 12),
('Emma Davis', 'emma@example.com', 'Silver', 1800.00, 7);
```

---

## 🔧 **SUPABASE CONFIGURATION**

### **Environment Variables**:
```typescript
// Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Supabase Client Setup**:
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📚 **REFERENCE DOCUMENTATION**

**Essential Reading**:
- `docs/partnership-program/comprehensive-todo-list.md` (Section 3.1)
- `docs/partnership-program/partnership-program-current-status.md`

**Supabase Documentation**:
- Row Level Security (RLS) setup
- Edge Functions deployment
- Database migrations

---

## ✅ **SUCCESS CRITERIA**

Your task is complete when:
- [ ] Complete database schema with proper relationships
- [ ] Working API endpoints for form submissions
- [ ] Real-time statistics data integration
- [ ] Email notifications for applications and approvals
- [ ] Proper security policies and data validation
- [ ] Sample data for testing and development

---

## 🚀 **GETTING STARTED**

1. **First**: Set up Supabase project and create database schema
2. **Second**: Implement API functions and TypeScript interfaces
3. **Third**: Create email integration with Edge Functions
4. **Fourth**: Add sample data and test all endpoints

**Testing**: Use Supabase dashboard and API testing tools

---

**🎯 Priority**: 🔴 **CRITICAL - Foundation for entire system**  
**💾 Focus**: Data integrity, security, and performance  
**⏱️ Estimated Time**: 3-4 prompts to complete all backend setup