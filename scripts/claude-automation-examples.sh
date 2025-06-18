#!/bin/bash
# 🚀 Claude Code Automation Examples for SISO Agency Platform
# Based on research findings for permission prompt automation

# =============================================================================
# SAFETY CONFIGURATION
# =============================================================================

# Safe tools for automation (read-only and basic operations)
SAFE_TOOLS="ReadFile,Bash(git log:*),Bash(find:*),Bash(ls:*),Bash(grep:*)"

# Development tools (with file editing capabilities)
DEV_TOOLS="$SAFE_TOOLS,Edit,Bash(npm run lint),Bash(npm run build),Bash(git add:*)"

# Full workflow tools (includes commits and pushes)
FULL_TOOLS="$DEV_TOOLS,Bash(git commit:*),Bash(git push:*),mcp_supabase_execute_sql"

# =============================================================================
# BASIC AUTOMATION EXAMPLES
# =============================================================================

echo "🔍 Example 1: Safe Code Analysis (No Permissions Required)"
claude -p "Analyze the React components in src/components/dashboard/ and suggest improvements for TypeScript usage and SISO brand compliance" \
  --allowedTools "$SAFE_TOOLS" \
  --output-format json

echo "📝 Example 2: Automated Bug Investigation"
claude -p "
Investigate TypeScript compilation errors:
1. Read build output and error logs
2. Analyze affected TypeScript files
3. Identify root causes and suggest fixes
4. Provide detailed remediation plan
Return analysis in JSON format with severity levels.
" \
  --allowedTools "$SAFE_TOOLS,Bash(npm run build)" \
  --output-format json

echo "🎨 Example 3: SISO Brand Compliance Check"
claude -p "
Review all React components for SISO brand compliance:
1. Check for proper orange/yellow theme usage
2. Verify Tailwind class consistency
3. Validate component structure against established patterns
4. Ensure responsive design implementation
Generate compliance report with specific recommendations.
" \
  --allowedTools "$SAFE_TOOLS" \
  --output-format json

# =============================================================================
# DEVELOPMENT AUTOMATION EXAMPLES
# =============================================================================

echo "⚡ Example 4: Automated Feature Development"
claude -p "
Create a new Instagram leads tracking component:
1. Design TypeScript interfaces for lead data
2. Implement React component with SISO styling
3. Add Supabase integration for data fetching
4. Include error handling and loading states
5. Ensure responsive design with Tailwind
6. Run lint and build to verify quality
" \
  --allowedTools "$DEV_TOOLS" \
  --output-format json

echo "🐛 Example 5: Automated Bug Fixing"
claude -p "
Fix ESLint errors in the dashboard components:
1. Run lint to identify all issues
2. Automatically fix auto-fixable issues
3. Manually resolve complex issues
4. Verify all fixes with another lint run
5. Ensure no TypeScript errors introduced
Return summary of fixes applied.
" \
  --allowedTools "$DEV_TOOLS" \
  --output-format json

echo "📊 Example 6: Database Migration Creation"
claude -p "
Create Supabase migration for enhanced Instagram leads:
1. Design new table schema for engagement metrics
2. Create migration SQL with proper constraints
3. Add RLS policies for data security
4. Generate TypeScript types for new schema
5. Validate migration syntax
" \
  --allowedTools "$DEV_TOOLS,mcp_supabase_apply_migration,mcp_supabase_generate_typescript_types" \
  --output-format json

# =============================================================================
# FULL WORKFLOW AUTOMATION (USE WITH CAUTION)
# =============================================================================

echo "🚀 Example 7: Complete Feature Implementation"
claude -p "
Implement complete client dashboard enhancement:
1. Analyze existing client dashboard patterns
2. Create enhanced UI components with SISO branding
3. Integrate with client_onboarding database table
4. Add comprehensive error handling
5. Implement responsive design
6. Run all quality gates (lint, build, type-check)
7. Create feature branch and commit changes
8. Generate pull request description
IMPORTANT: Follow all SISO architectural standards.
" \
  --allowedTools "$FULL_TOOLS" \
  --output-format json

