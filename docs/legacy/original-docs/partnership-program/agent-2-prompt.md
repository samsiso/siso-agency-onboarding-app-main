# 🏗️ **AGENT 2 PROMPT: Partner Dashboard & Authentication System**

---

## 🎯 **YOUR MISSION**

You are tasked with building the complete partner dashboard infrastructure, including authentication system, dashboard layout, and a coming soon page with leaderboard functionality. This is a greenfield project - you'll be creating new files and components.

---

## 🔐 **AUTHENTICATION SYSTEM**

### **Create These New Files**:
- `src/pages/auth/PartnerLogin.tsx`
- `src/pages/auth/PartnerRegister.tsx`
- `src/pages/auth/PartnerPasswordReset.tsx`
- `src/components/auth/PartnerAuthForm.tsx`

### **Requirements**:
- **Login Form**: Email/password with "Remember me" option
- **Registration Form**: Name, email, phone, business details
- **Password Reset**: Email-based password recovery
- **Validation**: Real-time form validation with error messages
- **Design**: Dark theme with orange accents, consistent with landing page

### **Authentication Flow**:
1. User clicks "Apply Now" on landing page → Registration
2. Existing partners can login directly
3. Password reset via email link
4. Successful auth redirects to dashboard

---

## 🏠 **DASHBOARD LAYOUT & NAVIGATION**

### **Create These New Files**:
- `src/components/dashboard/PartnerLayout.tsx`
- `src/components/dashboard/PartnerSidebar.tsx`
- `src/components/dashboard/PartnerHeader.tsx`

### **Layout Requirements**:
- **Sidebar Navigation**: Collapsible, mobile-friendly
- **Header Bar**: Partner profile, notifications, logout button
- **Main Content Area**: Responsive grid system
- **Mobile Menu**: Hamburger menu for mobile devices
- **Theme**: Consistent with existing app design patterns

### **Navigation Items**:
- Dashboard (home)
- Coming Soon
- Education Hub (placeholder)
- Templates (placeholder)
- App Plan Generator (placeholder)
- Pipeline (placeholder)
- Profile Settings

---

## 🎯 **COMING SOON PAGE WITH LEADERBOARD**

### **Create These New Files**:
- `src/pages/dashboard/PartnerDashboard.tsx`
- `src/components/dashboard/ComingSoonSection.tsx`
- `src/components/dashboard/PartnerLeaderboard.tsx`

### **Coming Soon Section**:
- **Hero Banner**: "Partner Dashboard - Coming Soon" with launch timeline
- **Feature Preview**: Mockups of upcoming dashboard features
- **Beta Access Form**: Early access signup for beta testing
- **Progress Indicator**: Development progress bar

### **Leaderboard Component**:
- **Views**: Monthly, Quarterly, Yearly tabs
- **Rankings**: Top partners by commission earned (use mock data)
- **Partner Tiers**: Bronze, Silver, Gold, Platinum badges
- **Achievement System**: Milestones and badges
- **Privacy Options**: Anonymous or named rankings

### **Mock Data for Leaderboard**:
```typescript
const mockLeaderboard = [
  { rank: 1, name: "Sarah Johnson", earnings: 4500, tier: "Platinum", deals: 18 },
  { rank: 2, name: "Mike Chen", earnings: 3200, tier: "Gold", deals: 12 },
  { rank: 3, name: "Emma Davis", earnings: 2800, tier: "Gold", deals: 10 },
  // Add more mock data...
];
```

---

## 🎨 **UI COMPONENTS**

### **Create These Reusable Components**:
- `src/components/dashboard/StatsCard.tsx`
- `src/components/dashboard/ProgressTracker.tsx`
- `src/components/dashboard/NotificationBell.tsx`

### **Component Requirements**:
- **StatsCard**: Reusable metric display with icons and animations
- **ProgressTracker**: Visual progress indicator for goals/milestones
- **NotificationBell**: Header notification system with badge count
- **Loading States**: Skeleton screens for all dynamic content
- **Hover Effects**: Subtle micro-interactions and animations

---

## 📚 **REFERENCE DOCUMENTATION**

**Essential Reading**:
- `docs/partnership-program/comprehensive-todo-list.md` (Section 2.2)
- `docs/partnership-program/partnership-program-current-status.md`

**Design Inspiration**: Look at existing dashboard components in `src/components/admin/` for consistency

---

## 🎨 **DESIGN REQUIREMENTS**

- **Theme**: Dark background (`bg-gray-900`) with orange accents (`text-orange-500`)
- **Components**: Use shadcn/ui components and Tailwind CSS
- **Icons**: Lucide React icons only
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first approach

---

## 🔗 **ROUTING SETUP**

Add these routes to your router configuration:
```typescript
// Authentication routes
/auth/login
/auth/register
/auth/reset-password

// Dashboard routes (protected)
/dashboard
/dashboard/coming-soon
/dashboard/education
/dashboard/templates
/dashboard/app-plan-generator
/dashboard/pipeline
/dashboard/profile
```

---

## ✅ **SUCCESS CRITERIA**

Your task is complete when:
- [ ] Complete authentication flow (login/register/reset)
- [ ] Responsive dashboard layout with sidebar navigation
- [ ] Coming soon page with functional leaderboard
- [ ] All components follow dark theme + orange accent design
- [ ] Mobile-friendly navigation and interactions
- [ ] Loading states and error handling implemented

---

## 🚀 **GETTING STARTED**

1. **First**: Create the authentication components and pages
2. **Second**: Build the dashboard layout and navigation
3. **Third**: Implement the coming soon page with leaderboard
4. **Fourth**: Add reusable UI components and polish

**Test URLs**: 
- `http://localhost:8081/auth/login`
- `http://localhost:8081/dashboard`

---

**🎯 Priority**: 🟠 **HIGH - Foundation for partner experience**  
**🏗️ Focus**: Clean architecture and user experience  
**⏱️ Estimated Time**: 3-4 prompts to complete all components