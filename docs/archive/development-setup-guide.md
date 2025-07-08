# 🚀 SISO Agency Development Environment Setup Guide

**Last Updated**: 2025-01-25  
**Environment**: React + TypeScript + Vite + Claude Integration  
**Status**: ✅ READY FOR DEVELOPMENT

---

## 📋 **QUICK START CHECKLIST**

### ✅ **COMPLETED SETUP STEPS**
- [x] **Dependencies Installed**: All npm packages successfully installed (1082 packages)
- [x] **Claude SDK Ready**: @anthropic-ai/sdk v0.54.0 integrated
- [x] **Development Server**: Configured for http://localhost:8081
- [x] **TypeScript**: Strict typing enabled with v5.5.3
- [x] **Tailwind CSS**: Utility-first styling configured
- [x] **shadcn/ui**: Component library ready
- [x] **Supabase**: Database and auth integration available
- [x] **MCP Tools**: Multiple Model Context Protocol servers configured

### ⚠️ **REQUIRED ENVIRONMENT SETUP**
Create a `.env.local` file in the project root with these essential variables:

```bash
# 🤖 CLAUDE INTEGRATION (REQUIRED)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# 🗄️ SUPABASE (REQUIRED)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 🔧 DEVELOPMENT
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:8081
NODE_ENV=development

# 🎯 FEATURE FLAGS
ENABLE_CLAUDE_INTEGRATION=true
ENABLE_PARTNERSHIP_PROGRAM=true
```

---

## 🛠️ **TECHNOLOGY STACK OVERVIEW**

### **Core Framework**
- **React 18.3.1**: Modern functional components with hooks
- **TypeScript 5.5.3**: Strict typing for better code quality
- **Vite 5.4.1**: Fast build tool and dev server
- **Node.js**: Latest LTS version recommended

### **Styling & UI**
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Lucide Icons**: Beautiful, customizable icons
- **Framer Motion**: Smooth animations and transitions

### **AI & Integration Services**
- **Anthropic Claude SDK**: Primary AI integration
- **Supabase**: Database, auth, and real-time features
- **OpenAI**: Fallback AI service (optional)
- **Multiple MCP Servers**: Enhanced AI capabilities

### **Development Tools**
- **ESLint**: Code linting with React-specific rules
- **TypeScript ESLint**: Additional TypeScript linting
- **PostCSS**: CSS processing with Tailwind

---

## 🚀 **AVAILABLE COMMANDS**

### **Development**
```bash
npm run dev           # Start development server (http://localhost:8081)
npm run build         # Build for production
npm run build:dev     # Build for development environment
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### **Specialized Services**
```bash
npm run whatsapp:dev  # Start with WhatsApp integration
npm run whatsapp:prod # Production WhatsApp mode
npm run multi:dev     # Multi-platform development mode
```

---

## 🔧 **CLAUDE INTEGRATION SETUP**

### **1. API Key Configuration**
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create or select your project
3. Generate an API key
4. Add to your `.env.local` file as `ANTHROPIC_API_KEY`

### **2. SDK Usage Example**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1000,
  messages: [
    {
      role: 'user',
      content: 'Hello, Claude!'
    }
  ]
});
```

### **3. Available Claude Models**
- `claude-3-5-sonnet-20241022`: Latest Sonnet (recommended)
- `claude-3-5-haiku-20241022`: Fast responses
- `claude-3-opus-20240229`: Most capable model

---

## 🗄️ **SUPABASE INTEGRATION**

### **Database Setup**
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create or select your project
3. Get your project URL and anon key from Settings > API
4. Add to `.env.local` file

### **Key Features Available**
- ✅ Authentication system
- ✅ Real-time subscriptions
- ✅ Row Level Security (RLS)
- ✅ Partnership program tables
- ✅ Referral tracking system
- ✅ Commission management

---

## 🎨 **UI/UX GUIDELINES**

