# 🚀 Quick Setup Guide for New Project

## 📋 Checklist for Moving to Another GitHub Account/Project

### 1. ✅ Copy Files
- [x] Copy entire `ubahcrypt-auto-prompter` folder to your new project
- [x] All files included: scripts, configs, documentation

### 2. 🔧 Update Configuration

**Edit `supabase-client.js`:**
```javascript
// Line 4-5: Update with YOUR Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';  // https://your-project.supabase.co
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';  // Your anon key

// Line 8: Update with YOUR project name
const PROJECT_NAME = 'YOUR_PROJECT_NAME';  // e.g., 'MyNewProject'
```

**Edit `package.json` (optional):**
```json
{
  "name": "your-project-auto-prompter",
  "author": "Your Name",
  "repository": {
    "url": "https://github.com/yourusername/your-project.git"
  }
}
```

### 3. 🗄️ Database Setup

**Create Supabase table:**
```sql
CREATE TABLE project_prompts (
  id SERIAL PRIMARY KEY,
  project TEXT NOT NULL,
  prompt TEXT NOT NULL,
  prompt_cycle_number INTEGER,
  is_done BOOLEAN DEFAULT FALSE,
  times_used INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Add your prompts:**
```sql
INSERT INTO project_prompts (project, prompt, prompt_cycle_number) 
VALUES ('YourProjectName', 'Your first prompt here', 1);
```

### 4. 🛠️ Environment Setup

```bash
# Make scripts executable
chmod +x setup-env.sh
chmod +x run-prompt-cycle.sh

# Run setup (installs Node.js + dependencies)
./setup-env.sh
```

### 5. 🎯 Test & Run

```bash
# Test connection
npm run test

# Check status
npm run status

# Run the auto prompter
./run-prompt-cycle.sh
```

## 🔑 Where to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `supabaseUrl`
   - **anon/public key** → `supabaseKey`

## 🚨 Important Notes

- ⚠️ **Never commit** your actual Supabase keys to GitHub
- ✅ **Test with 1-2 prompts** first before running unlimited
- 🔄 **Use `npm run reset`** to reset prompts for testing
- 📱 **Make sure Cursor is running** before starting

## 🎉 You're Ready!

Once configured, just run:
```bash
./run-prompt-cycle.sh
```

And watch your prompts get processed automatically! 🚀 