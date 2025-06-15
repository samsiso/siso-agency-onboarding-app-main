# 🎨 **SISO Agency Color Scheme Documentation**

*Version 1.0 | Created: 2025-01-25*

---

## 🎯 **Core Brand Colors**

### **Primary Color Palette**
```css
/* Primary Background */
bg-black                    /* #000000 - Main backgrounds */
bg-gray-900                 /* #111827 - Secondary backgrounds */

/* Primary Accent */
text-orange-500             /* #f97316 - Primary accent color */
text-orange-400             /* #fb923c - Secondary accent color */
text-orange-600             /* #ea580c - Darker accent for emphasis */

/* Borders & Subtle Elements */
border-orange-500/20        /* Orange with 20% opacity - Main borders */
border-orange-500/30        /* Orange with 30% opacity - Emphasized borders */
border-orange-500/40        /* Orange with 40% opacity - Strong borders */
```

---

## 🏗️ **Component-Specific Applications**

### **Navigation Components**
```tsx
// Sidebar Navigation
<nav className="bg-black border-orange-500/20">
  <button className="hover:bg-orange-500/10 hover:text-orange-300">
    // Navigation Item
  </button>
</nav>

// Active Navigation State
<button className="bg-orange-600 text-white shadow-lg shadow-orange-500/30">
  // Active Item
</button>
```

### **Card Components**
```tsx
// Standard Card
<Card className="bg-black border-orange-500/20">
  <CardHeader>
    <Icon className="text-orange-500" />
  </CardHeader>
  <CardContent>
    <div className="text-white">Content</div>
  </CardContent>
</Card>

// Hover States
<div className="hover:bg-orange-500/10 transition-colors">
  // Hoverable content
</div>
```

### **Button Components**
```tsx
// Primary Button
<Button className="bg-orange-600 hover:bg-orange-700 text-white">
  Primary Action
</Button>

// Secondary Button
<Button className="bg-black border-orange-500/20 hover:bg-orange-500/10 text-white">
  Secondary Action
</Button>

// Ghost Button
<Button className="hover:bg-orange-500/10 hover:text-orange-300">
  Ghost Action
</Button>
```

### **Form Components**
```tsx
// Input Fields
<Input className="bg-black border-orange-500/20 focus:border-orange-500 text-white" />

// Select Components
<Select className="bg-black border-orange-500/20">
  <SelectContent className="bg-black border-orange-500/20">
    <SelectItem className="hover:bg-orange-500/10">Option</SelectItem>
  </SelectContent>
</Select>
```

---

## 📱 **Responsive Considerations**

### **Mobile Navigation**
```tsx
// Mobile Menu Button
<button className="bg-black border-orange-500/40 hover:bg-orange-500/20">
  <Menu className="text-white" />
</button>

// Mobile Menu Panel
<nav className="bg-black border-orange-500/30 shadow-xl shadow-orange-500/10">
  // Mobile navigation items
</nav>
```

### **Mobile Cards**
```tsx
// Mobile-optimized cards maintain same color scheme
<Card className="bg-black border-orange-500/20">
  // Responsive content
</Card>
```

---

## 🎭 **Interactive States**

### **Hover Effects**
```css
/* Standard Hover */
.hover-effect {
  @apply hover:bg-orange-500/10 hover:text-orange-300 transition-colors;
}

/* Button Hover */
.button-hover {
  @apply hover:bg-orange-500/20 hover:border-orange-400/60;
}

/* Card Hover */
.card-hover {
  @apply hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10;
}
```

### **Active/Focus States**
```css
/* Active Navigation */
.nav-active {
  @apply bg-orange-600 text-white shadow-lg shadow-orange-500/30;
}

/* Focus States */
.focus-state {
  @apply focus:border-orange-500 focus:ring-orange-500/20;
}
```

---

## 🔧 **Implementation Guidelines**

### **DO's ✅**
- ✅ Use `bg-black` for main backgrounds
- ✅ Use `border-orange-500/20` for subtle borders
- ✅ Use `text-orange-500` for primary accents
- ✅ Use `hover:bg-orange-500/10` for hover states
- ✅ Use `text-white` for primary text
- ✅ Use `text-gray-400` for secondary text
- ✅ Add `shadow-orange-500/10` for elevated components

