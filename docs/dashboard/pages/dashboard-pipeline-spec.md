# 📊 Dashboard/Pipeline - Detailed Specification

**Priority**: TIER 1 - CRITICAL  
**Timeline**: 1-2 weeks  
**Complexity**: Medium-High

---

## 🎯 **PAGE OVERVIEW**

The Dashboard/Pipeline page is the **core command center** for affiliates to track their client pipeline, affiliate recruitment, and overall performance metrics. This is essential for affiliate success and business growth tracking.

### **Core Purpose**
- Monitor client acquisition pipeline
- Track affiliate recruitment and sub-affiliates
- Display key performance metrics
- Provide actionable insights for growth

---

## 🔧 **FEATURE SPECIFICATIONS**

### **📈 Key Performance Metrics**
- **Total Revenue Generated**
- **Active Clients** (In pipeline)
- **Completed Projects**
- **Conversion Rates** (Lead → Client)
- **Average Project Value**
- **Monthly Growth Rate**
- **Commission Earnings** (20% + bonuses)

### **🎯 Client Pipeline Management**
- **Pipeline Stages**:
  - Initial Contact
  - Requirements Gathering
  - Proposal Sent
  - Negotiation
  - Contract Signed
  - Project In Progress
  - Project Completed
  - Follow-up/Retention

- **Client Cards** showing:
  - Client name and company
  - Project type and value
  - Current stage
  - Days in current stage
  - Next action required
  - Contact information
  - Notes and history

### **👥 Affiliate Recruitment Pipeline**
- **Recruitment Stages**:
  - Lead Generated
  - Initial Contact
  - Information Sent
  - Meeting Scheduled
  - Application Submitted
  - Under Review
  - Onboarded
  - Active

- **Sub-Affiliate Tracking**:
  - Direct recruits
  - Second-level recruits (2% bonus)
  - Performance metrics for each
  - Commission calculations

### **📊 Visual Analytics**
- **Pipeline Funnel Charts** for clients and affiliates
- **Revenue Trends** over time
- **Conversion Rate Tracking**
- **Stage Duration Analysis**
- **Performance Comparisons** (month-over-month)

### **🔔 Activity Feed & Notifications**
- Recent pipeline movements
- Upcoming follow-ups
- Commission payments
- New affiliate applications
- System announcements

---

## 💰 **COMMISSION STRUCTURE**

### **Base Commission**: 20%
### **Referral Bonus**: +5% (for affiliates you recruit)
### **Sub-Affiliate Bonus**: +2% (for affiliates recruited by your recruits)

### **Commission Tracking**
- Real-time commission calculations
- Historical commission records
- Payment schedules and status
- Tax documentation preparation

---

## 🎨 **USER EXPERIENCE FLOW**

### **Dashboard Landing Flow**
1. **Overview Cards** - Key metrics at a glance
2. **Pipeline Visualization** - Client and affiliate funnels
3. **Activity Feed** - Recent updates
4. **Quick Actions** - Add client, add prospect, etc.
5. **Detailed Views** - Drill down into specific areas

### **Pipeline Management Flow**
1. **Pipeline View** - Kanban-style board
2. **Stage Movement** - Drag and drop functionality
3. **Client Details** - Detailed information view
4. **Action Items** - Tasks and follow-ups
5. **Progress Tracking** - Historical movement

---

## 💾 **DATA REQUIREMENTS**

### **Client Pipeline Data Structure**
```json
{
  "client_id": "string",
  "affiliate_id": "string",
  "client_name": "string",
  "company": "string",
  "email": "string",
  "phone": "string",
  "project_type": "string",
  "estimated_value": "number",
  "current_stage": "string",
  "stage_entered_date": "date",
  "created_date": "date",
  "last_contact": "date",
  "next_action": "string",
  "next_action_date": "date",
  "notes": "string[]",
  "documents": "string[]",
  "probability": "number", // 0-100%
  "source": "string" // How they found us
}
```

### **Affiliate Pipeline Data Structure**
```json
{
  "prospect_id": "string",
  "recruiter_id": "string",
  "prospect_name": "string",
  "email": "string",
  "current_stage": "string",
  "source": "string",
  "created_date": "date",
  "last_contact": "date",
  "notes": "string[]",
  "application_data": "object",
  "background": "string",
  "expected_performance": "string"
}
```

### **Commission Data Structure**
```json
{
  "commission_id": "string",
  "affiliate_id": "string",
  "client_id": "string",
  "project_value": "number",
  "base_commission": "number", // 20%
  "referral_bonus": "number", // +5%
  "sub_affiliate_bonus": "number", // +2%
  "total_commission": "number",
  "payment_status": "string",
  "payment_date": "date",
  "created_date": "date"
}
```

---

## 🎨 **DESIGN REQUIREMENTS**

### **Visual Style**
- Dark theme with orange accents
- Clean metrics cards
- Intuitive pipeline visualization
- Color-coded stage indicators
- Professional chart styling

### **Interactive Elements**
- Drag-and-drop pipeline management
- Clickable metrics for drill-down
- Hover states for additional information
- Modal dialogs for detailed views

### **Mobile Responsiveness**
- Responsive metric cards
- Touch-friendly pipeline interactions
- Mobile-optimized charts
- Simplified mobile navigation

---

## 🤔 **CLARIFICATION QUESTIONS**

### **Business Process Questions**
1. **What are the specific stages in your client acquisition process?**
2. **How do you currently track affiliate recruitment?**
3. **What triggers commission payments? (Project completion, payment received, etc.)**
4. **What information do you need to track for each client/prospect?**

### **Commission & Payment Questions**
1. **When are commissions calculated and paid out?**
2. **Are there minimum thresholds for commission payments?**
3. **How do you handle refunds or project cancellations?**
4. **What documentation is needed for tax purposes?**

### **Integration Questions**
1. **Do you have an existing CRM system to integrate with?**
2. **What email/communication tools do affiliates use?**
3. **How should we handle document storage and sharing?**
4. **Integration with accounting/invoicing systems?**

### **Analytics & Reporting Questions**
1. **What time periods are most important for reporting?**
2. **Should there be goal-setting and progress tracking?**
3. **What benchmarks or industry standards should we show?**
4. **Do you want automated reporting/insights?**

---

## 📊 **SUCCESS METRICS**

### **Primary KPIs**
- Pipeline velocity (time to close)
- Conversion rates by stage
- Average project value
- Total commission earned

### **Secondary KPIs**
- Pipeline health (stage distribution)
- Activity levels (contacts, meetings)
- Affiliate recruitment success
- Client retention rates

---

## 🔗 **INTEGRATION REQUIREMENTS**

### **Internal Systems**
- User authentication and authorization
- Commission calculation engine
- Notification system
- Document storage

### **External Systems**
- CRM integration (if existing)
- Email service integration
- Payment processing systems
- Analytics and reporting tools

### **API Requirements**
- Pipeline management API
- Commission calculation API
- Notification API
- Reporting and analytics API

---

**📋 Status**: Specification complete, requires business process clarification and integration details 