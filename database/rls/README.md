# Database RLS (Row Level Security) Files

This directory contains all RLS policy fixes and documentation for the SISO Agency Onboarding Platform.

## 🚨 Critical Issue: Task Deletion RLS Error

The task system is currently experiencing infinite recursion errors due to circular RLS policy references. This prevents task deletion operations from working properly.

## 📁 Files in this directory:

### 🔧 Fix Scripts (SQL)
- `fix_rls_simple.sql` - Simple, non-recursive RLS policy fix
- `fix_rls_direct.sql` - Direct database policy fixes  
- `fix_rls_policies.sql` - Comprehensive policy cleanup
- `COMPREHENSIVE_RLS_FIX.sql` - Complete RLS overhaul

### 📋 Documentation
- `RLS_FIX_INSTRUCTIONS.md` - Step-by-step fix guide (START HERE)
- `RLS_IMPLEMENTATION_GUIDE.md` - Technical implementation details
- `RLS_FIX_SUMMARY.md` - Summary of fixes applied
- `MANUAL_RLS_FIX.md` - Manual fix procedures

### 🤖 Automation Scripts (JS)
- `fix_rls_now.js` - Immediate RLS fix via Supabase API
- `fix_rls_final.js` - Final cleanup script
- `fix_rls_supabase.js` - Supabase-specific fixes
- `fix_rls_with_new_keys.js` - Fix with updated API keys
- `fix_rls_with_new_keys.mjs` - ES modules version

## 🚀 Quick Fix Instructions

1. **Start with**: `RLS_FIX_INSTRUCTIONS.md`
2. **Apply**: `fix_rls_simple.sql` in Supabase SQL Editor
3. **Test**: Task deletion should work after applying fixes

## 🎯 Current Status

- ❌ Task deletion blocked by RLS policies
- ❌ Infinite recursion in `user_roles` table policies  
- ✅ All RLS files organized in this directory
- ✅ Fix scripts ready to apply

## 📊 Impact

Until RLS policies are fixed:
- Task deletion shows simulation mode warnings
- AI Task Agent operates in limited mode
- Database operations may fail unexpectedly

---

*All RLS files have been moved from root directory to maintain codebase organization.*