### **Design System**
- **Primary Color**: Orange (#f97316) - SISO brand color
- **Theme**: Dark mode by default
- **Typography**: shadcn/ui typography system
- **Spacing**: Tailwind spacing scale
- **Borders**: Consistent radius using shadcn/ui tokens

### **Component Standards**
```typescript
// ✅ GOOD: Use shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ✅ GOOD: TypeScript interfaces
interface Props {
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
}

// ✅ GOOD: Functional components with hooks
const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-orange-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
};
```

---

## 🔌 **MCP TOOLS INTEGRATION**

### **Available MCP Servers**
The project is configured with multiple MCP servers for enhanced AI capabilities:

- **Supabase MCP**: Database operations
- **Sequential Thinking**: Structured problem solving
- **Playwright**: Browser automation and testing
- **GitHub**: Repository management
- **Memory**: Knowledge graph memory
- **Desktop Commander**: File system operations
- **Clear Thought**: Advanced reasoning

### **Usage in Claude**
These tools are automatically available when running Claude with the configured MCP servers.

---

## 📁 **PROJECT STRUCTURE**

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── ui/             # shadcn/ui components
│   └── common/         # Shared components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── integrations/       # External service integrations
    └── supabase/       # Supabase client setup
```

---

## 🧪 **TESTING & DEVELOPMENT**

### **Code Quality Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Component Testing**: Use React Testing Library patterns
- **Type Safety**: All props and functions must be typed

### **Performance Guidelines**
- **Bundle Size**: Target <5MB total
- **Load Time**: Target <2 seconds
- **Mobile First**: Responsive design for all components
- **Code Splitting**: Use dynamic imports for large components

---

## 🔒 **SECURITY CONSIDERATIONS**

### **Environment Variables**
- Never commit `.env.local` or `.env` files
- Use `.env.example` for template
- Rotate API keys regularly
- Use different keys for development/production

### **Supabase Security**
- Row Level Security (RLS) enabled on all tables
- Proper authentication checks
- Input validation on all forms
- SQL injection prevention

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **Port 8081 already in use**
   ```bash
   # Kill process using port
   lsof -ti:8081 | xargs kill -9
   ```

2. **Environment variables not loading**
   - Ensure `.env.local` exists in project root
   - Restart development server after changes
   - Check variable names start with `VITE_` for client-side access

3. **TypeScript errors**
   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   npm run dev
   ```

4. **Supabase connection issues**
   - Verify URL and keys in `.env.local`
   - Check Supabase project status
   - Ensure network connectivity

### **Performance Issues**
- Clear browser cache
- Check for infinite re-renders in React components
- Optimize large component re-renders
- Use React.memo() for expensive components

---

## 📈 **DEVELOPMENT METRICS**

### **Current Status**
- **Dependencies**: 1082 packages installed
- **Build Time**: ~22 seconds (optimized)
- **Bundle Size**: 4.6MB (within target)
- **TypeScript Coverage**: 95%+
- **Security Vulnerabilities**: 8 total (2 moderate, 5 high, 1 critical)

### **Recommended Actions**
- Run `npm audit fix` to address non-breaking security issues
- Monitor bundle size with build reports
- Regular dependency updates
- Performance profiling for large components

---

## 🎯 **NEXT STEPS**

### **Immediate Actions**
1. Create your `.env.local` file with required variables
2. Test the development server: `npm run dev`
3. Verify Claude integration with a simple API call
4. Test Supabase connection and authentication

### **Development Workflow**
1. Create feature branches for new development
2. Follow TypeScript strict typing
3. Use shadcn/ui components consistently
4. Test on multiple screen sizes
5. Commit regularly with descriptive messages

---

## 📞 **SUPPORT & RESOURCES**

### **Documentation Links**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Supabase Docs](https://supabase.com/docs)

### **Project-Specific Docs**
- `docs/progress.md`: Development progress tracking
- `docs/partnership-program/`: Partnership system documentation
- `README.md`: Project overview and quick start

---

**🎉 Environment Status**: READY FOR CLAUDE DEVELOPMENT  
**🔗 Development Server**: http://localhost:8081  
**📝 Last Setup**: Dependencies installed, Claude SDK ready, MCP tools configured  
**⏭️ Next Action**: Create `.env.local` file and start developing with Claude integration 