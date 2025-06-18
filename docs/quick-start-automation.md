# 🚀 Quick Start: Test Your Automation System

## Step 1: Initial Setup (5 minutes)

### 1.1 Run the Setup Script
```bash
# Navigate to your project directory
cd /Users/temp/Downloads/Cursor/siso-agency-onboarding-app-main-main

# Run the automated setup
./scripts/setup-automation.sh
```

### 1.2 Configure Your API Keys
Edit your `.env` file with your actual API keys:
```bash
# Open .env file
nano .env

# Add your keys:
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
SUPABASE_PROJECT_ID=your-actual-project-id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key
```

### 1.3 Install Dependencies
```bash
npm install
# or if you use pnpm/yarn:
# pnpm install
# yarn install
```

## Step 2: Database Setup (2 minutes)

### 2.1 Apply Database Migrations
```bash
# If you have Supabase CLI installed:
supabase db push --project-ref your-project-id

# OR manually run the SQL file in your Supabase dashboard:
# Copy contents of: supabase/migrations/20250125_create_automation_tables.sql
# Paste in Supabase SQL Editor and run
```

## Step 3: Test the System (10 minutes)

### 3.1 Start Your Development Server
```bash
npm run dev
```

### 3.2 Access the Automation Dashboard
Open your browser and go to: `http://localhost:8081/automation`

(Note: You may need to add the route to your app first - see Step 4 below)

## Step 4: Add Automation Route to Your App

### 4.1 Update Your Main Router
Add this to your main app router file (likely `src/App.tsx` or similar):

```typescript
import { AutomationPage } from '@/pages/automation/AutomationPage';

// Add this route to your router:
<Route path="/automation" element={<AutomationPage />} />
```

### 4.2 Add Navigation Link
Add to your main navigation:
```typescript
<Link to="/automation" className="nav-link">
  🤖 Automation
</Link>
```

## Step 5: Create Your First Test Task

### 5.1 Simple Test Task
Click "Create Task" in the dashboard and fill in:

**Basic Information:**
- **Name**: "Create a simple utility function"
- **Category**: Development
- **Priority**: Medium
- **Estimated Tokens**: 3000

**Allowed Tools:**
- ReadFile
- Edit
- Bash(git:*)

**Prompt:**
```
Create a simple utility function that formats dates in a nice human-readable way.

Requirements:
- Create a new file: src/utils/dateUtils.ts
- Export a function called formatDate that takes a Date object
- Return format like "January 25, 2025 at 2:30 PM"
- Use TypeScript with proper typing
- Add JSDoc comments

Please implement this utility function following the existing codebase patterns.
```

### 5.2 Click "Create Task"

The system will:
1. Add the task to the queue
2. Show it in the "Task Queue" section
3. Start processing it automatically
4. Show progress in "Active Jobs"

## Step 6: Monitor Task Execution

### 6.1 Watch the Dashboard
You'll see:
- **Queue Length** decrease from 1 to 0
- **Active Jobs** section appear with progress bar
- **Token usage** increase in real-time
- **Rate limits** update as tokens are consumed

### 6.2 Check Task Results
Once complete, you should see:
- ✅ Green checkmark in completed tasks
- New file created: `src/utils/dateUtils.ts`
- Token usage recorded in the charts
- Cost calculated and displayed

## Step 7: Verify the Results

### 7.1 Check if File Was Created
```bash
ls -la src/utils/dateUtils.ts
cat src/utils/dateUtils.ts
```

You should see a properly formatted TypeScript file with the date utility function.

### 7.2 Review in Dashboard
- Check "Completed Today" count increased
- Review token usage in the charts
- See the task marked as "completed" in task history

## Step 8: Try a More Complex Task

### 8.1 Component Creation Task
Create another task:

**Name**: "Add a loading spinner component"
**Category**: Development  
**Priority**: High
**Prompt**:
```
Create a reusable loading spinner component for the SISO design system.

Requirements:
- Create src/components/ui/LoadingSpinner.tsx
- Accept size prop ("sm", "md", "lg") with default "md"
- Accept color prop with default orange-500
- Use Tailwind CSS for styling
- Make it match the dark theme
- Add proper TypeScript types
- Export from src/components/ui/index.ts

Please implement following the existing component patterns in the codebase.
```

**Allowed Tools:**
- ReadFile
- Edit
- Bash(git:*)
- Bash(ls:*)

## Step 9: Monitor and Manage

### 9.1 Watch Multiple Tasks
With both tasks, you can observe:
- Queue management (priority ordering)
- Concurrent execution (if enabled)
- Resource usage across tasks
- Cost accumulation

### 9.2 Test Rate Limiting
Create several tasks quickly to see:
- Rate limiting in action
- Queue building up
- "Next reset" timers
- Usage percentages

## Troubleshooting

### Common Issues & Solutions

#### 1. "Claude Code not found"
```bash
# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code@latest

# Verify installation
claude --version
```

#### 2. "ANTHROPIC_API_KEY not set"
- Check your `.env` file has the correct API key
- Restart your dev server after changing .env
- Ensure no extra spaces around the key

#### 3. "Database connection failed"
- Verify your Supabase project ID and URL
- Check that migrations were applied successfully
- Ensure your Supabase project is active

#### 4. "Permission denied" errors
- Check that scripts are executable: `chmod +x scripts/*.sh`
- Ensure your API key has proper permissions

#### 5. "Route not found" for /automation
- Add the AutomationPage route to your router
- Ensure the import path is correct
- Check that the page component exports properly

## Expected Results

After following these steps, you should have:

✅ **Working automation dashboard** at `/automation`  
✅ **Successful task execution** with file creation  
✅ **Real-time monitoring** of tokens and costs  
✅ **Rate limiting** preventing API abuse  
✅ **Task queue management** with priorities  
✅ **Cost tracking** showing actual usage  

## What to Test Next

Once basic tasks work, try:

1. **Different categories**: Testing, Analysis, Maintenance tasks
2. **Complex prompts**: Multi-file changes, database operations
3. **Tool restrictions**: See how different tool allowlists affect results
4. **Error scenarios**: Invalid prompts, missing files, etc.
5. **Rate limit testing**: Create many tasks to trigger limits

## Quick Commands Reference

```bash
# Check automation status
npm run dev
curl http://localhost:8081/api/automation/status

# View automation logs
tail -f logs/automation.log

# Reset automation database
supabase db reset --project-ref your-project-id

# Test Claude Code directly
claude -p "Simple test prompt" --allowedTools "ReadFile"
```

---

**🎯 Success Criteria**: If you can create a task, see it execute, and find the generated files in your project, your automation system is working perfectly!

**⏱️ Total Setup Time**: ~15-20 minutes  
**🔧 Difficulty**: Beginner-friendly  
**📊 Expected Cost**: <$1 for testing