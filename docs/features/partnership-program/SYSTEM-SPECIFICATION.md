# 🤝 **Partnership Program - System Specification**

## 🎯 **Overview**
The SISO Partnership Program enables agencies, consultants, and service providers to earn commissions by referring clients to SISO. Partners earn 20-40% commission on successful project completions with tiered benefits and growth opportunities.

---

## 🏗️ **Architecture Overview**

### **🔄 User Flow**
1. **Application** → Partner applies through landing page
2. **Review** → SISO team reviews and approves/rejects
3. **Onboarding** → Approved partners get dashboard access
4. **Referral** → Partners refer clients using unique tracking links
5. **Tracking** → System tracks leads through conversion funnel
6. **Commission** → Partners earn commissions on successful projects

### **📊 Partner Tiers & Benefits**
| Tier | Requirements | Commission Rate | Benefits |
|------|-------------|----------------|----------|
| **Bronze** | 0+ deals | 20% | Basic dashboard, marketing materials |
| **Silver** | 5+ deals | 25% | Priority support, co-marketing opportunities |
| **Gold** | 15+ deals | 30% | Dedicated account manager, exclusive events |
| **Platinum** | 50+ deals | 40% | Custom commission rates, strategic partnership |

---

## 🗄️ **Database Schema**

### **Core Tables**

#### **partner_applications**
```sql
CREATE TABLE partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  network_description TEXT NOT NULL,
  expected_referrals INTEGER DEFAULT 1,
  experience_level TEXT DEFAULT 'beginner',
  website TEXT,
  linkedin_profile TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **partners**
```sql
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES partner_applications(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  tracking_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  onboarded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **referrals**
```sql
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  tracking_code TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  company_name TEXT,
  project_type TEXT,
  estimated_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  status TEXT DEFAULT 'referred' CHECK (status IN (
    'referred', 'contacted', 'qualified', 'proposal_sent', 
    'negotiating', 'won', 'lost', 'on_hold'
  )),
  conversion_probability INTEGER DEFAULT 25,
  notes TEXT,
  referred_at TIMESTAMP DEFAULT NOW(),
  contacted_at TIMESTAMP,
  qualified_at TIMESTAMP,
  won_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **commissions**
```sql
CREATE TABLE commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  referral_id UUID REFERENCES referrals(id),
  project_value DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  tier_bonus DECIMAL(10,2) DEFAULT 0,
  total_payout DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'disputed')),
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_reference TEXT,
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 **Authentication & Security**

