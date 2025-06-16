# 🚀 **SISO Platform - Quick Start Guide**

## ⚡ **5-Minute Orientation**

### **🎯 What is SISO?**
A comprehensive **agency onboarding platform** built with **Vite + React 18 + TypeScript** that helps agencies:
- **Onboard clients** with automated workflows
- **Generate Instagram leads** and manage outreach
- **Track projects** and manage portfolios
- **Handle finances** with invoice and expense management
- **Run partnerships** with affiliate programs

### **🏗️ Tech Stack**
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Real-time + Edge Functions)
- **Integrations**: Instagram API, Payment processing, WhatsApp, Email automation
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

---

## 🛠️ **Immediate Setup (15 minutes)**

### **1️⃣ Clone & Install**
```bash
git clone [repository-url]
cd siso-agency-onboarding-app-main-main
npm install
```

### **2️⃣ Environment Setup**
```bash
cp .env.example .env.local
# Add your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **3️⃣ Start Development**
```bash
npm run dev
# App runs on http://localhost:8081
```

### **4️⃣ Verify Setup**
- ✅ App loads at `http://localhost:8081`
- ✅ No console errors
- ✅ Database connection works (try login)

---

## 🗺️ **Documentation Navigation**

### **🤖 For Claude/AI Development**
- **Start here**: [`claude/CLAUDE-MASTER-CONFIG.md`](./claude/CLAUDE-MASTER-CONFIG.md)
- **Current focus**: [`claude/SESSION-TRACKING.md`](./claude/SESSION-TRACKING.md)
- **Decision patterns**: [`claude/DECISION-TREES.md`](./claude/DECISION-TREES.md)

### **👥 For Human Developers**
- **Architecture overview**: [`architecture/SYSTEM-OVERVIEW.md`](./architecture/SYSTEM-OVERVIEW.md)
- **Development setup**: [`development/GETTING-STARTED.md`](./development/GETTING-STARTED.md)
- **Feature documentation**: [`features/`](./features/)

### **📊 For Project Management**
- **Current progress**: [`project-management/MASTER-PROGRESS.md`](./project-management/MASTER-PROGRESS.md)
- **Feature priorities**: [`features/PRIORITIES.md`](./features/PRIORITIES.md)

---

## 🎯 **User Roles & Access**

### **👑 Admin Users**
- **Access**: `/admin/*` routes
- **Features**: Client management, task oversight, financial tracking
- **Dashboard**: `/admin/dashboard`

### **🏢 Client Users**  
- **Access**: `/client/*` routes
- **Features**: Project tracking, task management, progress monitoring
- **Dashboard**: `/client/dashboard`

### **🤝 Partner Users**
- **Access**: `/partner/*` routes  
- **Features**: Affiliate tracking, commission management
- **Dashboard**: `/partner/dashboard`

---

## ✅ **You're Ready When...**

- ✅ **App runs locally** without errors
- ✅ **Can navigate** major user portals (admin, client, partner)
- ✅ **Understand** the three user types and their access
- ✅ **Know where to find** documentation for specific questions

---

**🎉 Welcome to the SISO team!**  
**⏱️ Time to productivity: ~15 minutes**  
**📚 Next step: Dive into specific areas using the [Master Index](./MASTER-INDEX.md)** 