echo "🔄 Example 8: Automated Code Refactoring"
claude -p "
Refactor partnership program components for better maintainability:
1. Analyze current component structure
2. Identify code duplication and improvement opportunities
3. Refactor components following SISO patterns
4. Update TypeScript interfaces for better type safety
5. Ensure all tests still pass after refactoring
6. Commit refactoring with descriptive message
" \
  --allowedTools "$FULL_TOOLS" \
  --output-format json

# =============================================================================
# SPECIALIZED AUTOMATION FOR SISO WORKFLOWS
# =============================================================================

echo "💰 Example 9: Financial Dashboard Automation"
claude -p "
Build financial management dashboard components:
1. Create TypeScript interfaces for financial data
2. Design React components for expense tracking
3. Implement invoice generation functionality
4. Add payment method management UI
5. Integrate with financial_transactions table
6. Include data visualization with charts
7. Ensure SISO brand compliance throughout
" \
  --allowedTools "$FULL_TOOLS,mcp_supabase_get_project,mcp_supabase_list_tables" \
  --output-format json

echo "📱 Example 10: Responsive Design Validation"
claude -p "
Validate and enhance responsive design across the platform:
1. Audit all components for mobile responsiveness
2. Test Tailwind breakpoint usage
3. Identify and fix responsive design issues
4. Ensure consistent mobile experience
5. Validate accessibility standards
6. Generate responsive design compliance report
" \
  --allowedTools "$DEV_TOOLS" \
  --output-format json

# =============================================================================
# HEADLESS MODE EXAMPLES (MAXIMUM AUTOMATION)
# =============================================================================

echo "⚠️  Example 11: Full Automation (Container Only)"
echo "WARNING: Only use --dangerously-skip-permissions in isolated containers!"

# This would bypass ALL permission prompts - extremely dangerous
# claude -p "Complete automated task" --dangerously-skip-permissions

# Safer alternative: Use in Docker container
echo "🐳 Running in Docker container for safety:"
docker run --rm -v "$(pwd):/app" -w /app claude-automation:latest \
  claude -p "
  Perform comprehensive code quality improvements:
  1. Fix all linting issues
  2. Update deprecated dependencies
  3. Optimize bundle size
  4. Improve TypeScript strictness
  5. Generate quality report
  " \
  --dangerously-skip-permissions \
  --output-format json

# =============================================================================
# MONITORING AND LOGGING
# =============================================================================

echo "📊 Example 12: Automated Monitoring"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="automation-log-$TIMESTAMP.json"

claude -p "Generate comprehensive project health report including code quality, performance metrics, and security analysis" \
  --allowedTools "$SAFE_TOOLS,Bash(npm run build),Bash(npm run lint)" \
  --output-format json \
  --verbose \
  | tee "$LOG_FILE"

echo "📁 Automation log saved to: $LOG_FILE"

# =============================================================================
# USAGE INSTRUCTIONS
# =============================================================================

cat << 'EOF'

🎯 USAGE INSTRUCTIONS:

1. SAFETY FIRST:
   - Start with SAFE_TOOLS for read-only operations
   - Gradually increase permissions as you gain confidence
   - Never use --dangerously-skip-permissions outside containers

2. TESTING:
   - Test each automation script in a separate branch
   - Verify results before applying to main codebase
   - Monitor logs for unexpected behavior

3. CUSTOMIZATION:
   - Modify tool allowlists based on your security requirements
   - Adjust prompts for your specific SISO workflows
   - Add additional monitoring and validation steps

4. INTEGRATION:
   - Add these scripts to your development workflow
   - Integrate with CI/CD pipelines
   - Create pre-commit hooks for automated quality checks

📚 For more information, see:
   - docs/research-logs/claude-code-automation-research.md
   - docs/CLAUDE-AUTONOMOUS-AGENT-RULES.md
   - .claude/settings.local.json

EOF