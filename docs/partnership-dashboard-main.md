# Partnership Dashboard - Main Dashboard Page

## Overview
The main dashboard page serves as the central hub for partners, providing a comprehensive overview of their performance, earnings, and key metrics in a clean, professional interface.

## Current Location
- **Route**: `/dashboard`
- **Component**: `PartnerDashboard.tsx`
- **Layout**: `AffiliateLayout` with black/orange theme

## Essential Features

### 1. **Performance Stats Cards**
- **Total Earnings** - Lifetime commission earnings
- **Monthly Earnings** - Current month performance
- **Active Referrals** - Number of active leads
- **Conversion Rate** - Success rate percentage

**Reusable Component**: `StatsCard.tsx` ✅ Already exists
- Configurable icons, colors, trend indicators
- Animation support with value counting
- Responsive design

### 2. **Recent Activity Feed**
- Payment received notifications
- Referral approval updates
- Tier progression milestones
- Achievement unlocks

**Reusable Component**: `RecentActivityCard.tsx` ✅ Already exists
- Timeline-based activity display
- Icon integration for different activity types
- Real-time update capability

### 3. **Tier Progress Section**
- Visual progress bar showing advancement
- Current tier badge (Bronze → Silver → Gold → Platinum)
- Next tier requirements
- Benefits unlock preview

**Reusable Component**: `EnhancedProgressCard.tsx` ✅ Already exists
- Animated progress bars
- Multi-step progression display
- Achievement badge integration

### 4. **Leaderboard Preview**
- Top 5 partner rankings
- Current user position highlight
- Quick navigation to full leaderboard
- Competitive motivation display

**Reusable Component**: `LeaderboardPreviewCard.tsx` ✅ Already exists
- Compact leaderboard display
- Trophy/medal badge system
- Animated ranking positions

### 5. **Quick Actions Panel**
- **New Referral** - Quick lead submission
- **View Templates** - Access marketing materials
- **Analytics** - Detailed performance view
- **Achievements** - Badge collection display

**Reusable Component**: Custom action cards (can use existing card components)

### 6. **Coming Soon Features**
- Prominently displayed upcoming features
- Feature preview cards
- Early access notifications

## Data Requirements

### Dashboard Statistics
```typescript
interface DashboardStats {
  totalEarnings: number
  monthlyEarnings: number
  activeReferrals: number
  conversionRate: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  tierProgress: number
  nextTierRequirements: string[]
}
```

### Recent Activities
```typescript
interface Activity {
  id: string
  type: 'payment' | 'referral' | 'tier_upgrade' | 'achievement'
  title: string
  description: string
  timestamp: Date
  amount?: number
  icon: string
}
```

### Leaderboard Preview
```typescript
interface PartnerRanking {
  rank: number
  name: string
  earnings: number
  trend: 'up' | 'down' | 'same'
  trendPercentage: number
  avatar?: string
  tier: string
}
```

## Implementation Strategy

### Phase 1: Core Dashboard
1. Implement stats cards using existing `StatsCard.tsx`
2. Set up activity feed with `RecentActivityCard.tsx`
3. Create tier progress section with `EnhancedProgressCard.tsx`

### Phase 2: Interactive Elements
1. Add leaderboard preview using `LeaderboardPreviewCard.tsx`
2. Implement quick actions panel
3. Connect to partnership API endpoints

### Phase 3: Enhancements
1. Add real-time data updates
2. Implement push notifications for activities
3. Add personalized recommendations

## API Integration

### Required Endpoints
- `GET /api/partnership/dashboard/stats` - Dashboard statistics
- `GET /api/partnership/activities` - Recent activities
- `GET /api/partnership/tier-progress` - Tier information
- `GET /api/partnership/leaderboard-preview` - Top partners

## UI/UX Considerations

### Design Principles
- **Clean Layout** - Spacious, professional appearance
- **Information Hierarchy** - Most important metrics prominently displayed
- **Quick Access** - One-click access to common actions
- **Visual Feedback** - Animations and transitions for engagement

### Responsive Behavior
- **Desktop** - Full grid layout with all components visible
- **Tablet** - Responsive grid with component reordering
- **Mobile** - Stacked layout with priority-based display

### Color Scheme
- **Primary**: SISO orange for CTAs and highlights
- **Background**: Black/dark gray base
- **Text**: White/light gray for readability
- **Accents**: Orange gradients for progress and achievements

## Success Metrics
- **Engagement** - Time spent on dashboard
- **Actions** - Quick action usage rates
- **Navigation** - Click-through rates to detailed pages
- **Performance** - Partner satisfaction with dashboard utility

## Future Enhancements
- Customizable widget arrangement
- Personal goal setting and tracking
- Advanced filtering for activities
- Integration with mobile app notifications
- Partnership program announcements display