# 🏛️ **SISO System Architecture Overview**

## 🎯 **High-Level Architecture**

### **🏗️ Tech Stack Summary**
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Edge Functions)
- **Deployment**: Vercel (Frontend) + Supabase (Backend)
- **Development**: Claude Code autonomous development + Human oversight

---

## 🌐 **Application Architecture**

### **📱 Frontend Layer (React + TypeScript)**
```
src/
├── components/          # React components organized by feature
│   ├── admin/          # Admin dashboard components
│   ├── client/         # Client portal components  
│   ├── auth/           # Authentication components
│   ├── ui/             # Shared UI components (shadcn/ui)
│   └── common/         # Cross-feature shared components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── integrations/       # External service integrations
```

### **🗄️ Backend Layer (Supabase)**
```
supabase/
├── functions/          # Edge Functions (API endpoints)
├── migrations/         # Database schema changes
└── types/             # Generated TypeScript types
```

---

## 👥 **User Role Architecture**

### **🔐 Authentication Flow**
1. **User Registration** → Supabase Auth
2. **Role Assignment** → `user_roles` table mapping
3. **Route Protection** → React Router guards based on role
4. **Dashboard Routing** → Role-specific UI experiences

### **👑 Admin Portal** (`/admin/*`)
- **Database Access**: Full CRUD operations on all tables
- **Features**: Client management, task oversight, financial tracking, team management
- **Components**: `src/components/admin/`
- **Pages**: `src/pages/admin/`

### **🏢 Client Portal** (`/client/*`)
- **Database Access**: Limited to client's own data
- **Features**: Project tracking, task management, progress monitoring  
- **Components**: `src/components/client/`
- **Pages**: `src/pages/client/`

### **🤝 Partner Portal** (`/partner/*`)
- **Database Access**: Partner-specific affiliate data
- **Features**: Affiliate tracking, commission management, referral tools
- **Components**: `src/components/partnership/`
- **Pages**: `src/pages/partner/`

---

## 🗄️ **Database Architecture (Supabase)**

### **👥 User Management Tables**
- `profiles` - User profile information
- `user_roles` - Role assignments (admin/client/partner)
- `clients` - Client-specific information and settings

### **📝 Core Business Logic Tables**
- `tasks` - All tasks in the system with categories and priorities
- `projects` - Project management and tracking
- `portfolio_items` - Portfolio showcase content
- `invoices` - Financial invoice tracking
- `expenses` - Expense management

### **🤝 Partnership System Tables**
- `partner_applications` - Partnership program applications
- `referrals` - Referral tracking and commission calculation
- `commissions` - Partner earnings and payouts

### **📸 Instagram Lead Generation Tables**
- `instagram_accounts` - Connected Instagram business accounts
- `leads` - Generated leads from Instagram outreach
- `outreach_campaigns` - Campaign management and tracking

---

## 🔄 **Data Flow Patterns**

### **🎯 Frontend → Backend Communication**
1. **Component** makes API call via `src/integrations/supabase/`
2. **Supabase Client** handles authentication and real-time subscriptions
3. **Edge Functions** process complex business logic
4. **Database** stores and retrieves data with RLS (Row Level Security)

### **🔐 Security Architecture**
- **Row Level Security (RLS)** on all Supabase tables
- **Role-based access control** in React components
- **API rate limiting** via Supabase Edge Functions
- **Authentication** handled by Supabase Auth

### **⚡ Real-time Features**
- **Task updates** → Real-time subscriptions for task status changes
- **Client notifications** → Instant updates on project progress
- **Partner earnings** → Live commission tracking

---

## 🔌 **External Integrations**

### **📸 Instagram Business API**
- **Purpose**: Lead generation and account management
- **Implementation**: Edge Functions handle OAuth and API calls
- **Data Flow**: Instagram → Edge Function → Database → Frontend

### **💰 Payment Processing**
- **Purpose**: Invoice payments and partner commission payouts
- **Implementation**: Integration via Edge Functions
- **Security**: PCI compliance through third-party processors

### **📧 Email Automation**
- **Purpose**: Client onboarding and notification workflows
- **Implementation**: Triggered via Edge Functions
- **Templates**: Stored in database, rendered dynamically

### **📱 WhatsApp Integration**
- **Purpose**: Client communication and lead nurturing
- **Implementation**: WhatsApp Business API via Edge Functions
- **Features**: Automated responses and conversation tracking

---

## 🚀 **Performance Considerations**

### **⚡ Frontend Optimization**
- **Code splitting** by route and feature
- **Lazy loading** for non-critical components
- **Image optimization** via Vercel's built-in optimization
- **Bundle analysis** to monitor size and dependencies

### **🗄️ Backend Optimization**
- **Database indexing** on frequently queried columns
- **Query optimization** using Supabase query builder
- **Caching strategies** for static and semi-static data
- **Edge Function deployment** for minimal latency

### **📊 Monitoring & Analytics**
- **Error tracking** via error boundaries and logging
- **Performance monitoring** for Core Web Vitals
- **Database performance** via Supabase dashboard
- **User analytics** for feature usage and adoption

---

## 🛡️ **Security Architecture**

### **🔐 Authentication & Authorization**
- **Supabase Auth** for user authentication
- **JWT tokens** for session management
- **Role-based permissions** enforced at database and UI levels
- **Multi-factor authentication** for admin accounts

### **🗄️ Database Security**
- **Row Level Security (RLS)** policies on all tables
- **API rate limiting** to prevent abuse
- **SQL injection protection** via parameterized queries
- **Data encryption** at rest and in transit

### **🌐 Application Security**
- **HTTPS enforcement** for all communications
- **CORS configuration** for API endpoints
- **Input validation** on all user inputs
- **XSS protection** via React's built-in sanitization

---

## 📈 **Scalability Strategy**

### **🚀 Current Scale**
- **Users**: Designed for 1k+ concurrent users
- **Data**: Optimized for millions of records
- **Features**: Modular architecture for easy feature addition

### **🔮 Future Scaling Plans**
- **Horizontal scaling** via Supabase's built-in scaling
- **Microservices migration** for specific high-load features
- **CDN optimization** for global content delivery
- **Database sharding** strategies for massive data growth

---

**📚 Related Documentation**:
- [Database Schema](./DATABASE-SCHEMA.md) - Detailed table structure
- [Component Architecture](./COMPONENT-ARCHITECTURE.md) - Frontend organization
- [Security Architecture](./SECURITY-ARCHITECTURE.md) - Detailed security patterns
- [API Documentation](../api/API-REFERENCE.md) - Complete API reference 