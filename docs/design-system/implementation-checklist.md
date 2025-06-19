# 📋 **Color Scheme Implementation Checklist**

*Quick reference for applying SISO Agency black + orange theme to all pages*

---

## ✅ **Completed Pages**
- [x] **Partner Portal Navigation** (`src/data/affiliateNavigation.ts`)
- [x] **UnifiedSidebar Component** (`src/components/dashboard/UnifiedSidebar.tsx`)
- [x] **PartnerDashboard Page** (`src/pages/dashboard/PartnerDashboard.tsx`)
- [x] **Partnership Page Navigation** (`src/components/partnership/PartnershipNavigation.tsx`)

---

## 🔄 **Pages to Update**

### **High Priority (Core User Pages)**
- [ ] **Main Landing Page** (`src/components/landing/LandingPage.tsx`)
- [ ] **Authentication Pages** (`src/pages/auth/`)
- [ ] **Client Dashboard** (`src/pages/ClientDashboard.tsx`)
- [ ] **Admin Dashboard** (`src/pages/AdminDashboard.tsx`)
- [ ] **App Plan Page** (`src/pages/AppPlan.tsx`)

### **Medium Priority (Secondary Pages)**
- [ ] **Profile Page** (`src/pages/Profile.tsx`)
- [ ] **Settings Pages** (`src/pages/AdminSettings.tsx`)
- [ ] **Help Page** (`src/pages/HelpPage.tsx`)
- [ ] **Tools Page** (`src/pages/Tools.tsx`)
- [ ] **Community Page** (`src/pages/Community.tsx`)

### **Lower Priority (Utility Pages)**
- [ ] **Terms & Privacy** (`src/pages/Terms.tsx`, `src/pages/PrivacyPolicy.tsx`)
- [ ] **Thank You Pages** (`src/pages/ThankYou.tsx`)
- [ ] **Error Pages** (404, etc.)

---

## 🔧 **Quick Replace Guide**

### **Find & Replace Patterns**
```bash
# Main backgrounds
bg-gray-800 → bg-black
bg-gray-700 → bg-gray-900

# Borders
border-gray-700 → border-orange-500/20
border-gray-600 → border-orange-500/30

# Text colors (accents)
text-blue-400 → text-orange-500
text-green-400 → text-orange-400
text-purple-400 → text-orange-500

# Hover states
hover:bg-gray-700 → hover:bg-orange-500/10
hover:text-gray-300 → hover:text-orange-300

# Focus states
focus:bg-gray-700 → focus:bg-orange-500/10
```

---

## 📄 **Component Categories**

### **Navigation Components**
```tsx
// Standard Pattern
<nav className="bg-black border-orange-500/20">
  <button className="hover:bg-orange-500/10 text-orange-500">
    Navigation Item
  </button>
</nav>
```

### **Card Components**
```tsx
// Standard Pattern
<Card className="bg-black border-orange-500/20">
  <CardHeader>
    <Icon className="text-orange-500" />
    <Title className="text-white">Card Title</Title>
  </CardHeader>
</Card>
```

### **Form Components**
```tsx
// Standard Pattern
<Input className="bg-black border-orange-500/20 focus:border-orange-500" />
<Button className="bg-orange-600 hover:bg-orange-700">Submit</Button>
```

---

## ⚡ **Priority Implementation Order**

1. **Update Navigation** (if not already done)
2. **Update Cards** (main content containers)
3. **Update Buttons** (primary interaction elements)
4. **Update Forms** (user input areas)
5. **Update Modals/Dialogs** (overlay components)

---

## 🧪 **Testing Checklist**

After updating each page:
- [ ] Check color contrast meets accessibility standards
- [ ] Verify hover states work correctly
- [ ] Test mobile responsiveness
- [ ] Ensure focus states are visible
- [ ] Validate against design system documentation

---

**📝 Next Step**: Update main landing page components with black + orange theme 