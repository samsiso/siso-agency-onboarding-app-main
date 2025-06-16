# 👥 Referrals System - Detailed Specification

**Priority**: TIER 2 - HIGH PRIORITY  
**Timeline**: 2-3 weeks  
**Complexity**: High (Complex Commission Logic)

---

## 🎯 **PAGE OVERVIEW**

The Referrals System manages the multi-tier affiliate commission structure, enabling affiliates to recruit other affiliates and earn additional commissions on their performance. This system is **critical for exponential growth** of the affiliate network.

### **Core Purpose**
- Manage multi-tier affiliate recruitment
- Calculate complex commission structures
- Track affiliate relationships and hierarchies
- Provide recruitment tools and resources

---

## 💰 **COMMISSION STRUCTURE**

### **Tier Breakdown**
- **Base Commission**: 20% on direct sales
- **Tier 1 Referral Bonus**: +5% on recruits' sales (Total: 25%)
- **Tier 2 Sub-Affiliate Bonus**: +2% on sub-recruits' sales (Total: 27%)

### **Example Calculation**
```
Project Value: $10,000
├─ Base Affiliate (20%): $2,000
├─ Referring Affiliate (+5%): $500  
└─ Super Affiliate (+2%): $200
```

---

## 🔧 **FEATURE SPECIFICATIONS**

### **🌳 Affiliate Tree Visualization**
- **Hierarchical Tree Display**:
  - Visual representation of affiliate relationships
  - Collapsible/expandable nodes
  - Performance indicators for each affiliate
  - Color-coded status indicators (Active, Inactive, Pending)

### **👤 Recruitment Management**
- **Referral Link Generation**:
  - Unique tracking links for each affiliate
  - Custom landing pages
  - QR code generation
  - Link performance analytics

- **Prospect Tracking**:
  - Lead capture from referral links
  - Application status tracking
  - Onboarding progress monitoring
  - Communication history

### **💵 Commission Tracking**
- **Real-time Commission Calculations**:
  - Automatic tier-based calculations
  - Historical commission records
  - Payment status tracking
  - Tax documentation

- **Payment Management**:
  - Commission payout schedules
  - Payment method preferences
  - Minimum payout thresholds
  - Payment history and receipts

### **📊 Performance Analytics**
- **Recruitment Metrics**:
  - Number of direct recruits
  - Number of sub-affiliates (2nd tier)
  - Recruitment conversion rates
  - Time-to-activation metrics

- **Revenue Analytics**:
  - Revenue by tier (direct vs referral)
  - Top performing recruits
  - Commission trends over time
  - ROI on recruitment efforts

### **🎯 Recruitment Tools**
- **Marketing Materials**:
  - Affiliate recruitment presentations
  - Email templates
  - Social media assets
  - Training documentation

- **Communication Tools**:
  - In-app messaging system
  - Announcement broadcasts
  - Training session scheduling
  - Support ticket system

---

## 🎨 **USER EXPERIENCE FLOW**

### **Recruitment Flow**
1. **Generate Referral Link** - Custom tracking URL
2. **Share Link** - Via email, social, etc.
3. **Lead Capture** - Prospect submits application
4. **Review Process** - Application evaluation
5. **Onboarding** - New affiliate activation
6. **Commission Tracking** - Ongoing performance monitoring

### **Commission Management Flow**
1. **Performance Dashboard** - Overview of all tiers
2. **Commission Details** - Breakdown by affiliate/project
3. **Payment History** - Past payouts and schedules
4. **Tax Documentation** - Annual tax forms
5. **Payout Settings** - Payment preferences

---

## 💾 **DATA REQUIREMENTS**

### **Affiliate Relationship Structure**
```json
{
  "affiliate_id": "string",
  "recruiter_id": "string", // null for top-level affiliates
  "hierarchy_level": "number", // 0, 1, 2 (for commission tiers)
  "recruitment_date": "date",
  "status": "string", // Active, Inactive, Pending, Suspended
  "referral_code": "string",
  "referral_link": "string",
  "total_recruits": "number",
  "total_sub_recruits": "number",
  "lifetime_commissions": "number",
  "recruitment_source": "string"
}
```

