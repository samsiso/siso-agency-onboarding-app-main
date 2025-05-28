# 🚀 Ubahcrypt Auto Prompter Setup Guide

This setup allows you to automatically process prompts from your Supabase `project_prompts` table for the **Ubahcrypt** project, sending them to Cursor's Composer and tracking completion.

## 📋 Prerequisites

1. **Cursor IDE** - Must be running with `src/pages/Home.tsx` open
2. **Node.js** - Will be installed automatically via NVM
3. **Supabase Account** - Access to your project dashboard
4. **Project Data** - Prompts in `project_prompts` table with:
   - `project = 'Ubahcrypt'` (with capital U)
   - `page = 'HomePage'`
   - `is_done = false`

## 🛠️ Installation & Setup

### Step 1: Get Your Supabase API Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr/settings/api)
2. Copy the **anon public** key
3. Update `~/Scripts/supabase-client.js`:
   ```javascript
   const supabaseKey = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### Step 2: Test Your Setup

Test the Node.js script directly:
```bash
# Load NVM and test the connection
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd ~/Scripts
node supabase-client.js get
```

This should return either:
- `{}` (no pending prompts)
- `{"id":123,"prompt":"Your prompt text","prompt_cycle_number":1}` (next prompt)

## 🎯 Usage

### Running the Auto Prompter

1. **Open Cursor** and navigate to your project:
   ```bash
   cd ~/siso-agency-onboarding-app-main-main
   ```

2. **Open the target file** in Cursor:
   - File: `src/pages/Home.tsx`
   - Make sure this file is active/focused

3. **Run the auto prompter**:
   ```bash
   ~/Scripts/run-prompt-cycle.sh
   ```

### Expected Output

```
🚀 Starting Ubahcrypt prompt cycle at 2025-01-26 15:30:00 PST
📍 Project: Ubahcrypt | Page: HomePage
📂 Target File: src/pages/Home.tsx
🔧 Using Node.js v22.16.0
---
🔄 [2025-01-26 15:30:01 PST] Processing Prompt 1 (ID 123, Cycle Number 1)
📝 Prompt: Add a new hero section to the homepage
✅ [2025-01-26 15:30:05 PST] Prompt 1 completed successfully
⏳ [2025-01-26 15:30:05 PST] Waiting 10 seconds before next prompt...
    ⌛ Wait time: 10 seconds remaining (10% complete)
    ⌛ Wait time: 9 seconds remaining (20% complete)
    ...
---
🔄 [2025-01-26 15:30:16 PST] Processing Prompt 2 (ID 124, Cycle Number 2)
...
✅ [2025-01-26 15:30:26 PST] No more pending prompts
🎉 [2025-01-26 15:30:26 PST] All prompts completed for Ubahcrypt HomePage!
```

## 📁 Files Overview

- **`supabase-client.js`** - Node.js script for Supabase operations
- **`run-prompt-cycle.sh`** - Main bash script that orchestrates the process
- **`auto-prompt.log`** - Log file with detailed execution history
- **`package.json`** & **`node_modules/`** - Node.js dependencies

## 🔍 How It Works

1. **Fetches Next Prompt**: Queries Supabase for the lowest `id` where `is_done = false`
2. **Sends to Cursor**: Uses AppleScript to send `CMD+I` and input the prompt
3. **Waits for Processing**: 10-second delay for Cursor to process
4. **Marks Complete**: Updates database with `is_done = true`, increments `times_used`, sets `last_used`
5. **Repeats**: Continues until no more pending prompts

## 🎛️ Controls

- **Stop Cleanly**: `Ctrl+C` (recommended)
- **Emergency Stop**: `Ctrl+Z` (not recommended - may leave prompts in inconsistent state)
- **Monitor Progress**: Check `~/Scripts/auto-prompt.log`

## 🐛 Troubleshooting

### "Node.js not found"
```bash
# Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
```

### "Supabase API key not configured"
- Update `~/Scripts/supabase-client.js` with your actual API key
- Get it from [Settings > API](https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr/settings/api)

### "Cursor is not running"
- Start Cursor application
- Open `src/pages/Home.tsx` in your project
- Make sure the file is focused/active

### "No more pending prompts" (immediately)
- Check your Supabase database:
  ```sql
  SELECT * FROM project_prompts 
  WHERE project = 'Ubahcrypt' 
  AND page = 'HomePage' 
  AND is_done = false 
  ORDER BY id ASC;
  ```
- Ensure prompts exist with exact case-sensitive values

### Script hangs or errors
- Check `~/Scripts/auto-prompt.log` for detailed error messages
- Ensure Cursor has focus and is responsive
- Verify Supabase connection and API key

## 📊 Database Schema

Your `project_prompts` table should have:
```sql
id              INTEGER (Primary Key)
project         TEXT    ('Ubahcrypt')
page            TEXT    ('HomePage')
prompt          TEXT    (The actual prompt)
prompt_cycle_number INTEGER
is_done         BOOLEAN (false for pending)
times_used      INTEGER (auto-incremented)
last_used       TIMESTAMP (auto-updated)
created_at      TIMESTAMP
```

## 🔐 Security Notes

- API key is stored in plain text in `supabase-client.js`
- Ensure proper file permissions on Scripts directory
- Don't commit API keys to version control

## 📞 Support

If you encounter issues:
1. Check the log file: `cat ~/Scripts/auto-prompt.log`
2. Verify your Supabase data with the SQL query above
3. Test the Node.js script independently: `cd ~/Scripts && node supabase-client.js get` 