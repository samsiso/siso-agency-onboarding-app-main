# 👥 **Referrals - Referral Management & Tracking Page**

---

## 📋 **Page Overview**

**Route**: `/dashboard/referrals`  
**Icon**: Users  
**Status**: ⚠️ Coming Soon (Badge: "Coming Soon")  
**Priority**: High (Core revenue generation)

---

## 🎯 **Page Purpose & Goals**

### **Primary Purpose**
- Comprehensive referral management and tracking system
- Generate and manage custom referral links
- Track referral pipeline from lead to conversion
- Optimize referral performance and conversion rates

### **User Goals**
- Create and customize referral links
- Track referral performance and status
- Manage referral pipeline and follow-ups
- Access referral tools and resources
- Monitor commission earnings from referrals

---

## 📊 **Content Structure**

### **1. Referrals Dashboard Header**
- **Page Title**: "Referral Management"
- **Quick Stats**: Total referrals, active deals, conversion rate
- **Quick Actions**: Generate Link, Import Contacts, Send Campaign
- **Filter Controls**: Status, date range, source, value

### **2. Key Referral Metrics**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  Total Leads    │  Active Deals   │  Closed Deals   │  Conversion     │
│      127        │       23        │       15        │     11.8%       │
│   Generated     │   In Pipeline   │   This Month    │     Rate        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  Commission     │  Avg Deal       │  Pipeline       │  Success        │
│    £3,750       │     £250        │    £5,750       │     65.2%       │
│   Earned        │    Value        │    Value        │     Rate        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### **3. Referral Link Generator**
```
┌─────────────────────────────────────────────────────────────┐
│                    GENERATE REFERRAL LINK                  │
│                                                             │
│  Campaign Name: [Spring 2025 Promotion        ]            │
│  Landing Page:  [App Development Services ▼   ]            │
│  Custom UTM:    [spring-promo-2025            ]            │
│                                                             │
│  Generated Link: https://siso.agency/ref/abc123-spring     │
│  [📋 Copy Link]  [📊 Track Performance]  [✏️ Edit]        │
└─────────────────────────────────────────────────────────────┘
```

### **4. Active Referral Links**
| Link Name | Created | Clicks | Leads | Conversions | Revenue | Actions |
|-----------|---------|--------|-------|-------------|---------|---------|
| Spring Promo | 2025-01-15 | 245 | 12 | 3 | £750 | 📊 📋 ✏️ |
| LinkedIn Campaign | 2025-01-10 | 189 | 8 | 2 | £500 | 📊 📋 ✏️ |
| Email Signature | 2025-01-01 | 156 | 15 | 5 | £1,250 | 📊 📋 ✏️ |

### **5. Referral Pipeline**
```
Lead → Qualified → Proposal → Negotiation → Closed
 45      32          18         12          8
```

### **6. Referral Management Table**
| Date | Contact | Source | Status | Value | Stage | Next Action | Commission |
|------|---------|--------|--------|-------|-------|-------------|------------|
| 2025-01-20 | ABC Corp | LinkedIn | Active | £2,500 | Proposal | Follow-up | £250 |
| 2025-01-18 | XYZ Ltd | Website | Qualified | £1,800 | Discovery | Schedule call | £180 |
| 2025-01-15 | Tech Co | Email | Closed | £3,200 | Completed | Invoice sent | £320 |

### **7. Referral Tools & Resources**
- **Email Templates**: Pre-written referral emails
- **Social Media Assets**: Branded graphics and posts
- **Presentation Materials**: Pitch decks and case studies
- **Training Resources**: Best practices and guides

---

## ⚡ **Features & Functionality**

### **Link Management**
- **Custom Link Generation**: Branded, trackable referral links
- **UTM Parameter Control**: Custom campaign tracking
- **Link Expiration**: Set expiry dates for campaigns
- **A/B Testing**: Multiple link variants for testing

### **Referral Tracking**
- **Real-time Analytics**: Click, conversion, and revenue tracking
- **Attribution Tracking**: Multi-touch attribution modeling
- **Conversion Funnel**: Visual pipeline progression
- **Performance Insights**: AI-powered optimization suggestions

### **Contact Management**
- **CRM Integration**: Import and sync contacts
- **Lead Scoring**: Automatic qualification scoring
- **Follow-up Automation**: Scheduled reminders and tasks
- **Communication History**: Complete interaction timeline

### **Commission Tracking**
- **Real-time Calculations**: Live commission updates
- **Payment Tracking**: Commission payment history
- **Tier-based Rates**: Dynamic commission percentages
- **Bonus Tracking**: Special incentive calculations

---

## 🎨 **Design Specifications**

### **Layout Structure**
```
Header (Title + Quick Actions)
├── Metrics Grid (2 rows × 4 columns)
├── Link Generator Card
├── Active Links Table
├── Pipeline Visualization
├── Referral Management Table
└── Tools & Resources Section
```

### **Color Scheme**
- **Background**: `bg-gray-900`
- **Cards**: `bg-gray-800` with `border-gray-700`
- **Success**: `text-green-400` for closed deals
- **Warning**: `text-yellow-400` for pending actions
- **Info**: `text-blue-400` for active deals
- **Danger**: `text-red-400` for expired/failed

