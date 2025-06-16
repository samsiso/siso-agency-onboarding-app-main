# 🔧 **Environment Setup Guide - SISO Agency Onboarding App**

---

## 🚀 **Quick Start Configuration**

### 📋 **Prerequisites**
- Node.js 18+ installed
- ✅ **Google Gemini API key** (provided - implementing now)
- Supabase project access (provided)
- Code editor (VS Code recommended)

---

## 🔑 **Step 1: Environment Configuration**

### 📄 **Create .env File**

Create a new file named `.env` in the project root directory:

```bash
# Navigate to project root
cd /Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main

# Create environment file
touch .env
```

### ⚙️ **Environment Variables Configuration**

Add the following to your `.env` file:

```env
# ===================================
# 🚀 **SUPABASE CONFIGURATION**
# ===================================
VITE_SUPABASE_URL=https://avdgyrepwrvsvwgxrccr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3ODk5NDgsImV4cCI6MjA1MTM2NTk0OH0.i6JC5pPRQEt0Ell8KRe3j1GU6QcWR1gJpCHYW-68qcM

# ===================================
# 🤖 **GOOGLE GEMINI API CONFIGURATION**
# ===================================
# Primary AI API - FREE with generous limits (✅ PROVIDED)
GOOGLE_API_KEY=AIzaSyAKVTs8gFN_djRg_kvMwm9DGKZJbIOgiq4

# ===================================
# 🌐 **DEVELOPMENT CONFIGURATION**
# ===================================
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:8084

# ===================================
# 🔄 **LEGACY/BACKUP CONFIGURATION**
# ===================================
# Keep for fallback if needed
# OPENAI_API_KEY=your_openai_api_key_here_if_needed
```

---

## 🔐 **Step 2: API Keys Setup**

