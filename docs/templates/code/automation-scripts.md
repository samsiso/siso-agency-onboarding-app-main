# 🚀 **React + TypeScript Development Automation Scripts**

---

## ⚡ **Component Generation Commands**

### 🎯 **Quick Component Creator**
```bash
#!/bin/bash
# Usage: ./create-component.sh ComponentName category

COMPONENT_NAME=$1
CATEGORY=$2

if [ -z "$COMPONENT_NAME" ] || [ -z "$CATEGORY" ]; then
  echo "Usage: ./create-component.sh ComponentName category"
  echo "Example: ./create-component.sh UserCard dashboard"
  exit 1
fi

# Create directory if it doesn't exist
mkdir -p "src/components/${CATEGORY}"

# Create component file
cat > "src/components/${CATEGORY}/${COMPONENT_NAME}.tsx" << 'EOF'
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface {{COMPONENT_NAME}}Props {
  className?: string;
  children?: React.ReactNode;
}

export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  className,
  children
}) => {
  return (
    <div className={cn(
      "bg-gray-900 border border-gray-700 rounded-lg p-4",
      "hover:bg-gray-800 transition-all duration-200",
      className
    )}>
      {children}
    </div>
  );
};

export default {{COMPONENT_NAME}};
EOF

# Replace placeholder with actual component name
sed -i "s/{{COMPONENT_NAME}}/${COMPONENT_NAME}/g" "src/components/${CATEGORY}/${COMPONENT_NAME}.tsx"

echo "✅ Created component: src/components/${CATEGORY}/${COMPONENT_NAME}.tsx"
```

### 🪝 **Custom Hook Generator**
```bash
#!/bin/bash
# Usage: ./create-hook.sh hookName

HOOK_NAME=$1

if [ -z "$HOOK_NAME" ]; then
  echo "Usage: ./create-hook.sh hookName"
  echo "Example: ./create-hook.sh useUserData"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "src/hooks"

# Create hook file
cat > "src/hooks/${HOOK_NAME}.ts" << 'EOF'
import { useState, useEffect, useCallback } from 'react';

interface {{HOOK_NAME_PASCAL}}Props {
  initialValue?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface {{HOOK_NAME_PASCAL}}Return {
  data: any;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  reset: () => void;
}

export const {{HOOK_NAME}} = ({
  initialValue,
  onSuccess,
  onError
}: {{HOOK_NAME_PASCAL}}Props = {}): {{HOOK_NAME_PASCAL}}Return => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Your implementation here
      const result = await fetch('/api/endpoint');
      const responseData = await result.json();
      
      setData(responseData);
      onSuccess?.(responseData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialValue);
    setError(null);
    setLoading(false);
  }, [initialValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset
  };
};
EOF

# Convert hook name to PascalCase for interfaces
HOOK_NAME_PASCAL=$(echo $HOOK_NAME | sed 's/^use/Use/')
sed -i "s/{{HOOK_NAME}}/${HOOK_NAME}/g" "src/hooks/${HOOK_NAME}.ts"
sed -i "s/{{HOOK_NAME_PASCAL}}/${HOOK_NAME_PASCAL}/g" "src/hooks/${HOOK_NAME}.ts"

echo "✅ Created hook: src/hooks/${HOOK_NAME}.ts"
```

