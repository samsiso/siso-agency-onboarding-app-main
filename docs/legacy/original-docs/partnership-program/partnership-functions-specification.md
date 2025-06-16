# 🚀 **SISO Partnership Program - Complete Functions Specification**

---

## 📊 **Document Overview**

**Created**: January 25, 2025  
**Purpose**: Complete specification of all functions needed for the SISO Partnership Program  
**Status**: Ready for Implementation  

---

## 🔍 **Current Implementation Analysis**

### ✅ **What's Already Built**
- **Frontend Components**: Complete partnership landing page with all UI components
- **API Structure**: Basic API functions defined in `src/api/partnership.ts`
- **TypeScript Types**: Comprehensive type definitions in `src/types/partnership.ts`
- **React Hooks**: Partner application hook with validation
- **UI Components**: Interactive calculator, stats display, process flow

### ❌ **What's Missing**
- **Database Schema**: No Supabase tables created yet
- **Backend Integration**: API functions not connected to real database
- **Email System**: No automated notifications
- **Authentication**: Partner login/dashboard not implemented
- **Commission Tracking**: No payment processing system

---

## 🗄️ **DATABASE FUNCTIONS NEEDED**

### **1. Database Schema Creation**
```sql
-- Partner Applications Table
CREATE TABLE partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  network_description TEXT NOT NULL,
  expected_referrals INTEGER DEFAULT 1,
  experience_level TEXT DEFAULT 'beginner',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Partners Table (approved partners)
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES partner_applications(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Client Leads Table
CREATE TABLE client_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  company_name TEXT,
  project_type TEXT NOT NULL,
  project_value DECIMAL(10,2),
  status TEXT DEFAULT 'referred' CHECK (status IN ('referred', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost')),
  notes TEXT,
  referred_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Commissions Table
CREATE TABLE commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  client_lead_id UUID REFERENCES client_leads(id),
  project_value DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed')),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Row Level Security (RLS) Policies**
```sql
-- Enable RLS on all tables
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Partners can view own data
CREATE POLICY "Partners view own applications" ON partner_applications
  FOR SELECT USING (email = auth.jwt()->>'email');

CREATE POLICY "Partners view own profile" ON partners
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners view own leads" ON client_leads
  FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

CREATE POLICY "Partners view own commissions" ON commissions
  FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