### ✅ **Google Gemini API Key** (COMPLETE)
- **Status**: ✅ **PROVIDED AND READY**
- **Key**: `AIzaSyAKVTs8gFN_djRg_kvMwm9DGKZJbIOgiq4`
- **Benefits**: 
  - Completely free usage
  - 60 requests per minute
  - 1M token context window
  - Superior quality (#1 ranked)

### 🗄️ **Supabase Anonymous Key** (CONFIGURED)
- **Status**: ✅ **CONFIGURED**
- **Project**: avdgyrepwrvsvwgxrccr (ACTIVE_HEALTHY)
- **Key**: Provided in configuration above

---

## 🧪 **Step 3: System Verification**

### 🏃‍♂️ **Start Development Server**

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Expected Output**:
```bash
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:8084/
➜  Network: use --host to expose
```

### ✅ **Quick Health Check**

1. **Browser**: Open `http://localhost:8084`
2. **Console**: Check for any errors (F12 → Console)
3. **Network**: Verify no failed API calls in Network tab

---

## 📋 **Step 4: Feature Testing Checklist**

### 🧪 **Phase 1: Basic Integration**

- [ ] **Page Loading**: All routes load without errors
- [ ] **Dark Theme**: UI displays with dark theme
- [ ] **Responsive**: Layout works on mobile/tablet/desktop
- [ ] **Navigation**: All menu items work correctly

### 🤖 **Phase 2: AI Features (WITH GEMINI)**

- [ ] **Onboarding Flow**: Complete client onboarding process
- [ ] **Plan Generation**: Trigger AI app plan generation with Gemini
- [ ] **Plan Display**: Generated plan displays correctly
- [ ] **Error Handling**: Graceful fallback if API fails

### 🔄 **Phase 3: Complete Journey**

- [ ] **End-to-End**: Full user journey from start to finish
- [ ] **Data Persistence**: Information saves correctly
- [ ] **Cross-Browser**: Works in Chrome, Firefox, Safari
- [ ] **Performance**: Loads quickly and responds smoothly

---

## 🚨 **Troubleshooting Common Issues**

### ❌ **Environment Variables Not Loading**

**Problem**: Variables not accessible in application
```bash
# Solution: Restart development server
npm run dev
```

### 🔑 **Google Gemini API Errors**

**Problem**: "API key not found" or 401 errors
```bash
# Check your .env file format:
GOOGLE_API_KEY=AIzaSyAKVTs8gFN_djRg_kvMwm9DGKZJbIOgiq4
# NOT: GOOGLE_API_KEY="AIzaSy..." or GOOGLE_API_KEY='AIzaSy...'
```

### 🗄️ **Supabase Connection Issues**

**Problem**: Database queries failing
1. **Verify Project ID**: `avdgyrepwrvsvwgxrccr` is correct
2. **Check Anon Key**: Copy exactly from configuration above
3. **Network**: Ensure no firewall blocking Supabase domains

### 🌐 **Port Conflicts**

**Problem**: Development server won't start
```bash
# Try different port
npm run dev -- --port 8085
```

---

## 🔍 **Step 5: Testing Specific Features**

### 🎯 **AI App Plan Generation with Gemini**

1. **Navigate**: Go to onboarding flow
2. **Complete**: Fill out business requirements form
3. **Submit**: Click "Generate App Plan" button
4. **Verify**: Check that Gemini-generated plan appears
5. **Inspect**: Open browser console to check for errors

### 🌑 **Dark Theme Validation**

**Expected Classes**:
```css
background: bg-gray-900, bg-black
text: text-white, text-gray-100
borders: border-gray-700, border-gray-800
cards: bg-gray-800, bg-gray-900
```

### 📱 **Responsive Testing**

**Breakpoints to Test**:
- **Mobile**: 375px, 414px
- **Tablet**: 768px, 1024px  
- **Desktop**: 1280px, 1920px

---

## 📊 **Step 6: Performance Monitoring**

### ⚡ **Key Metrics**

- **Page Load**: < 3 seconds
- **API Response**: < 5 seconds (Gemini is fast!)
- **UI Interactions**: < 300ms
- **Memory Usage**: Stable (no leaks)

### 🛠️ **Monitoring Tools**

1. **Browser DevTools**: Network, Performance, Memory tabs
2. **React DevTools**: Component render times
3. **Console Logging**: Custom performance markers

---

## 📋 **Configuration Files Reference**

### 📄 **Required Files**

```
Project Root/
├── .env                 # ← CREATE THIS WITH GEMINI KEY
├── .gitignore          # ← Should exclude .env
├── package.json        # ← Dependencies
├── vite.config.ts      # ← Build configuration
└── tailwind.config.ts  # ← Styling configuration
```

### 🔒 **Security Best Practices**

- **Never commit** `.env` to git
- **Use different keys** for development/production
- **Rotate keys** regularly
- **Monitor usage** in Google AI Studio dashboard

---

## 🎯 **Success Criteria**

### ✅ **Configuration Complete When**:
- [ ] Development server starts without errors
- [ ] Google Gemini API calls succeed (check browser network tab)
- [ ] Supabase queries execute successfully
- [ ] All UI components render with dark theme
- [ ] No console errors during normal usage

### 🚀 **Ready for Testing When**:
- [ ] Environment configuration complete
- [ ] All features accessible and functional
- [ ] Error handling working as expected
- [ ] Performance metrics within acceptable ranges
- [ ] **COST**: Zero API costs with Gemini free tier

---

## 🆕 **MIGRATION STATUS**

### 🔄 **OpenAI → Google Gemini Migration**
- **Status**: ✅ **API KEY PROVIDED - IMPLEMENTING NOW**
- **Expected Savings**: 100% cost reduction
- **Expected Quality**: Equal or better (Gemini ranked #1)
- **Implementation**: Edge function update in progress

---

## 🔗 **Related Documentation**

- **Research Log**: `docs/research-logs/api-requirements-analysis.md`
- **API Alternatives**: `docs/research-logs/ai-api-alternatives-research.md`
- **Thought Log**: `docs/thought-logs/system-testing-strategy.md`
- **Progress Tracker**: `progress.md`

---

**📅 Created**: 2025-01-25  
**🔄 Updated**: Current session (with Gemini API key)
**👤 Maintainer**: Development Team  
**🎯 Status**: Ready for Gemini implementation with provided API key 