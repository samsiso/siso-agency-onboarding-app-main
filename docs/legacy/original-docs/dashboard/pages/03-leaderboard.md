# 🏆 **Leaderboard - Partner Rankings Page**

---

## 📋 **Page Overview**

**Route**: `/dashboard/leaderboard`  
**Icon**: Trophy  
**Status**: ✅ Active (Existing implementation)  
**Priority**: High (Gamification & motivation)

---

## 🎯 **Page Purpose & Goals**

### **Primary Purpose**
- Competitive ranking system for partner motivation
- Transparent performance comparison across partners
- Recognition and rewards for top performers
- Gamification to drive engagement and performance

### **User Goals**
- See current ranking position
- Compare performance with other partners
- Track progress toward higher tiers
- Understand ranking criteria and scoring
- Access achievement rewards and recognition

---

## 📊 **Content Structure**

### **1. Leaderboard Header**
- **Page Title**: "Partner Leaderboard"
- **Current User Rank**: Highlighted position with badge
- **Time Period Selector**: This Month, Last Month, Quarter, Year
- **Ranking Criteria**: Toggle between Revenue, Referrals, Growth

### **2. User's Performance Summary**
```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR CURRENT POSITION                    │
│  🏆 Rank #8 of 127 Partners    |    Gold Tier Partner      │
│  📈 +2 positions this month    |    Next: Platinum (-£500) │
└─────────────────────────────────────────────────────────────┘
```

### **3. Top Performers Podium**
```
        🥈 #2              🥇 #1              🥉 #3
    Sarah Johnson      Mike Chen         Emma Davis
      £9,890           £12,450            £8,750
     18 referrals      24 referrals      15 referrals
```

### **4. Leaderboard Table**
| Rank | Partner | Tier | Revenue | Referrals | Growth | Streak |
|------|---------|------|---------|-----------|--------|--------|
| 1 | Mike Chen | Platinum | £12,450 | 24 | +18% | 🔥 5 |
| 2 | Sarah Johnson | Gold | £9,890 | 18 | +12% | 🔥 3 |
| 3 | Emma Davis | Gold | £8,750 | 15 | +8% | 🔥 2 |
| ... | ... | ... | ... | ... | ... | ... |
| 8 | **You** | **Gold** | **£6,200** | **12** | **+5%** | **🔥 1** |

### **5. Tier System & Benefits**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Bronze    │   Silver    │    Gold     │  Platinum   │
│   £0-999    │ £1K-2.9K    │ £3K-9.9K    │   £10K+     │
│   5% bonus  │  10% bonus  │  15% bonus  │  20% bonus  │
│ Basic tools │ Pro tools   │ Premium     │ VIP access  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **6. Achievement Badges**
- **Performance Badges**: Top 10, Top 5, #1 Performer
- **Milestone Badges**: First Referral, 10 Referrals, 50 Referrals
- **Streak Badges**: 3-month streak, 6-month streak, 1-year streak
- **Special Badges**: Rookie of the Month, Comeback Kid, Consistent Performer

### **7. Leaderboard Insights**
- **Performance Trends**: Monthly ranking changes
- **Competitive Analysis**: Gap to next tier/rank
- **Improvement Suggestions**: Personalized recommendations
- **Upcoming Competitions**: Special challenges and contests

---

## ⚡ **Features & Functionality**

### **Interactive Rankings**
- **Sortable Columns**: Click headers to sort by different metrics
- **Filter Options**: By tier, region, join date, performance
- **Search Partners**: Find specific partners in rankings
- **Rank History**: View historical position changes

### **Gamification Elements**
- **Achievement System**: Unlock badges and rewards
- **Streak Tracking**: Consecutive months of performance
- **Progress Bars**: Visual progress toward next tier
- **Challenges**: Monthly competitions and goals

### **Social Features**
- **Partner Profiles**: Click to view public partner profiles
- **Congratulations**: Send kudos to top performers
- **Team Challenges**: Group competitions and collaborations
- **Success Stories**: Featured partner spotlights

### **Personalization**
- **Goal Setting**: Set personal ranking targets
- **Notification Preferences**: Rank change alerts
- **Privacy Settings**: Control profile visibility
- **Custom Metrics**: Choose preferred ranking criteria

---

## 🎨 **Design Specifications**

### **Layout Structure**
```
Header (Title + Controls)
├── User Performance Summary Card
├── Top 3 Podium Section
├── Leaderboard Table
│   ├── Sortable columns
│   ├── User row highlighted
│   └── Pagination controls
├── Tier System Overview
├── Achievement Badges Grid
└── Insights & Recommendations
```

### **Color Scheme & Tiers**
- **Platinum**: `bg-gradient-to-r from-gray-300 to-gray-100` with `text-gray-800`
- **Gold**: `bg-gradient-to-r from-yellow-400 to-yellow-200` with `text-yellow-900`
- **Silver**: `bg-gradient-to-r from-gray-400 to-gray-200` with `text-gray-800`
- **Bronze**: `bg-gradient-to-r from-amber-600 to-amber-400` with `text-amber-900`

