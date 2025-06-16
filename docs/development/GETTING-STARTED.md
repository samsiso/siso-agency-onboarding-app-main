# 🚀 **Development Setup Guide**

## 📋 **Prerequisites**

### **💻 Required Software**
- **Node.js** 18+ and npm
- **Git** for version control
- **VS Code** (recommended) with TypeScript and React extensions
- **Supabase CLI** for database management

### **🔑 Required Access**
- **GitHub repository** access
- **Supabase project** credentials
- **Vercel deployment** access (for production)

---

## ⚡ **Quick Setup (15 minutes)**

### **1️⃣ Clone Repository**
```bash
git clone [repository-url]
cd siso-agency-onboarding-app-main-main
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4️⃣ Start Development Server**
```bash
npm run dev
# App runs on http://localhost:8081
```

### **5️⃣ Verify Setup**
- ✅ Navigate to `http://localhost:8081`
- ✅ No console errors in browser
- ✅ Can access login page
- ✅ Database connection working

---

## 🏗️ **Project Structure Understanding**

### **📁 Key Directories**
```
siso-agency-onboarding-app-main-main/
├── src/                 # Frontend source code
│   ├── components/      # React components by feature
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   ├── types/          # TypeScript type definitions
│   └── integrations/   # External service integrations
├── supabase/           # Backend configuration
│   ├── functions/      # Edge Functions
│   └── migrations/     # Database schema changes
├── docs/               # Documentation (this system)
└── public/             # Static assets
```

### **🎯 Component Organization**
- **Feature-based folders**: Each major feature has its own component folder
- **Shared UI components**: Located in `src/components/ui/` (shadcn/ui)
- **Common components**: Cross-feature components in `src/components/common/`
- **Role-specific components**: Admin, client, partner specific components

---

## 🛠️ **Development Workflow**

### **📝 Daily Development Process**
1. **Check current priorities**: Review [`../features/PRIORITIES.md`](../features/PRIORITIES.md)
2. **Pull latest changes**: `git pull origin dev`
3. **Create feature branch**: `git checkout -b feature/your-feature-name`
4. **Develop with hot reload**: Code changes auto-refresh at `localhost:8081`
5. **Commit and push**: Regular commits with descriptive messages
6. **Create pull request**: For code review and integration

### **🔄 Git Workflow**
```bash
# Always work on feature branches
git checkout -b feature/your-feature-name

# Make regular commits
git add .
git commit -m "feat: add new dashboard component"

# Push to remote branch
git push origin feature/your-feature-name

# Create pull request for review
# Merge to dev branch (never directly to main)
```

### **🧪 Quality Assurance**
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build verification
npm run build

# Preview production build
npm run preview
```

---

## 🎨 **Design System Guidelines**

### **🌈 Color Scheme (Dark Theme)**
- **Primary Background**: `bg-gray-900`
- **Secondary Background**: `bg-gray-800`
- **Text**: `text-white` or `text-gray-100`
- **SISO Brand Orange**: `text-orange-500`, `bg-orange-600`
- **Borders**: `border-gray-700`

### **🧩 UI Components**
- **Base Components**: Use shadcn/ui components from `src/components/ui/`
- **Custom Components**: Build feature-specific components on top of base
- **Icons**: Use Lucide React icons consistently
- **Responsive**: Mobile-first design with Tailwind breakpoints

### **📝 Component Patterns**
```typescript
// Functional components with TypeScript interfaces
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-900 text-white p-4">
      <h1 className="text-orange-500">{title}</h1>
      {children}
    </div>
  );
};
```

---

## 🗄️ **Database Development**

### **🔧 Supabase Local Development**
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Start local Supabase (optional)
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

### **📊 Database Access Patterns**
```typescript
// Use the Supabase client from integrations
import { supabase } from '@/integrations/supabase/client';

// Query with TypeScript safety
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId);
```

---

## 🚀 **Deployment Process**

### **🔍 Pre-deployment Checklist**
- [ ] All TypeScript errors resolved
- [ ] No console errors in development
- [ ] Components follow design system
- [ ] Database migrations tested
- [ ] Environment variables configured

### **📦 Vercel Deployment**
- **Development branch**: Auto-deploys to preview URL
- **Main branch**: Deploys to production
- **Manual deployment**: Via Vercel dashboard or CLI

---

## 🐛 **Common Issues & Solutions**

### **🔧 TypeScript Issues**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check

# Regenerate Supabase types
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

### **🗄️ Database Connection Issues**
- Check environment variables in `.env.local`
- Verify Supabase project URL and anon key
- Check network connectivity to Supabase

### **🎨 Styling Issues**
- Ensure Tailwind classes are properly applied
- Check for CSS conflicts with component libraries
- Verify dark theme classes are used consistently

---

## 🤖 **Claude Code Integration**

### **🎯 AI-Assisted Development Setup**
- **Claude configuration**: [`../claude/CLAUDE-MASTER-CONFIG.md`](../claude/CLAUDE-MASTER-CONFIG.md)
- **Development templates**: [`../templates/code/`](../templates/code/)
- **Decision trees**: [`../claude/DECISION-TREES.md`](../claude/DECISION-TREES.md)

### **🔄 Autonomous Development Workflow**
1. **Context loading**: Claude reads current session tracking
2. **Feature development**: Following established patterns and templates
3. **Code generation**: TypeScript + React + Tailwind + shadcn/ui
4. **Quality assurance**: Automated testing and validation
5. **Documentation updates**: Keep docs in sync with code changes

---

## 📚 **Learning Resources**

### **🎯 SISO-Specific Documentation**
- **Architecture overview**: [`../architecture/SYSTEM-OVERVIEW.md`](../architecture/SYSTEM-OVERVIEW.md)
- **Feature documentation**: [`../features/`](../features/)
- **API reference**: [`../api/API-REFERENCE.md`](../api/API-REFERENCE.md)

### **🛠️ Technology Learning**
- **React 18**: Official React documentation
- **TypeScript**: TypeScript handbook
- **Tailwind CSS**: Official Tailwind documentation
- **Supabase**: Supabase documentation and guides
- **shadcn/ui**: Component library documentation

---

## ✅ **Setup Verification Checklist**

### **🏃‍♂️ Development Environment**
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] Environment variables configured
- [ ] Development server running on `localhost:8081`
- [ ] No console errors in browser

### **🗄️ Database Integration**
- [ ] Supabase connection working
- [ ] Can authenticate with test user
- [ ] Database queries executing successfully
- [ ] TypeScript types generated

### **🎨 UI/UX Verification**
- [ ] Dark theme applied correctly
- [ ] Orange brand colors showing
- [ ] shadcn/ui components rendering
- [ ] Responsive design working on mobile

### **📚 Documentation Access**
- [ ] Can navigate documentation structure
- [ ] Master index accessible
- [ ] Feature documentation available
- [ ] Claude configuration readable

---

**🎉 Development Environment Ready!**  
**⏱️ Setup time: ~15 minutes**  
**🚀 Next steps: Start building features using the established patterns and templates** 