```

---

## 📧 **EMAIL AUTOMATION FUNCTIONS**

### **1. Application Confirmation Email**
**File**: `supabase/functions/partner-application-notification/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Send confirmation email to applicant
    await sendEmail({
      to: record.email,
      subject: "Partnership Application Received - SISO Agency",
      template: "application_confirmation",
      data: {
        name: record.name,
        application_id: record.id
      }
    })

    // Send notification to admin team
    await sendEmail({
      to: "partnerships@siso.agency",
      subject: "New Partnership Application",
      template: "admin_notification",
      data: {
        name: record.name,
        email: record.email,
        company: record.company,
        expected_referrals: record.expected_referrals
      }
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

### **2. Partner Welcome Email**
**File**: `supabase/functions/partner-welcome-email/index.ts`

```typescript
// Triggered when application status changes to 'approved'
// Send welcome email with login credentials
// Provide onboarding materials and dashboard access
```

### **3. Commission Notification Email**
**File**: `supabase/functions/commission-notification/index.ts`

```typescript
// Triggered when new commission is earned
// Send notification to partner about earnings
// Include payment timeline and details
```

---

## 🔐 **AUTHENTICATION FUNCTIONS**

### **1. Partner Registration**
**Function**: `registerPartner(applicationId: string)`
- Create auth user from approved application
- Link partner record to auth user
- Send welcome email with login credentials
- Trigger onboarding workflow

### **2. Partner Login Flow**
**Function**: `handlePartnerLogin()`
- Authenticate using Supabase Auth
- Check partner status (active/inactive/suspended)
- Redirect to appropriate dashboard
- Track login activity

### **3. Password Reset**
**Function**: `resetPartnerPassword(email: string)`
- Validate partner email exists
- Send reset email via Supabase Auth
- Log security event

---

## 📊 **DASHBOARD FUNCTIONS**

### **1. Partner Statistics**
**Function**: `getPartnerStats(partnerId: string)`

```typescript
export async function getPartnerStats(partnerId: string): Promise<PartnerStats> {
  // Get basic partner info
  const partner = await getPartnerProfile(partnerId)
  
  // Calculate total earnings
  const totalEarnings = await calculateTotalEarnings(partnerId)
  
  // Get pending commissions
  const pendingCommissions = await getPendingCommissions(partnerId)
  
  // Get lead conversion stats
  const conversionStats = await getConversionStats(partnerId)
  
  return {
    totalEarnings,
    pendingCommissions,
    totalLeads: conversionStats.totalLeads,
    convertedLeads: conversionStats.convertedLeads,
    conversionRate: conversionStats.rate,
    currentTier: partner.tier,
    monthlyPerformance: await getMonthlyPerformance(partnerId)
  }
}
```

### **2. Lead Management**
**Function**: `getPartnerLeads(partnerId: string, filters?: LeadFilters)`

```typescript
export async function getPartnerLeads(
  partnerId: string,
  filters?: LeadFilters
): Promise<ClientLead[]> {
  let query = supabase
    .from('client_leads')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.dateRange) {
    query = query.gte('created_at', filters.dateRange.start)
                 .lte('created_at', filters.dateRange.end)
  }

  const { data, error } = await query
  
  if (error) throw error
  return data || []
}
```

### **3. Commission Tracking**
**Function**: `getPartnerCommissions(partnerId: string)`

```typescript
export async function getPartnerCommissions(partnerId: string): Promise<Commission[]> {
  const { data, error } = await supabase
    .from('commissions')
    .select(`
      *,
      client_leads(client_name, project_type, project_value)
    `)
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
```

---

## 💰 **COMMISSION CALCULATION FUNCTIONS**

### **1. Calculate Commission**
**Function**: `calculateCommission(projectValue: number, partnerTier: string)`

```typescript
export function calculateCommission(projectValue: number, partnerTier: string): CommissionCalculation {
  const baseRate = 20 // 20% base commission
  
  // Tier bonuses
  const tierBonuses = {
    'Bronze': 0,
    'Silver': 2, // +2%
    'Gold': 5,   // +5%
    'Platinum': 8 // +8%
  }
  
  const totalRate = baseRate + (tierBonuses[partnerTier as keyof typeof tierBonuses] || 0)
  const commissionAmount = (projectValue * totalRate) / 100
  
  return {
    projectValue,
    commissionRate: totalRate,
    commissionAmount,
    partnerTier,
    breakdown: {
      baseRate,
      tierBonus: tierBonuses[partnerTier as keyof typeof tierBonuses] || 0,
      totalRate
    }
  }
}
```

### **2. Tier Upgrade Logic**
**Function**: `checkTierUpgrade(partnerId: string)`

```typescript
export async function checkTierUpgrade(partnerId: string): Promise<TierUpgradeResult> {
  const stats = await getPartnerStats(partnerId)
  
  const tierRequirements = {
    'Silver': { earnings: 1000, deals: 3 },
    'Gold': { earnings: 5000, deals: 10 },
    'Platinum': { earnings: 15000, deals: 25 }
  }
  
  let newTier = 'Bronze'
  
  for (const [tier, requirements] of Object.entries(tierRequirements)) {
    if (stats.totalEarnings >= requirements.earnings && stats.totalDeals >= requirements.deals) {
      newTier = tier
    }
  }
  
  if (newTier !== stats.currentTier) {
    await upgradepartnerTier(partnerId, newTier)
    await sendTierUpgradeEmail(partnerId, newTier)
    return { upgraded: true, newTier, previousTier: stats.currentTier }
  }
  
  return { upgraded: false, currentTier: stats.currentTier }
}
```

---

## 📈 **ANALYTICS FUNCTIONS**

### **1. Partnership Program Statistics**
**Function**: `getPartnershipProgramStats()`

```typescript
export async function getPartnershipProgramStats(): Promise<PartnershipStats> {
  // Active partners count
  const { count: activePartnersCount } = await supabase
    .from('partners')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Total commissions paid
  const { data: paidCommissions } = await supabase
    .from('commissions')
    .select('commission_amount')
    .eq('status', 'paid')

  const totalCommissionsPaid = paidCommissions?.reduce(
    (sum, commission) => sum + Number(commission.commission_amount), 0
  ) || 0

  // Successful projects
  const { count: successfulProjectsCount } = await supabase
    .from('client_leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'won')

  return {
    activePartners: activePartnersCount || 0,
    totalCommissionsPaid,
    successfulProjects: successfulProjectsCount || 0,
    averageCommission: paidCommissions?.length ? totalCommissionsPaid / paidCommissions.length : 0,
    conversionRate: await calculateOverallConversionRate()
  }
}
```

### **2. Leaderboard Data**
**Function**: `getPartnerLeaderboard(period: 'monthly' | 'quarterly' | 'yearly')`

```typescript
export async function getPartnerLeaderboard(
  period: 'monthly' | 'quarterly' | 'yearly' = 'monthly'
): Promise<LeaderboardEntry[]> {
  const periodMap = {
    'monthly': '1 month',
    'quarterly': '3 months', 
    'yearly': '1 year'
  }

  const { data, error } = await supabase
    .from('commissions')
    .select(`
      partner_id,
      commission_amount,
      partners(name, tier, total_earnings)
    `)
    .eq('status', 'paid')
    .gte('created_at', `now() - interval '${periodMap[period]}'`)

  if (error) throw error

  // Group by partner and calculate totals
  const leaderboard = data.reduce((acc, commission) => {
    const partnerId = commission.partner_id
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partnerId,
        name: commission.partners.name,
        tier: commission.partners.tier,
        periodEarnings: 0,
        totalEarnings: commission.partners.total_earnings,
        rank: 0
      }
    }
    acc[partnerId].periodEarnings += Number(commission.commission_amount)
    return acc
  }, {} as Record<string, LeaderboardEntry>)

  // Sort by period earnings and assign ranks
  return Object.values(leaderboard)
    .sort((a, b) => b.periodEarnings - a.periodEarnings)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}
```

---

## 🔄 **LEAD MANAGEMENT FUNCTIONS**

### **1. Submit New Lead**
**Function**: `submitClientLead(leadData: ClientLeadData)`

```typescript
export async function submitClientLead(leadData: ClientLeadData): Promise<ApiResponse<ClientLead>> {
  try {
    // Validate partner exists and is active
    const partner = await validatePartner(leadData.partnerId)
    if (!partner) {
      throw new Error('Partner not found or inactive')
    }

    // Create lead record
    const { data: lead, error } = await supabase
      .from('client_leads')
      .insert([{
        partner_id: leadData.partnerId,
        client_name: leadData.clientName,
        client_email: leadData.clientEmail,
        client_phone: leadData.clientPhone,
        company_name: leadData.companyName,
        project_type: leadData.projectType,
        project_value: leadData.estimatedValue,
        notes: leadData.notes,
        status: 'referred'
      }])
      .select()
      .single()

    if (error) throw error

    // Send notification emails
    await notifyLeadSubmission(lead, partner)

    return {
      success: true,
      data: lead,
      message: 'Lead submitted successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit lead'
    }
  }
}
```

### **2. Update Lead Status**
**Function**: `updateLeadStatus(leadId: string, status: ClientLeadStatus, notes?: string)`

```typescript
export async function updateLeadStatus(
  leadId: string, 
  status: ClientLeadStatus, 
  notes?: string
): Promise<ApiResponse<ClientLead>> {
  try {
    const { data: lead, error } = await supabase
      .from('client_leads')
      .update({ 
        status, 
        notes,
        updated_at: new Date().toISOString() 
      })
      .eq('id', leadId)
      .select()
      .single()

    if (error) throw error

    // If lead is won, create commission record
    if (status === 'won' && lead.project_value) {
      await createCommissionRecord(lead)
    }

    // Notify partner of status change
    await notifyLeadStatusChange(lead, status)

    return {
      success: true,
      data: lead,
      message: 'Lead status updated'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update lead status'
    }
  }
}
```

---

## �� **GAMIFICATION FUNCTIONS**

### **1. Achievement System**
**Function**: `checkAchievements(partnerId: string)`

```typescript
const ACHIEVEMENTS = {
  'first_referral': { name: 'First Referral', description: 'Submit your first client referral' },
  'first_conversion': { name: 'First Conversion', description: 'Convert your first lead to a client' },
  'silver_tier': { name: 'Silver Partner', description: 'Reach Silver tier status' },
  'monthly_leader': { name: 'Monthly Leader', description: 'Top partner for the month' },
  'high_converter': { name: 'High Converter', description: 'Achieve 80%+ conversion rate' }
}

export async function checkAchievements(partnerId: string): Promise<Achievement[]> {
  const stats = await getPartnerStats(partnerId)
  const newAchievements: Achievement[] = []
  
  // Check each achievement condition
  if (stats.totalLeads >= 1 && !hasAchievement(partnerId, 'first_referral')) {
    newAchievements.push(createAchievement(partnerId, 'first_referral'))
  }
  
  if (stats.convertedLeads >= 1 && !hasAchievement(partnerId, 'first_conversion')) {
    newAchievements.push(createAchievement(partnerId, 'first_conversion'))
  }
  
  // Award achievements and notify partner
  for (const achievement of newAchievements) {
    await awardAchievement(achievement)
    await notifyAchievement(achievement)
  }
  
  return newAchievements
}
```

---

## 🔧 **UTILITY FUNCTIONS**

### **1. Data Validation**
```typescript
export function validatePartnerApplication(data: PartnerApplicationData): ValidationResult {
  const errors: string[] = []
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required')
  }
  
  if (!data.networkDescription || data.networkDescription.length < 10) {
    errors.push('Network description must be at least 10 characters')
  }
  
  if (data.expectedReferrals < 1 || data.expectedReferrals > 100) {
    errors.push('Expected referrals must be between 1 and 100')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### **2. Data Formatting**
```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)
}