### **DON'Ts ❌**
- ❌ Don't use `bg-gray-800` or `bg-gray-700` (use `bg-black` instead)
- ❌ Don't use `border-gray-700` (use `border-orange-500/20` instead)
- ❌ Don't use blue, green, or purple accents (use orange variants)
- ❌ Don't use `hover:bg-gray-700` (use `hover:bg-orange-500/10`)
- ❌ Don't mix color schemes within the same page

### **Color Hierarchy**
1. **Background**: `bg-black` (primary) → `bg-gray-900` (secondary)
2. **Accents**: `text-orange-500` (primary) → `text-orange-400` (secondary) → `text-orange-600` (emphasis)
3. **Borders**: `border-orange-500/20` (subtle) → `border-orange-500/30` (standard) → `border-orange-500/40` (strong)
4. **Text**: `text-white` (primary) → `text-gray-400` (secondary) → `text-gray-500` (muted)

---

## 📄 **Page-Specific Applications**

### **Landing Pages**
- Hero sections: `bg-black` with `text-orange-500` accents
- CTA buttons: `bg-orange-600` with `hover:bg-orange-700`
- Cards: `bg-black` with `border-orange-500/20`

### **Dashboard Pages**
- Sidebar: `bg-black` with `border-orange-500/20`
- Cards: `bg-black` with `border-orange-500/20`
- Stats: Icons in `text-orange-500`, values in `text-white`

### **Forms & Modals**
- Background: `bg-black`
- Inputs: `bg-black` with `border-orange-500/20`
- Buttons: `bg-orange-600` for primary actions

---

## 🧪 **Testing & Validation**

### **Accessibility**
- ✅ Orange on black meets WCAG AA standards
- ✅ White text on black meets WCAG AAA standards
- ✅ Orange accents provide sufficient contrast

### **Browser Support**
- ✅ CSS opacity values supported in all modern browsers
- ✅ Tailwind CSS classes compile correctly
- ✅ Dark theme optimized for all devices

---

## 🔄 **Migration Guide**

### **From Gray to Black Theme**
```tsx
// BEFORE (Old Gray Theme)
<Card className="bg-gray-800 border-gray-700">
  <div className="text-blue-400 hover:bg-gray-700">

// AFTER (New Black + Orange Theme)
<Card className="bg-black border-orange-500/20">
  <div className="text-orange-500 hover:bg-orange-500/10">
```

### **Common Replacements**
| Old Class | New Class |
|-----------|-----------|
| `bg-gray-800` | `bg-black` |
| `bg-gray-700` | `bg-gray-900` |
| `border-gray-700` | `border-orange-500/20` |
| `text-blue-400` | `text-orange-500` |
| `text-green-400` | `text-orange-400` |
| `text-purple-400` | `text-orange-500` |
| `hover:bg-gray-700` | `hover:bg-orange-500/10` |
| `focus:bg-gray-700` | `focus:bg-orange-500/10` |

---

## 📚 **Resources**

### **Tailwind CSS Classes Reference**
- [Background Colors](https://tailwindcss.com/docs/background-color)
- [Text Colors](https://tailwindcss.com/docs/text-color)
- [Border Colors](https://tailwindcss.com/docs/border-color)
- [Opacity Modifiers](https://tailwindcss.com/docs/background-color#changing-the-opacity)

### **Component Examples**
- See `src/components/dashboard/UnifiedSidebar.tsx` for navigation implementation
- See `src/pages/dashboard/PartnerDashboard.tsx` for card implementations
- See `src/components/partnership/PartnershipNavigation.tsx` for mobile navigation

---

**🎨 Last Updated**: 2025-01-25  
**🔢 Version**: 1.0  
**🌑 Theme**: Black + Orange Brand Colors  
**⚛️ Framework**: React + TypeScript + Tailwind CSS  
**📝 Status**: Documentation complete - ready for implementation 