### **Status Indicators**
- **New**: `bg-blue-500` badge
- **Qualified**: `bg-yellow-500` badge
- **Active**: `bg-green-500` badge
- **Closed**: `bg-gray-500` badge
- **Lost**: `bg-red-500` badge

---

## 📱 **Responsive Design**

### **Desktop (1024px+)**
- Full metrics grid (2×4)
- Complete referral table with all columns
- Side-by-side link generator and tools
- Detailed pipeline visualization

### **Tablet (768px - 1023px)**
- Condensed metrics grid (2×2)
- Scrollable referral table
- Stacked link generator
- Simplified pipeline view

### **Mobile (< 768px)**
- Single column metrics
- Card-based referral list
- Mobile-optimized link generator
- Swipeable pipeline stages

---

## 🔧 **Technical Requirements**

### **Data Sources**
- **Referrals**: Supabase referrals table
- **Links**: Supabase referral_links table
- **Tracking**: Supabase link_analytics table
- **Commissions**: Supabase commissions table

### **Link Generation System**
```typescript
// Referral link structure
const generateReferralLink = (partnerId, campaign, utmParams) => {
  const linkId = generateUniqueId()
  const baseUrl = 'https://siso.agency/ref/'
  return `${baseUrl}${partnerId}-${linkId}?utm_campaign=${campaign}`
}

// Click tracking
const trackClick = (linkId, userAgent, referrer, timestamp) => {
  // Store click data for analytics
}
```

### **API Endpoints**
```typescript
// Referral management
GET /api/partner/referrals/overview
GET /api/partner/referrals/list
POST /api/partner/referrals/create-link
PUT /api/partner/referrals/update-status
GET /api/partner/referrals/analytics
POST /api/partner/referrals/import-contacts
```

### **Real-time Features**
- **Live Click Tracking**: Real-time link performance
- **Status Updates**: Instant referral status changes
- **Commission Updates**: Live earnings calculations
- **Pipeline Changes**: Real-time stage progressions

---

## 🚀 **Implementation Priority**

### **Phase 1: Core Referral Management (High Priority)**
- [ ] Basic referral tracking table
- [ ] Simple link generation
- [ ] Status management
- [ ] Commission calculations

### **Phase 2: Advanced Tracking (Medium Priority)**
- [ ] Analytics dashboard
- [ ] Pipeline visualization
- [ ] Performance metrics
- [ ] Link management tools

### **Phase 3: Automation & Tools (Medium Priority)**
- [ ] Email templates
- [ ] Follow-up automation
- [ ] Contact import
- [ ] Social media assets

### **Phase 4: Advanced Features (Low Priority)**
- [ ] A/B testing
- [ ] AI insights
- [ ] Advanced attribution
- [ ] Predictive analytics

---

## 📋 **Content Requirements**

### **Copy & Messaging**
- **Page Headlines**: "Manage Your Referrals", "Track Your Success"
- **Status Labels**: Clear, consistent status terminology
- **Action Buttons**: Intuitive call-to-action text
- **Help Text**: Tooltips and guidance for complex features

### **Email Templates**
- **Introduction Email**: Initial referral outreach
- **Follow-up Email**: Nurturing sequences
- **Thank You Email**: Post-conversion appreciation
- **Re-engagement Email**: Dormant lead activation

---

## 🎯 **Success Metrics**

### **User Engagement**
- **Page Views**: Daily referral page visits
- **Link Generation**: Number of links created
- **Link Usage**: Click-through rates
- **Feature Adoption**: Tool and template usage

### **Business Impact**
- **Referral Volume**: Total referrals generated
- **Conversion Rate**: Lead to customer conversion
- **Revenue Impact**: Total referral revenue
- **Partner Satisfaction**: Referral tool ratings

---

## 🔗 **Referral Link Features**

### **Link Customization**
- **Custom Domains**: Branded short links
- **Vanity URLs**: Memorable link endings
- **QR Codes**: Mobile-friendly sharing
- **Deep Links**: Direct app/page targeting

### **Tracking Parameters**
- **UTM Campaigns**: Marketing campaign tracking
- **Source Attribution**: Traffic source identification
- **Medium Tracking**: Channel performance
- **Content Variants**: A/B test tracking

### **Link Management**
- **Bulk Operations**: Mass link creation/editing
- **Link Expiration**: Automatic deactivation
- **Click Limits**: Maximum usage controls
- **Geographic Targeting**: Location-based routing

---

## 📊 **Analytics & Reporting**

### **Performance Metrics**
- **Click Analytics**: Detailed click tracking
- **Conversion Tracking**: End-to-end attribution
- **Revenue Attribution**: Commission calculations
- **Time-based Analysis**: Performance trends

### **Reporting Features**
- **Custom Reports**: Flexible report builder
- **Scheduled Reports**: Automated email reports
- **Export Options**: CSV, PDF, Excel formats
- **Dashboard Widgets**: Customizable metrics

---

**📅 Created**: 2025-01-25  
**🔄 Last Updated**: 2025-01-25  
**👤 Owner**: Development Team  
**📊 Status**: Planning Phase 