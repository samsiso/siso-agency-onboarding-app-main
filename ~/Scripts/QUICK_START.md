# 🚀 Quick Start - Ubahcrypt Smart Auto Prompter

## ✅ Setup Complete!

Your smart auto prompter is installed and ready with **automatic file detection**!

## 🎯 How to Run

1. **Just start Cursor** - no need to open specific files!
2. **Run the script**:
   ```bash
   ~/Scripts/run-prompt-cycle.sh
   ```

That's it! The script will:
- 🔍 **Auto-detect target files** from prompt content (e.g., `/src/pages/markets.tsx`)
- 📁 **Open the correct file** in Cursor automatically 
- 📝 **Send the prompt** to Cursor Composer
- ✅ **Mark as complete** in database
- 🔄 **Continue to next prompt**

## 🧠 Smart Features

### **Automatic File Detection**
The script analyzes each prompt and automatically detects file paths like:
- `/src/pages/markets.tsx`
- `/src/components/Header.jsx`
- `src/utils/helpers.ts`
- `components/ui/Button.tsx`

### **File Handling**
- ✅ **File exists**: Opens automatically in Cursor
- ⚠️ **File missing**: Continues with current active file
- 📄 **No file detected**: Uses whatever file is currently open

### **Supported File Types**
- React: `.tsx`, `.jsx`, `.ts`, `.js`
- Vue: `.vue`
- Styles: `.css`, `.scss`, `.sass`
- Others: `.html`, `.php`, `.py`

## 📋 Test Commands

**Test connection:**
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd ~/Scripts
node supabase-client.js get
```

**Test file detection:**
```bash
# Will show the next prompt and detect any file paths
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd ~/Scripts
prompt_data=$(node supabase-client.js get)
echo "$prompt_data" | sed 's/.*"prompt":"\([^"]*\)".*/\1/' | grep -oE '/src/[^[:space:].,;)]*\.(tsx?|jsx?|ts|js|vue|py|php|html|css|scss|sass)' | head -1
```

## 🔍 Monitor Progress

- **Log file**: `~/Scripts/auto-prompt.log`
- **View logs**: `tail -f ~/Scripts/auto-prompt.log`

## 🛑 Stop Script

- **Clean stop**: `Ctrl+C`
- **Emergency**: `Ctrl+Z` (not recommended)

## 📊 Database Query

To check your prompts in Supabase:
```sql
SELECT * FROM project_prompts 
WHERE project = 'Ubahcrypt' 
AND is_done = false 
ORDER BY id ASC;
```

## 🆘 Need Help?

Check the full documentation: `~/Scripts/README.md`

---

## 🎉 **No More Manual File Management!**

The auto prompter now intelligently:
1. 🔍 **Reads each prompt**
2. 🎯 **Finds the target file**
3. 📁 **Opens it in Cursor**
4. 🤖 **Processes the prompt**
5. ✅ **Moves to the next one**

Just run it and let it work its magic! 🪄 