### 📝 **Type Definition Generator**
```bash
#!/bin/bash
# Usage: ./create-types.sh EntityName

ENTITY_NAME=$1

if [ -z "$ENTITY_NAME" ]; then
  echo "Usage: ./create-types.sh EntityName"
  echo "Example: ./create-types.sh User"
  exit 1
fi

# Convert to lowercase for filename
ENTITY_LOWER=$(echo $ENTITY_NAME | tr '[:upper:]' '[:lower:]')

# Create types directory if it doesn't exist
mkdir -p "src/types"

# Create type definition file
cat > "src/types/${ENTITY_LOWER}.types.ts" << 'EOF'
// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Main entity interface
export interface {{ENTITY_NAME}} extends BaseEntity {
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, any>;
}

// Form data interface (for creating/updating)
export interface {{ENTITY_NAME}}FormData {
  name: string;
  description?: string;
  status: {{ENTITY_NAME}}['status'];
}

// API response interface
export interface {{ENTITY_NAME}}ApiResponse {
  data: {{ENTITY_NAME}}[];
  total: number;
  page: number;
  hasMore: boolean;
}

// API service interface
export interface {{ENTITY_NAME}}Api {
  getAll: (page?: number) => Promise<{{ENTITY_NAME}}ApiResponse>;
  getById: (id: string) => Promise<{{ENTITY_NAME}}>;
  create: (data: {{ENTITY_NAME}}FormData) => Promise<{{ENTITY_NAME}}>;
  update: (id: string, data: Partial<{{ENTITY_NAME}}FormData>) => Promise<{{ENTITY_NAME}}>;
  delete: (id: string) => Promise<void>;
}

// Utility types
export type {{ENTITY_NAME}}Status = {{ENTITY_NAME}}['status'];
export type {{ENTITY_NAME}}CreatePayload = Omit<{{ENTITY_NAME}}, keyof BaseEntity>;
export type {{ENTITY_NAME}}UpdatePayload = Partial<{{ENTITY_NAME}}CreatePayload>;
EOF

# Replace placeholder with actual entity name
sed -i "s/{{ENTITY_NAME}}/${ENTITY_NAME}/g" "src/types/${ENTITY_LOWER}.types.ts"

echo "✅ Created types: src/types/${ENTITY_LOWER}.types.ts"
```

---

## 🔧 **VSCode Workspace Setup**

### ⚙️ **Auto-Setup VSCode Configuration**
```bash
#!/bin/bash
# Setup VSCode workspace for React + TypeScript + Dark Theme development

echo "🚀 Setting up VSCode workspace for React + TypeScript development..."

# Create .vscode directory
mkdir -p .vscode

# Create settings.json
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "workbench.colorTheme": "One Dark Pro",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.minimap.enabled": false,
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  }
}
EOF

# Create extensions.json
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "zhuangtongfa.material-theme",
    "PKief.material-icon-theme",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "bradlc.vscode-tailwindcss"
  ]
}
EOF

# Create launch.json for debugging
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:8081",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
EOF

echo "✅ VSCode workspace configured!"
echo "📝 Install recommended extensions when prompted"
```

---

## 🎨 **Dark Theme Validation Scripts**

### 🌑 **Dark Theme Checker**
```bash
#!/bin/bash
# Check for non-dark theme patterns in React components

echo "🌑 Checking for dark theme compliance..."

# Check for white backgrounds
echo "❌ Checking for white backgrounds..."
grep -r "bg-white" src/components/ && echo "Found white backgrounds! Use bg-gray-900 instead."

# Check for light text on dark themes
echo "❌ Checking for dark text..."
grep -r "text-black\|text-gray-900" src/components/ && echo "Found dark text! Use text-white or text-gray-100 instead."

# Check for light borders
echo "❌ Checking for light borders..."
grep -r "border-white\|border-gray-100" src/components/ && echo "Found light borders! Use border-gray-700 instead."

# Check for missing dark theme classes
echo "✅ Checking for proper dark theme usage..."
grep -r "bg-gray-900\|bg-gray-800" src/components/ > /dev/null && echo "✅ Found dark backgrounds"
grep -r "text-white\|text-gray-100" src/components/ > /dev/null && echo "✅ Found light text"
grep -r "border-gray-700" src/components/ > /dev/null && echo "✅ Found dark borders"

echo "🌑 Dark theme check complete!"
```

