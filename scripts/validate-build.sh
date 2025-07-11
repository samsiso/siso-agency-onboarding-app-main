#!/bin/bash

# SISO Agency Build Validation Script
# This script checks for critical build files and validates the build

echo "🔍 Validating SISO Agency Build Configuration..."

# Critical files to check
CRITICAL_FILES=(
    "postcss.config.js"
    "tailwind.config.ts"
    "vite.config.ts"
    "package.json"
    "tsconfig.json"
    "components.json"
    "src/index.css"
    "src/main.tsx"
)

# Check if critical files exist
echo "📋 Checking critical build files..."
ALL_FILES_EXIST=true

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ CRITICAL FILE MISSING: $file"
        ALL_FILES_EXIST=false
    else
        echo "✅ $file"
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo ""
    echo "🚨 CRITICAL BUILD FILES ARE MISSING!"
    echo "The application will not work without these files."
    echo "Please restore missing files before continuing."
    exit 1
fi

# Check if Tailwind is properly configured
echo ""
echo "🎨 Checking Tailwind CSS configuration..."
if grep -q "@tailwind" src/index.css; then
    echo "✅ Tailwind CSS imports found in src/index.css"
else
    echo "❌ Tailwind CSS imports missing from src/index.css"
    exit 1
fi

# Test build
echo ""
echo "🏗️  Testing build process..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    echo "🎉 All validation checks passed!"
    echo "Your SISO Agency app is ready for development."
else
    echo "❌ Build failed"
    echo ""
    echo "🚨 Build validation failed!"
    echo "Please check the build output for errors."
    exit 1
fi