# SISO Agency Onboarding App

A comprehensive React + TypeScript application for SISO Agency's client onboarding process, featuring advanced project management, financial tracking, and AI-powered development tools.

## 🚀 Features

### Core Application
- **Client Onboarding**: Streamlined onboarding process with step-by-step guidance
- **Project Management**: Advanced project tracking with timeline visualization
- **Financial Management**: Comprehensive expense tracking and revenue management
- **Partnership Program**: Multi-tier partnership system with rewards
- **Real-time Collaboration**: Live updates and team coordination tools

### 🧠 AI-Powered Development (NEW!)
- **Self-Updating Context Engine**: Automatic commit processing for enhanced Claude AI assistance
- **Semantic Code Search**: Vector-based search through your development history
- **Intelligent Context**: Claude automatically understands your codebase patterns
- **Zero-Config AI**: Automatic setup with Git hooks and CI/CD integration

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database**: Supabase with pgvector for AI features
- **AI Integration**: OpenAI GPT-4o-mini + Embeddings
- **Deployment**: Vercel

## 📦 Quick Start

### Prerequisites
```bash
# Required for AI features
OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Installation
```bash
# Clone and install
git clone <repository-url>
cd siso-agency-onboarding-app
npm install --legacy-peer-deps

# Setup AI Context Engine (optional but recommended)
./scripts/install-git-hooks.sh

# Start development server
npm run dev
```

### Development with AI Enhancement
```bash
# Your normal workflow now automatically enhances Claude's context
git add .
git commit -m "Add new feature"
git push origin dev

# Claude now knows about your changes automatically! 🎉
```

## 🧠 Context Engine Benefits

**Before**: Manual context sharing
```
You: "Help me fix this bug"
Claude: "Can you show me the relevant code?"
You: *copy-pastes multiple files*
Claude: "What's your project structure?"
You: *explains manually*
```

**After**: Automatic context intelligence
```
You: "Help me fix this bug"
Claude: "Based on your recent authentication refactor and the React patterns you use, here's the exact fix..."
```

**10× Productivity Gains:**
- ⚡ Instant context without copy-pasting
- 🧠 Claude learns your coding patterns  
- 🎯 Project-aware suggestions
- 📈 Faster development cycles

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── client/         # Client portal components
│   ├── auth/           # Authentication components
│   └── ui/             # shadcn/ui components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
└── utils/              # Helper utilities

scripts/                # AI Context Engine
├── brain-commit-processor.js  # Core AI processing
├── install-git-hooks.sh      # Team setup script
└── README.md                 # AI system docs

docs/                   # Documentation
├── context-engine/     # AI system documentation
├── api/               # API documentation
└── guides/            # Development guides
```

## 🎯 Key Components

### Admin Dashboard
- **Client Management**: Complete client lifecycle management
- **Financial Overview**: Revenue tracking and expense management
- **Project Planning**: Timeline and milestone management
- **Team Collaboration**: Task assignment and progress tracking

### Client Portal  
- **Onboarding Flow**: Step-by-step guided process
- **Project Visibility**: Real-time project status updates
- **Document Management**: Secure file sharing and collaboration
- **Communication Hub**: Direct messaging and notifications

### Partnership Program
- **Multi-tier System**: Bronze, Silver, Gold, Platinum tiers
- **Reward Tracking**: Points, achievements, and benefits
- **Referral Management**: Automated referral processing
- **Performance Analytics**: Partner performance metrics

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:8081)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# AI Context Engine
node scripts/brain-commit-processor.js HEAD    # Process latest commit
./scripts/install-git-hooks.sh                # Install Git hooks
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Environment variables required:
# - OPENAI_API_KEY
# - VITE_SUPABASE_URL  
# - VITE_SUPABASE_ANON_KEY
```

### Other Platforms
The app is compatible with any static hosting platform that supports single-page applications.

## 🧪 Testing

```bash
# Run tests
npm test

# Test AI Context Engine
node scripts/brain-commit-processor.js HEAD

# Test Git hooks
.git/hooks/pre-push origin https://github.com/user/repo < /dev/null
```

## 📚 Documentation

- **[Context Engine Guide](docs/context-engine/README.md)**: Complete AI system documentation
- **[API Reference](docs/api/)**: Backend integration guides  
- **[Component Library](docs/components/)**: UI component documentation
- **[Development Guides](docs/guides/)**: Step-by-step development tutorials

## 🤝 Contributing

1. **Setup**: Install dependencies and AI hooks
2. **Develop**: Use standard Git workflow (AI enhancement automatic)
3. **Test**: Ensure all tests pass
4. **Submit**: Create PR (AI will add context summary)

### Code Standards
- **TypeScript**: Strict typing, no `any` types
- **React**: Functional components with hooks only
- **Styling**: Tailwind CSS with dark theme (SISO orange accents)
- **Commits**: Descriptive messages (processed by AI system)

## 🔮 Roadmap

### Current (v1.0)
- ✅ Self-Updating Context Engine
- ✅ Git hooks integration  
- ✅ CI/CD processing
- ✅ Comprehensive documentation

### Next (v1.1)
- 🔄 Prompt-Aware Retrieval Middleware (`/api/brain/search`)
- 🤖 Autonomous Task Generator (PR → Tasks)
- 🗄️ Real-Time Schema Mirror (Auto TypeScript types)
- 🎨 Dark-Theme Component CLI (`@siso/ui`)

### Future (v2.0)
- 📊 Analytics Dashboard
- 🔗 Slack/Discord Integration
- 🎯 Custom AI Prompts
- 🌐 Multi-project Support

## 📄 License

This project is proprietary to SISO Agency. All rights reserved.

## 🆘 Support

- **Documentation**: Check `docs/` directory
- **Issues**: Create GitHub issue with AI context
- **Questions**: Contact the development team

---

**🎉 Enhanced with AI-powered development tools for 10× productivity gains!**

*The Self-Updating Context Engine automatically makes Claude smarter about your codebase with every commit.*
