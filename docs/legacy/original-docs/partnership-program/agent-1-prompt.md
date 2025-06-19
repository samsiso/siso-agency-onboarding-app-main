# 🔧 **AGENT 1 PROMPT: Partnership Landing Page Optimization & Mobile Fix**

---

## 🎯 **YOUR MISSION**

You are tasked with fixing critical errors and optimizing the partnership landing page for mobile devices. The development server is currently broken due to a syntax error, and the mobile experience needs significant improvement.

---

## 🚨 **CRITICAL PRIORITY: Fix Development Server**

**IMMEDIATE ACTION REQUIRED**: The development server is broken due to a JSX syntax error in the CommissionCalculator component.

**Error Details**:
- **File**: `src/components/partnership/CommissionCalculator.tsx`
- **Issue**: Missing closing tag for `<motion.div>` at line 271
- **Error Message**: "Expected corresponding JSX closing tag for <motion.div>"

**Your First Task**: 
1. Read the CommissionCalculator.tsx file around line 271
2. Identify the unclosed `<motion.div>` tag
3. Fix the JSX structure to resolve the syntax error
4. Test that the development server runs without errors

---

## 📱 **MOBILE OPTIMIZATION TASKS**

### **Responsive Design Fixes**
- **Target Files**: `src/pages/PartnershipPage.tsx`, `src/components/partnership/CommissionCalculator.tsx`
- **Requirements**:
  - Test on mobile devices (iOS Safari, Chrome, Edge)
  - Ensure touch targets are minimum 44px
  - Fix slider controls for touch interaction
  - Optimize typography scaling for small screens
  - Verify all sections display properly on mobile

### **Performance Optimization**
- **Tasks**:
  - Optimize images and animations for mobile
  - Implement lazy loading for heavy sections
  - Target page load speed <3 seconds
  - Add loading states for dynamic content
  - Optimize bundle size

---

## ✅ **CONTENT VERIFICATION**

**Reference Document**: `docs/partnership-program/comprehensive-todo-list.md`

**Verify These Details**:
- Commission rates display correctly (20%)
- Price ranges are accurate (£249-£2,490)
- Contact information is correct
- FAQ answers are accurate and helpful
- All placeholder content is replaced with real data

---

## 📚 **REFERENCE DOCUMENTATION**

**Essential Reading**:
- `docs/partnership-program/partnership-page-improvement-plan.md`
- `docs/partnership-program/partnership-ui-enhancement-plan.md`
- `docs/partnership-program/partnership-landing-content-guidelines.md`

---

## 🎨 **DESIGN REQUIREMENTS**

- **Theme**: Dark background (`bg-gray-900`) with orange accents (`text-orange-500`)
- **Components**: Use shadcn/ui components and Tailwind CSS
- **Icons**: Lucide React icons only
- **Animations**: Framer Motion for consistency

---

## ✅ **SUCCESS CRITERIA**

Your task is complete when:
- [ ] Development server runs without errors
- [ ] Mobile usability score >95%
- [ ] Page loads in <3 seconds on mobile
- [ ] All commission calculations are accurate
- [ ] Touch interactions work smoothly
- [ ] Content is verified and accurate

---

## 🚀 **GETTING STARTED**

1. **First**: Fix the syntax error in CommissionCalculator.tsx
2. **Second**: Test the page on mobile devices
3. **Third**: Verify all content accuracy
4. **Fourth**: Optimize performance and loading

**Test URL**: `http://localhost:8081/partnership`

---

**🎯 Priority**: 🔴 **CRITICAL - Development server must be fixed first**  
**📱 Focus**: Mobile-first optimization and content accuracy  
**⏱️ Estimated Time**: 2-3 prompts to complete all tasks