### **Commission Transaction Structure**
```json
{
  "transaction_id": "string",
  "project_id": "string",
  "project_value": "number",
  "base_affiliate_id": "string",
  "base_commission": "number", // 20%
  "tier_1_affiliate_id": "string",
  "tier_1_commission": "number", // 5%
  "tier_2_affiliate_id": "string", 
  "tier_2_commission": "number", // 2%
  "total_commissions": "number",
  "payment_status": "string",
  "created_date": "date",
  "paid_date": "date"
}
```

### **Recruitment Prospect Structure**
```json
{
  "prospect_id": "string",
  "recruiter_id": "string",
  "referral_source": "string",
  "contact_info": "object",
  "application_data": "object",
  "status": "string", // Lead, Applied, Under Review, Approved, Rejected
  "created_date": "date",
  "status_history": "object[]",
  "notes": "string[]",
  "expected_performance": "object"
}
```

---

## 🎨 **DESIGN REQUIREMENTS**

### **Visual Style**
- Dark theme with orange/green accents for positive metrics
- Interactive tree visualization
- Clean commission breakdown displays
- Professional analytics charts

### **Interactive Elements**
- Drag-and-drop for affiliate organization
- Clickable tree nodes for detailed views
- Hover states for commission breakdowns
- Modal dialogs for detailed affiliate info

### **Mobile Responsiveness**
- Mobile-friendly tree navigation
- Touch-optimized interactions
- Responsive analytics charts
- Mobile recruitment tools

---

## ⚙️ **TECHNICAL REQUIREMENTS**

### **Commission Calculation Engine**
- Real-time calculation triggers
- Automated tier identification
- Complex validation rules
- Audit trail maintenance

### **Payment Processing Integration**
- Multiple payment method support
- Automated payout scheduling
- Currency conversion support
- Tax compliance features

### **Fraud Prevention**
- Duplicate prevention systems
- Unusual activity detection
- Commission validation rules
- Appeal and dispute processes

---

## 🤔 **CLARIFICATION QUESTIONS**

### **Business Logic Questions**
1. **What's the minimum performance threshold for maintaining tier bonuses?**
2. **How do you handle affiliate churning or deactivation?**
3. **Are there caps on total commission percentages?**
4. **What happens if a project is refunded or cancelled?**

### **Payment & Legal Questions**
1. **What are the minimum payout thresholds for each tier?**
2. **How often are commissions paid out? (Weekly, monthly, quarterly?)**
3. **What tax documentation is required in different regions?**
4. **Are there different commission structures for different regions?**

### **Recruitment Process Questions**
1. **What's the application/approval process for new affiliates?**
2. **Who has authority to approve new affiliate applications?**
3. **Are there training requirements before activation?**
4. **What background checks or validations are needed?**

### **Technical Integration Questions**
1. **Which payment processors should we integrate with?**
2. **Do you need multi-currency support?**
3. **What CRM integration is needed for prospect management?**
4. **How should we handle international tax compliance?**

---

## 📊 **SUCCESS METRICS**

### **Primary KPIs**
- Affiliate recruitment rate
- Commission accuracy (no disputes)
- Average time to first sub-affiliate sale
- Total network revenue growth

### **Secondary KPIs**
- Recruitment conversion rates
- Affiliate retention rates
- Payment processing efficiency
- Support ticket resolution time

---

## 🔗 **INTEGRATION REQUIREMENTS**

### **Internal Systems**
- User authentication and authorization
- Commission calculation engine
- Payment processing system
- Notification and communication system

### **External Systems**
- Payment processor APIs (Stripe, PayPal, etc.)
- Tax compliance services
- Email marketing platforms
- Analytics and reporting tools

### **API Requirements**
- Affiliate management API
- Commission calculation API
- Payment processing API
- Recruitment tracking API
- Reporting and analytics API

---

## 🚨 **RISK CONSIDERATIONS**

### **Financial Risks**
- Commission calculation errors
- Payment processing failures
- Fraud and abuse prevention
- Tax compliance issues

### **Technical Risks**
- System scalability with growth
- Data consistency across tiers
- Real-time calculation performance
- Integration complexity

### **Business Risks**
- Affiliate satisfaction and retention
- Commission structure sustainability
- Legal compliance across regions
- Competitive market pressures

---

**📋 Status**: Specification complete, requires business logic clarification and payment integration planning 