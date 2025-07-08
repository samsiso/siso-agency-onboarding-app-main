# 🚀 SETUP TELEGRAM BOT GITHUB REPOSITORY

## 📋 **STEP 1: Create GitHub Repository**

### **Option A: Using GitHub Web Interface**
1. Go to [GitHub](https://github.com) and sign in
2. Click **"New"** or **"+"** → **"New repository"**
3. **Repository name:** `siso-telegram-ai-assistant`
4. **Description:** `Advanced Telegram AI Assistant with Voice & Multi-Tool Integration`
5. **Visibility:** Public (recommended) or Private
6. **Initialize with:**
   - ✅ Add a README file
   - ✅ Add .gitignore (Node.js template)
   - ✅ Choose a license (MIT recommended)

### **Option B: Using GitHub CLI**
```bash
# Install GitHub CLI if not installed
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login to GitHub
gh auth login

# Create repository
gh repo create siso-telegram-ai-assistant \
  --description "Advanced Telegram AI Assistant with Voice & Multi-Tool Integration" \
  --public \
  --clone \
  --gitignore-template Node.js \
  --license MIT
```

---

## 📋 **STEP 2: Update Repository Configuration**

### **Update telegram-repository-config.js**
1. Open `telegram-repository-config.js`
2. Replace `'your-username'` with your actual GitHub username:

```javascript
// Find this section and update:
'telegram-bot': {
  owner: 'YOUR_ACTUAL_GITHUB_USERNAME', // ← Update this
  repo: 'siso-telegram-ai-assistant',
  description: 'Advanced Telegram AI Assistant with Voice & Multi-Tool Integration',
  keywords: ['telegram', 'bot', 'ai', 'assistant', 'voice', 'automation'],
  defaultLabels: ['bot-enhancement', 'bug', 'feature', 'integration'],
  priority: 2
},

// Also update other repositories:
'siso-agency': {
  owner: 'YOUR_ACTUAL_GITHUB_USERNAME', // ← Update this
  repo: 'siso-agency-onboarding-app-main-main',
  // ... rest of config
},

'mayor-activities': {
  owner: 'YOUR_ACTUAL_GITHUB_USERNAME', // ← Update this
  repo: 'mayor-activities-tracker',
  // ... rest of config
},

'personal-projects': {
  owner: 'YOUR_ACTUAL_GITHUB_USERNAME', // ← Update this
  repo: 'personal-project-manager',
  // ... rest of config
}
```

---

## 📋 **STEP 3: Add Telegram Bot Code to Repository**

### **Create Initial Files**
```bash
# Clone the new repository
git clone https://github.com/YOUR_USERNAME/siso-telegram-ai-assistant.git
cd siso-telegram-ai-assistant

# Copy bot files from current directory
cp ../server.js .
cp ../telegram-enhanced-features.js .
cp ../telegram-dynamic-prompt-engine.js .
cp ../telegram-repository-config.js .
cp ../package.json .
cp ../package-lock.json .

# Copy documentation
cp ../TELEGRAM_BOT_ENHANCED_SETUP.md ./README.md
cp ../TELEGRAM_BOT_ENHANCEMENT_COMPLETE.md ./FEATURES.md
cp ../GROQ_TTS_INTEGRATION_COMPLETE.md ./TTS_SETUP.md

# Create additional files
mkdir docs
cp ../test-enhanced-features.js ./docs/
cp ../test-dynamic-prompt-engine.js ./docs/
```

### **Create Repository Structure**
```
siso-telegram-ai-assistant/
├── server.js                          # Main server file
├── telegram-enhanced-features.js      # Voice & Notion features
├── telegram-dynamic-prompt-engine.js  # Smart prompting system
├── telegram-repository-config.js      # Multi-repo configuration
├── package.json                       # Dependencies
├── package-lock.json                  # Lock file
├── README.md                          # Setup guide
├── FEATURES.md                        # Feature documentation
├── TTS_SETUP.md                       # TTS integration guide
├── docs/
│   ├── test-enhanced-features.js      # Test files
│   └── test-dynamic-prompt-engine.js  # Test files
└── .gitignore                         # Git ignore file
```

---

## 📋 **STEP 4: Create Additional Repositories (Optional)**

### **Mayor Activities Repository**
```bash
gh repo create mayor-activities-tracker \
  --description "Mayor activities tracking and management system" \
  --public \
  --gitignore-template Node.js \
  --license MIT
```

### **Personal Projects Repository**
```bash
gh repo create personal-project-manager \
  --description "Personal project management and tracking" \
  --public \
  --gitignore-template Node.js \
  --license MIT
```

---

## 📋 **STEP 5: Test Multi-Repository Setup**

### **Test Repository Detection**
Send these messages to your Telegram bot to test repository routing:

```
# Should go to siso-agency repository
"Bug in the agency dashboard - client login not working"

# Should go to telegram-bot repository  
"Enhancement for the telegram bot - add weather integration"

# Should go to mayor-activities repository
"Add new civic event tracking for mayor activities"

# Should go to personal-projects repository
"Personal project idea - build a habit tracker app"
```

### **Verify Repository Creation**
Check that issues are created in the correct repositories:
- Agency issues → `siso-agency-onboarding-app-main-main`
- Bot issues → `siso-telegram-ai-assistant`
- Mayor issues → `mayor-activities-tracker`
- Personal issues → `personal-project-manager`

---

## 📋 **STEP 6: Environment Variables**

### **Update Your Hosting Platform**
Make sure these environment variables are set:
- `GITHUB_TOKEN` - Your GitHub personal access token
- `TELEGRAM_TOKEN` - Your Telegram bot token
- `GROQ_API_KEY` - Your Groq API key
- `NOTION_API_KEY` - Your Notion API key (optional)
- `NOTION_DATABASE_ID` - Your Notion database ID (optional)

---

## 🎯 **SMART REPOSITORY ROUTING**

### **How It Works**
The bot analyzes your message and routes issues to the appropriate repository based on:

1. **Keywords Detection:**
   - "agency", "client", "dashboard" → siso-agency
   - "telegram", "bot", "assistant" → telegram-bot
   - "mayor", "civic", "activities" → mayor-activities
   - "personal", "project" → personal-projects

2. **Explicit Repository Mentions:**
   - "siso-agency repo" → siso-agency
   - "telegram-bot repo" → telegram-bot

3. **Default Fallback:**
   - Unknown messages → siso-agency (primary repo)

### **Example Messages**
- ✅ "Bug in agency dashboard" → siso-agency repo
- ✅ "Telegram bot needs voice improvement" → telegram-bot repo
- ✅ "Mayor meeting scheduler feature" → mayor-activities repo
- ✅ "Personal habit tracker idea" → personal-projects repo

---

## ✅ **COMPLETION CHECKLIST**

- [ ] Created `siso-telegram-ai-assistant` repository
- [ ] Updated `telegram-repository-config.js` with correct usernames
- [ ] Copied all bot files to new repository
- [ ] Created additional repositories (optional)
- [ ] Tested repository routing with sample messages
- [ ] Verified environment variables are set
- [ ] Confirmed issues are created in correct repositories

---

**🎉 Your Telegram bot now supports multiple repositories and intelligent routing!** 