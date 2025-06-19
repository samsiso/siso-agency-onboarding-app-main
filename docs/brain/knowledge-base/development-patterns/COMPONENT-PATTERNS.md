# REACT COMPONENT PATTERNS

## 🏗️ **Component Architecture Standards**

### **Standard Component Structure**
```typescript
// 1. Imports (external libs, internal utils, types)
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// 2. Interface Definition
interface ComponentProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  isEditing?: boolean;
}

// 3. Helper Objects/Constants
const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
};

// 4. Component Implementation
export const Component = ({ ...props }: ComponentProps) => {
  // Logic here
  return (
    <motion.div>
      {/* JSX here */}
    </motion.div>
  );
};
```

## 🎨 **Visual Design Patterns**

### **SISO Brand Colors**
```typescript
// Primary Colors
bg-black/20                    // Card backgrounds
border-siso-text/10           // Subtle borders
text-siso-text-bold          // Primary text
text-siso-orange             // Accent color
border-siso-orange/20        // Hover borders

// Status Colors
bg-green-500/20 text-green-400    // Success/Low priority
bg-amber-500/20 text-amber-400    // Warning/Medium priority  
bg-red-500/20 text-red-400       // Error/High priority
bg-purple-500/20 text-purple-400 // Category badges
```

### **Animation Patterns**
```typescript
// Standard Card Animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.01 }}
  className="will-change-transform"
>

// Container Animation (Staggered Children)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Editing State Animation
<motion.div
  initial={false}
  animate={isEditing ? { scale: 1.01 } : { scale: 1 }}
  transition={{ duration: 0.2 }}
>
```

### **Card Component Pattern**
```typescript
// Standard Card Structure
<Card 
  className={cn(
    "bg-black/20 border-siso-text/10 backdrop-blur-sm transition-all duration-300",
    "hover:border-siso-orange/20 hover:shadow-lg hover:shadow-siso-orange/5",
    conditionalState && "border-siso-orange/30",
    className
  )}
>
  <CardHeader>
    <CardTitle className="text-siso-text-bold flex items-center gap-2 text-lg">
      <Icon className="w-5 h-5 text-siso-orange" />
      {title}
    </CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

## 🏷️ **Badge and Status Patterns**

### **Priority Badges**
```typescript
const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400', 
  high: 'bg-red-500/20 text-red-400',
};

const priorityIcons = {
  low: <Clock className="h-3.5 w-3.5" />,
  medium: <CheckSquare className="h-3.5 w-3.5" />,
  high: <AlertTriangle className="h-3.5 w-3.5" />,
};

<Badge 
  variant="outline"
  className={cn(
    'flex items-center gap-1 text-[10px] py-0.5 border-opacity-40',
    priorityColors[priority]
  )}
>
  {priorityIcons[priority]}
  <span className="capitalize">{priority}</span>
</Badge>
```

### **Dynamic Status Colors**
```typescript
// Dynamic background/text based on status object
<Badge 
  className="text-[10px] py-0.5"
  style={{ 
    backgroundColor: `${status.color}20`, 
    color: status.color 
  }}
>
  {status.name}
</Badge>
```

## 👤 **Avatar and User Display Patterns**

### **Standard Avatar with Tooltip**
```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Avatar className="h-7 w-7 ring-1 ring-[#9b87f5]/30">
        <AvatarImage src={user.image} />
        <AvatarFallback className="bg-[#1f2533] text-xs">
          {user.name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
    </TooltipTrigger>
    <TooltipContent>
      <p>Assigned to {user.name}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## 🧭 **Navigation Patterns**

### **Active State Detection**
```typescript
const isItemActive = (href: string, isMainItem = false) => {
  // Hash-based navigation
  if (href.startsWith('#')) {
    return href === activeSection;
  }

  // Perfect match for exact routes
  if (location.pathname === href) {
    return true;
  }

  // Main item permissive matching
  if (isMainItem) {
    return location.pathname.startsWith(href);
  }

  // Dynamic route matching
  if (href.includes(':') && location.pathname.startsWith(href.split(':')[0])) {
    return true;
  }

  return location.pathname.startsWith(href);
};
```

### **Intersection Observer for Sections**
```typescript
useEffect(() => {
  if (location.hash) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }
}, [location.hash]);
```

## 🎛️ **Interactive Patterns**

### **Click Event Handling**
```typescript
// Prevent event bubbling for nested actions
const handleActionClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (actionLink) {
    navigate(actionLink);
  }
};

// Main component click with navigation
<div 
  onClick={onClick}
  className="cursor-pointer transition-all hover:scale-[1.01]"
>
```

### **Conditional Rendering Patterns**
```typescript
// Complex conditional status display
{isOverdue 
  ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'}` 
  : daysLeft === 0 
  ? "Due today" 
  : status?.name === "Done"
  ? "Completed"
  : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}

// Conditional component rendering
{actionButton && (
  <Button onClick={handleActionClick}>
    {actionButton}
  </Button>
)}

{!actionButton && status?.name !== "Done" && (
  <span className="text-xs text-[#aaadb0]">
    {format(startAt, 'MMM d')} - {format(endAt, 'MMM d, yyyy')}
  </span>
)}
```

## 📱 **Responsive Design Patterns**

### **Responsive Sizing**
```typescript
// Icon sizing consistency
className="w-5 h-5"        // Standard icons
className="h-3.5 w-3.5"    // Small icons in badges
className="h-7 w-7"        // Avatar sizing

// Text sizing
className="text-[15px]"     // Card titles
className="text-[10px]"     // Badge text
className="text-xs"         // Auxiliary text
```

### **Hover States**
```typescript
// Standard hover pattern
className="transition-all hover:border-[#9b87f5]/60 hover:shadow-lg hover:scale-[1.01]"

// Button hover
className="bg-[#0078D4] hover:bg-[#1A91FF] transition-all hover:scale-[1.02]"
```

## ✅ **Best Practices Identified**

1. **Consistent Color System**: Use SISO brand colors with opacity modifiers
2. **Animation Standards**: Framer Motion with consistent duration and easing
3. **Type Safety**: Strong TypeScript interfaces for all props
4. **Accessibility**: Proper ARIA labels and semantic HTML
5. **Performance**: Use `will-change-transform` for animations
6. **Responsive**: Mobile-first approach with consistent sizing
7. **Error Boundaries**: Graceful fallbacks for missing data
8. **Event Handling**: Proper event bubbling control
9. **State Management**: Local state for UI, global for data
10. **Code Organization**: Logical import grouping and component structure

---

**Usage**: Apply these patterns when creating new components to maintain consistency across the SISO platform.