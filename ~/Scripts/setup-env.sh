#!/bin/bash

# Setup script for Ubahcrypt Auto Prompter
echo "🚀 Setting up Ubahcrypt Auto Prompter Environment..."

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/nvm.bash_completion" ] && \. "$NVM_DIR/nvm.bash_completion"  # This loads nvm bash_completion

# Verify Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "Then: source ~/.zshrc && nvm install --lts"
    exit 1
fi

echo "✅ Node.js $(node --version) ready"
echo "✅ NPM $(npm --version) ready"

# Check if Supabase client is installed
if [ ! -d "$HOME/Scripts/node_modules/@supabase" ]; then
    echo "❌ Supabase client not found. Installing..."
    cd ~/Scripts
    npm install @supabase/supabase-js
    echo "✅ Supabase client installed"
fi

# Check if API key is set
if grep -q "YOUR_SUPABASE_ANON_KEY" ~/Scripts/supabase-client.js; then
    echo "⚠️  WARNING: Please update your Supabase API key in ~/Scripts/supabase-client.js"
    echo "   Replace 'YOUR_SUPABASE_ANON_KEY' with your actual key from:"
    echo "   https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr/settings/api"
    echo ""
    echo "🔑 To get your API key:"
    echo "   1. Go to https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr/settings/api"
    echo "   2. Copy the 'anon public' key"
    echo "   3. Replace YOUR_SUPABASE_ANON_KEY in supabase-client.js"
    echo ""
    read -p "Press Enter when you've updated the API key..."
fi

# Check if Cursor is running
if ! pgrep -x "Cursor" > /dev/null; then
    echo "⚠️  Cursor is not running. Please start Cursor and open src/pages/Home.tsx"
    echo "   Then press Enter to continue..."
    read -p ""
fi

echo "✅ Environment setup complete!"
echo "📍 Project: Ubahcrypt | Page: HomePage | Target: src/pages/Home.tsx"
echo ""
echo "🎯 Ready to run auto prompter. Execute:"
echo "   ~/Scripts/run-prompt-cycle.sh" 