### **Ranking Indicators**
- **Top 3**: Crown, medal, and trophy icons
- **Top 10**: Star icons with special highlighting
- **User Position**: Bold highlighting and special border
- **Tier Badges**: Colored badges with tier names

---

## 📱 **Responsive Design**

### **Desktop (1024px+)**
- Full leaderboard table with all columns
- Side-by-side podium and summary
- Detailed achievement grid
- Complete tier comparison

### **Tablet (768px - 1023px)**
- Condensed table with key columns
- Stacked podium section
- Simplified achievement display
- Collapsible tier details

### **Mobile (< 768px)**
- Card-based leaderboard layout
- Single-column podium
- Swipeable achievement carousel
- Accordion-style tier information

---

## 🔧 **Technical Requirements**

### **Data Sources**
- **Partner Performance**: Supabase partner_performance table
- **Rankings**: Calculated rankings based on metrics
- **Achievements**: Supabase partner_achievements table
- **Tier Data**: Supabase partner_tiers table

### **Ranking Calculations**
```typescript
// Revenue-based ranking
const revenueRanking = partners.sort((a, b) => b.totalRevenue - a.totalRevenue)

// Composite score ranking
const compositeScore = (revenue * 0.5) + (referrals * 0.3) + (growth * 0.2)

// Tier determination
const getTier = (revenue) => {
  if (revenue >= 10000) return 'Platinum'
  if (revenue >= 3000) return 'Gold'
  if (revenue >= 1000) return 'Silver'
  return 'Bronze'
}
```

### **API Endpoints**
```typescript
// Leaderboard data fetching
GET /api/partner/leaderboard/rankings
GET /api/partner/leaderboard/user-position
GET /api/partner/leaderboard/achievements
GET /api/partner/leaderboard/tier-benefits
POST /api/partner/leaderboard/set-goal
```

### **Real-time Updates**
- **Live Rankings**: Supabase real-time subscriptions
- **Achievement Notifications**: Instant badge unlocks
- **Rank Change Alerts**: Position movement notifications
- **Competition Updates**: Live challenge progress

---

## 🚀 **Implementation Priority**

### **Phase 1: Core Leaderboard (High Priority)**
- [ ] Basic ranking table with sorting
- [ ] User position highlighting
- [ ] Tier system implementation
- [ ] Top 3 podium display

### **Phase 2: Gamification (Medium Priority)**
- [ ] Achievement badge system
- [ ] Streak tracking
- [ ] Progress indicators
- [ ] Goal setting functionality

### **Phase 3: Social Features (Medium Priority)**
- [ ] Partner profiles
- [ ] Congratulations system
- [ ] Success story features
- [ ] Team challenges

### **Phase 4: Advanced Features (Low Priority)**
- [ ] Historical rank tracking
- [ ] Predictive analytics
- [ ] Custom competitions
- [ ] Advanced filtering

---

## 📋 **Content Requirements**

### **Copy & Messaging**
- **Motivational Headlines**: "Climb the Ranks", "Your Journey to the Top"
- **Achievement Descriptions**: Clear badge criteria and rewards
- **Tier Benefits**: Detailed explanation of tier advantages
- **Congratulatory Messages**: Celebration of achievements

### **Achievement Badges**
- **Icons**: Custom designed badge graphics
- **Descriptions**: Clear criteria for earning
- **Rewards**: Associated benefits and recognition
- **Rarity**: Common, Rare, Epic, Legendary classifications

---

## 🎯 **Success Metrics**

### **Engagement Metrics**
- **Page Views**: Daily leaderboard visits
- **Time on Page**: Average session duration
- **Interaction Rate**: Clicks on rankings and profiles
- **Return Frequency**: Weekly leaderboard check-ins

### **Gamification Effectiveness**
- **Achievement Unlock Rate**: Badges earned per user
- **Goal Completion**: Personal target achievement
- **Rank Improvement**: Position changes over time
- **Competition Participation**: Challenge engagement

---

## 🏆 **Tier System Details**

### **Bronze Tier (£0 - £999)**
- **Commission Bonus**: 5%
- **Tools Access**: Basic referral tools
- **Support**: Email support
- **Recognition**: Bronze badge

### **Silver Tier (£1,000 - £2,999)**
- **Commission Bonus**: 10%
- **Tools Access**: Pro referral tools + templates
- **Support**: Priority email support
- **Recognition**: Silver badge + monthly spotlight

### **Gold Tier (£3,000 - £9,999)**
- **Commission Bonus**: 15%
- **Tools Access**: Premium tools + AI features
- **Support**: Phone + email support
- **Recognition**: Gold badge + quarterly spotlight

### **Platinum Tier (£10,000+)**
- **Commission Bonus**: 20%
- **Tools Access**: VIP access to all features
- **Support**: Dedicated account manager
- **Recognition**: Platinum badge + annual awards

---

**📅 Created**: 2025-01-25  
**🔄 Last Updated**: 2025-01-25  
**👤 Owner**: Development Team  
**📊 Status**: Enhancement Planning 