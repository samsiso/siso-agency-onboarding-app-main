# 🚀 Ubahcrypt Auto Prompter

Automated prompt processing system for Cursor IDE with Supabase integration. This tool automatically fetches prompts from a Supabase database and sends them to Cursor's Composer for AI processing.

## ✨ Features

- 🔄 **Automated Prompt Processing**: Fetches prompts from Supabase and sends to Cursor
- 🎯 **Smart Filtering**: Processes prompts by project name and priority order
- 📊 **Usage Tracking**: Tracks prompt usage statistics and completion status
- 🛡️ **Error Handling**: Robust error handling with AppleScript syntax protection
- 🔧 **Flexible Configuration**: Easy setup for different projects and databases
- 📝 **Clean Output**: Streamlined interface with progress tracking

## 🛠️ Prerequisites

- **macOS** (required for AppleScript integration)
- **Cursor IDE** installed and running
- **Supabase account** with a `project_prompts` table
- **Node.js** (will be installed automatically via setup script)

## 📋 Supabase Database Schema

Your Supabase `project_prompts` table should have these columns:

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

## 🚀 Quick Setup

### 1. Clone/Download this folder
```bash
# Download or clone this folder to your desired location
cd ubahcrypt-auto-prompter
```

### 2. Run the setup script
```bash
chmod +x setup-env.sh
./setup-env.sh
```

### 3. Configure Supabase credentials
Edit `supabase-client.js` and update these values:

```javascript
// ⚠️  IMPORTANT: Update these with your actual Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key-here';
const PROJECT_NAME = 'YourProjectName';  // e.g., 'Ubahcrypt', 'MyProject'
```

**Where to find your credentials:**
- Go to your [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to Settings → API
- Copy the "Project URL" and "anon/public" key

### 4. Make scripts executable
```bash
chmod +x run-prompt-cycle.sh
```

### 5. Start Cursor and run!
```bash
# Make sure Cursor is running first
./run-prompt-cycle.sh
```

## 📖 Usage

### Basic Commands

```bash
# Run the auto prompter (interactive)
./run-prompt-cycle.sh

# Check prompt status
npm run status

# Reset all prompts (for testing)
npm run reset

# Test connection (get next prompt)
npm run test
```

### Running Options

When you run `./run-prompt-cycle.sh`, you'll be prompted:

```
🎯 How many prompts would you like to run?
   Enter a number (1-50 recommended, or 0 for unlimited):
```

- **1-50**: Process specific number of prompts
- **0**: Process all pending prompts (unlimited mode)

## 🔧 Configuration

### Project Name
Update the `PROJECT_NAME` in `supabase-client.js` to match your project:

```javascript
const PROJECT_NAME = 'YourProjectName';
```

### Database Table
The script expects a `project_prompts` table with these key columns:
- `project`: Your project name (for filtering)
- `prompt`: The actual prompt text
- `is_done`: Boolean to track completion
- `times_used`: Usage counter
- `last_used`: Timestamp of last use

## 🐛 Troubleshooting

### Common Issues

**"Node.js not found"**
```bash
# Run setup again
./setup-env.sh
```

**"Cursor is not running"**
- Make sure Cursor IDE is open
- The script checks for running Cursor processes

**"Supabase connection error"**
- Verify your credentials in `supabase-client.js`
- Check your internet connection
- Ensure your Supabase project is active

**"No prompts found"**
- Check that prompts exist with `is_done = false`
- Verify the `PROJECT_NAME` matches your database entries
- Use `npm run status` to see current prompt status

### Debug Commands

```bash
# Check if Node.js is working
node --version

# Test Supabase connection
node supabase-client.js status

# Check for pending prompts
node supabase-client.js get
```

## 📁 File Structure

```
ubahcrypt-auto-prompter/
├── run-prompt-cycle.sh      # Main auto prompter script
├── supabase-client.js       # Database client and operations
├── setup-env.sh            # Environment setup script
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🔄 How It Works

1. **Fetches** the next pending prompt from Supabase (lowest ID first)
2. **Creates** a temporary file with the prompt text (avoids AppleScript syntax issues)
3. **Opens** Cursor Composer with CMD+I
4. **Pastes** the prompt using clipboard
5. **Sends** the prompt with Enter key
6. **Marks** the prompt as done in the database
7. **Waits** 10 seconds before processing the next prompt

## 🚀 Moving to Another Project

To use this with a different GitHub account or project:

1. **Copy this entire folder** to your new project
2. **Update `supabase-client.js`** with new credentials
3. **Change `PROJECT_NAME`** to match your new project
4. **Run `./setup-env.sh`** to install dependencies
5. **Start using** with `./run-prompt-cycle.sh`

## 📝 License

MIT License - feel free to modify and use for your projects!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ for automated AI development workflows** 