export function formatCommissionRate(rate: number): string {
  return `${rate.toFixed(1)}%`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Database Setup** ✅
- [ ] Create Supabase migration files
- [ ] Set up partner_applications table
- [ ] Set up partners table  
- [ ] Set up client_leads table
- [ ] Set up commissions table
- [ ] Configure Row Level Security policies
- [ ] Test database schema

### **Phase 2: API Integration** 🔄
- [ ] Connect form submission to database
- [ ] Implement partner statistics endpoint
- [ ] Create lead management functions
- [ ] Set up commission calculation logic
- [ ] Add error handling and validation
- [ ] Test all API endpoints

### **Phase 3: Email Automation** ❌
- [ ] Create application confirmation email function
- [ ] Set up partner welcome email
- [ ] Implement commission notification emails
- [ ] Create email templates
- [ ] Test email delivery
- [ ] Set up webhook triggers

### **Phase 4: Authentication** ❌
- [ ] Implement partner registration flow
- [ ] Set up protected routes
- [ ] Create login/logout functionality
- [ ] Add password reset capability
- [ ] Test authentication flow

### **Phase 5: Dashboard** ❌
- [ ] Build partner dashboard layout
- [ ] Implement statistics display
- [ ] Create lead management interface
- [ ] Add commission tracking
- [ ] Implement profile management
- [ ] Test dashboard functionality

### **Phase 6: Advanced Features** ❌
- [ ] Implement tier upgrade system
- [ ] Add achievement system
- [ ] Create leaderboard functionality
- [ ] Set up analytics tracking
- [ ] Add mobile responsiveness
- [ ] Implement search and filtering

---

## 🚀 **Ready for Implementation**

This document provides a complete specification for all functions needed in the SISO Partnership Program. The development team can use this as a blueprint to implement the backend functionality and complete the integration.

**Next Steps:**
1. Create database migration files
2. Implement API functions with Supabase MCP
3. Set up email automation
4. Build authentication system
5. Complete dashboard functionality

---

**Total Estimated Development Time**: 3-4 weeks  
**Priority**: High - Critical for business growth  
**Dependencies**: Supabase setup, Email service integration