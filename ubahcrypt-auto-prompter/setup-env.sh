#!/bin/bash

echo "🚀 Setting up Ubahcrypt Auto Prompter Environment"
echo "=================================================="

# Check if NVM is installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    echo "✅ NVM already installed"
    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node.js
echo "📦 Installing Node.js v22.16.0..."
nvm install 22.16.0
nvm use 22.16.0
nvm alias default 22.16.0

# Verify Node.js installation
echo "🔧 Node.js version: $(node --version)"
echo "🔧 NPM version: $(npm --version)"

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Create Scripts directory if it doesn't exist
mkdir -p "$HOME/Scripts"

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update supabase-client.js with your Supabase credentials"
echo "2. Update the PROJECT_NAME in supabase-client.js"
echo "3. Make sure Cursor is running"
echo "4. Run: ./run-prompt-cycle.sh"
echo ""
echo "📚 For more info, see README.md" 