### 🎯 **Component Dark Theme Converter**
```bash
#!/bin/bash
# Convert existing components to dark theme

COMPONENT_FILE=$1

if [ -z "$COMPONENT_FILE" ]; then
  echo "Usage: ./convert-to-dark.sh path/to/component.tsx"
  exit 1
fi

echo "🌑 Converting $COMPONENT_FILE to dark theme..."

# Create backup
cp "$COMPONENT_FILE" "${COMPONENT_FILE}.backup"

# Replace common light theme patterns with dark equivalents
sed -i 's/bg-white/bg-gray-900/g' "$COMPONENT_FILE"
sed -i 's/bg-gray-50/bg-gray-800/g' "$COMPONENT_FILE"
sed -i 's/bg-gray-100/bg-gray-700/g' "$COMPONENT_FILE"
sed -i 's/text-black/text-white/g' "$COMPONENT_FILE"
sed -i 's/text-gray-900/text-gray-100/g' "$COMPONENT_FILE"
sed -i 's/text-gray-800/text-gray-200/g' "$COMPONENT_FILE"
sed -i 's/border-gray-300/border-gray-700/g' "$COMPONENT_FILE"
sed -i 's/border-gray-200/border-gray-600/g' "$COMPONENT_FILE"

echo "✅ Converted $COMPONENT_FILE to dark theme"
echo "💾 Backup saved as ${COMPONENT_FILE}.backup"
```

---

## 📊 **Development Productivity Tools**

### 🔍 **Component Usage Analyzer**
```bash
#!/bin/bash
# Analyze component usage across the project

echo "📊 Analyzing component usage..."

# Find all components
echo "🎯 Components found:"
find src/components -name "*.tsx" | sed 's/.*\///' | sed 's/\.tsx//'

# Find unused components
echo "❌ Potentially unused components:"
for component in $(find src/components -name "*.tsx" | sed 's/.*\///' | sed 's/\.tsx//'); do
  usage_count=$(grep -r "import.*$component\|from.*$component" src --exclude-dir=components | wc -l)
  if [ $usage_count -eq 0 ]; then
    echo "  - $component (not imported anywhere)"
  fi
done

# Find most used components
echo "🔥 Most imported components:"
for component in $(find src/components -name "*.tsx" | sed 's/.*\///' | sed 's/\.tsx//'); do
  usage_count=$(grep -r "import.*$component\|from.*$component" src --exclude-dir=components | wc -l)
  if [ $usage_count -gt 0 ]; then
    echo "  - $component: $usage_count imports"
  fi
done | sort -rn -k2
```

### 🧹 **Code Quality Checker**
```bash
#!/bin/bash
# Check code quality for React + TypeScript

echo "🧹 Running code quality checks..."

# Check for TypeScript errors
echo "🔍 TypeScript check..."
npx tsc --noEmit

# Check for ESLint issues
echo "🔍 ESLint check..."
npx eslint src/ --ext .ts,.tsx

# Check for Prettier formatting
echo "🔍 Prettier check..."
npx prettier --check src/

# Check for unused imports
echo "🔍 Unused imports check..."
npx ts-unused-exports tsconfig.json

# Check for missing interfaces
echo "🔍 Missing TypeScript interfaces..."
grep -r "any\|unknown" src/components/ && echo "❌ Found 'any' types - add proper interfaces"

echo "✅ Code quality check complete!"
```

### 🚀 **Build & Deploy Helper**
```bash
#!/bin/bash
# Build and deploy helper script

echo "🚀 Building and deploying React + TypeScript app..."

# Build the application
echo "📦 Building application..."
npm run build

# Check build success
if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # Deploy (customize based on your deployment method)
  echo "🚀 Deploying to production..."
  # npm run deploy
  # or vercel deploy --prod
  # or firebase deploy
  
  echo "✅ Deployment complete!"
else
  echo "❌ Build failed! Check errors above."
  exit 1
fi
```

---

## 🎯 **Usage Instructions**

### 📋 **Setup Commands**
```bash
# Make scripts executable
chmod +x create-component.sh
chmod +x create-hook.sh
chmod +x create-types.sh
chmod +x setup-vscode.sh
chmod +x check-dark-theme.sh

# Run setup
./setup-vscode.sh
```

### 🎯 **Daily Development Workflow**
```bash
# 1. Create new feature
./create-component.sh UserProfile dashboard
./create-hook.sh useUserProfile
./create-types.sh UserProfile

# 2. Check dark theme compliance
./check-dark-theme.sh

# 3. Run quality checks
./code-quality-check.sh

# 4. Build and deploy
./build-deploy.sh
```

---

**🛠️ All scripts assume React + TypeScript + Tailwind CSS + shadcn/ui stack**  
**🌑 Dark theme patterns are built into all templates**  
**⚡ Customize scripts based on your specific project structure** 