### **Row Level Security Policies**
```sql
-- Partners can only view their own data
CREATE POLICY "partners_view_own" ON partners 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "referrals_view_own" ON referrals 
  FOR SELECT USING (partner_id IN (
    SELECT id FROM partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "commissions_view_own" ON commissions 
  FOR SELECT USING (partner_id IN (
    SELECT id FROM partners WHERE user_id = auth.uid()
  ));

-- Admin access for applications and management
CREATE POLICY "admin_manage_applications" ON partner_applications 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### **Partner Registration Flow**
1. **Application Submission** → Store in `partner_applications`
2. **Admin Review** → Update status and add review notes
3. **Approval** → Create auth user and partner record
4. **Welcome Email** → Send credentials and onboarding materials
5. **Dashboard Access** → Partner can access portal

---

## 🚀 **Core Functionality**

### **📝 Partner Application System**
- **Application Form** → Captures partner details and experience
- **Admin Review Dashboard** → Review, approve, reject applications
- **Automated Notifications** → Email confirmations and status updates
- **Application Tracking** → Status updates throughout review process

### **🔗 Referral Tracking System**
- **Unique Tracking Links** → Each partner gets unique referral codes
- **Lead Capture** → Automatically associate leads with referring partner
- **Conversion Funnel** → Track leads through entire sales process
- **Performance Analytics** → Real-time partner performance metrics

### **💰 Commission Management**
- **Automatic Calculation** → Commission computed based on tier and deal value
- **Tier Progression** → Automatic tier upgrades based on performance
- **Payout Tracking** → Track pending, approved, and paid commissions
- **Payment Processing** → Integration with payment systems for payouts

### **📊 Partner Dashboard**
- **Performance Overview** → Earnings, referrals, conversion rates
- **Referral Management** → Track all referred leads and their status
- **Marketing Materials** → Download promotional content and assets
- **Training Resources** → Access to partner education and certification

---

## 📧 **Automation & Notifications**

### **Email Workflows**
- **Application Confirmation** → Immediate confirmation of application receipt
- **Application Status Updates** → Notifications for approval/rejection
- **Welcome & Onboarding** → Partner portal access and getting started guide
- **New Referral Notifications** → Confirm when referrals are received
- **Commission Earned** → Notification when commissions are calculated
- **Payment Notifications** → Confirmation of commission payments

### **Edge Functions Required**
```typescript
// supabase/functions/
├── partner-application-notification/    # Application confirmations
├── partner-welcome-email/              # Welcome and onboarding
├── referral-tracking/                  # Track referral clicks and conversions
├── commission-calculation/             # Calculate and process commissions
├── tier-progression/                   # Handle partner tier upgrades
└── payment-processing/                 # Process commission payouts
```

---

## 🎯 **Business Logic**

### **Commission Calculation Algorithm**
```typescript
function calculateCommission(referral: Referral, partner: Partner): Commission {
  const baseRate = partner.commission_rate;
  const projectValue = referral.actual_value;
  const baseCommission = projectValue * (baseRate / 100);
  
  // Tier bonuses
  const tierBonus = getTierBonus(partner.tier, baseCommission);
  const totalPayout = baseCommission + tierBonus;
  
  return {
    commission_amount: baseCommission,
    tier_bonus: tierBonus,
    total_payout: totalPayout,
    commission_rate: baseRate
  };
}
```

### **Tier Progression Rules**
```typescript
function evaluateTierProgression(partner: Partner): string {
  const totalDeals = partner.total_deals;
  
  if (totalDeals >= 50) return 'Platinum';
  if (totalDeals >= 15) return 'Gold';
  if (totalDeals >= 5) return 'Silver';
  return 'Bronze';
}
```

---

## 📊 **Analytics & Reporting**

### **Partner Performance Metrics**
- **Conversion Rate** → Percentage of referrals that become clients
- **Average Deal Value** → Mean value of successful referrals
- **Total Earnings** → Lifetime commission earnings
- **Referral Velocity** → Rate of new referral generation
- **Client Satisfaction** → Feedback scores from referred clients

### **Program Health Metrics**
- **Partner Acquisition Rate** → New partners joining monthly
- **Partner Retention** → Active partner percentage over time
- **Program ROI** → Revenue generated vs commission costs
- **Quality Score** → Average conversion rate across all partners

---

## 🔄 **Integration Points**

### **Frontend Components**
- **Landing Page** → `src/components/partnership/` 
- **Application Form** → `src/components/partnership/application/`
- **Partner Dashboard** → `src/components/partnership/dashboard/`
- **Admin Management** → `src/components/admin/partnerships/`

### **API Integration**
- **Application Submission** → `src/api/partnership.ts`
- **Referral Tracking** → `src/api/referrals.ts`
- **Commission Management** → `src/api/commissions.ts`
- **Partner Authentication** → `src/integrations/supabase/auth.ts`

### **External Services**
- **Email Service** → Automated notification workflows
- **Payment Processing** → Commission payout system
- **Analytics** → Partner performance tracking
- **CRM Integration** → Lead management and follow-up

---

## 🚀 **Implementation Roadmap**

### **Phase 1: Foundation (2 weeks)**
- ✅ Database schema creation and RLS policies
- ✅ Partner application system
- ✅ Admin review dashboard
- ✅ Basic email notifications

### **Phase 2: Core Features (3 weeks)**
- 🔄 Referral tracking system
- 🔄 Partner dashboard development
- 🔄 Commission calculation engine
- 📋 Payment processing integration

### **Phase 3: Advanced Features (4 weeks)**
- 📋 Advanced analytics and reporting
- 📋 Tier progression automation
- 📋 Marketing materials management
- 📋 Training and certification system

### **Phase 4: Optimization (2 weeks)**
- 📋 Performance optimization
- 📋 Advanced automation workflows
- 📋 Mobile app integration
- 📋 API documentation and third-party integrations

---

## 🔗 **Related Documentation**
- [Partnership Program User Guide](../../user-guides/partner-portal/) - End-user documentation
- [Commission Calculation Guide](./commission-calculation.md) - Detailed commission rules
- [Partner Onboarding Process](./partner-onboarding.md) - Step-by-step onboarding
- [API Reference](../../api/partnership-api.md) - Technical integration guide

---

**📈 Business Impact**: The partnership program is projected to generate 40-60% of new client acquisitions through partner referrals, with an estimated ROI of 300-400% within the first year of operation. 