# 🔧 RLS Policy Fix Instructions

## **IMMEDIATE ACTION REQUIRED**

Your task system is blocked by **infinite recursion in RLS policies**. Follow these steps to fix it:

---

## **Step 1: Access Supabase SQL Editor**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `avdgyrepwrvsvwgxrccr`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

---

## **Step 2: Examine Current Policies**

Copy and paste this query to see what policies are causing the problem:

```sql
-- Check current problematic policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename IN ('tasks', 'user_roles')
ORDER BY tablename, policyname;
```

**Look for:**
- Policies that reference both `tasks` and `user_roles` tables
- Complex JOIN conditions
- Circular references

---

## **Step 3: Remove ALL Problematic Policies**

⚠️ **BACKUP NOTE**: Your current policies will be removed. This is necessary to fix the recursion.

```sql
-- Remove all policies on tasks table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname, tablename, schemaname 
        FROM pg_policies 
        WHERE tablename = 'tasks'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;
```

---

## **Step 4: Create Simple, Non-Recursive Policy**

```sql
-- Create simple policy (no recursion)
CREATE POLICY "users_can_manage_own_tasks" ON tasks
FOR ALL 
USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to
);

-- Ensure RLS is enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

---

## **Step 5: Test the Fix**

Run this test query to verify it works:

```sql
-- Test query (should work without errors)
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN created_by = auth.uid() THEN 1 END) as owned_tasks
FROM tasks;
```

**Expected Result:** 
- ✅ No "infinite recursion" error
- ✅ Returns count numbers (even if 0)
- ❌ If you get an error, the policy still has issues

---

## **Step 6: Verify Policy is Correct**

```sql
-- Check final policies
SELECT 
    tablename,
    policyname,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'tasks';
```

**Expected Result:**
- Only 1 policy named `users_can_manage_own_tasks`
- Policy condition: `((auth.uid() = created_by) OR (auth.uid() = assigned_to))`

---

## **Step 7: Test AI Task Agent**

After fixing the policies:

1. Go back to your task system
2. Say **"delete all tasks"** in the AI chat
3. The system should now work with real data instead of simulation

---

## **What This Fix Does**

### ❌ **Before (Broken)**
```sql
-- Complex policy with recursion
CREATE POLICY "complex_task_access" ON tasks
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.role IN (
            SELECT role FROM tasks t WHERE t.id = tasks.id -- RECURSION!
        )
    )
);
```

### ✅ **After (Fixed)**
```sql
-- Simple policy, no recursion
CREATE POLICY "users_can_manage_own_tasks" ON tasks
FOR ALL USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to
);
```

---

## **If You Still Get Errors**

1. **Check for user_roles table policies** - they might also have recursion
2. **Look for foreign key constraints** that reference both tables
3. **Run the full diagnostic script** in `fix_rls_policies.sql`

---

## **Emergency Fallback**

If you're still having issues, temporarily **disable RLS** on the tasks table:

```sql
-- TEMPORARY FALLBACK (not recommended for production)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

Then re-enable it after creating the simple policy:

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

---

## **Next Steps After Fix**

1. ✅ Test "delete all tasks" command
2. ✅ Test task creation
3. ✅ Test status queries
4. ✅ Verify all AI Task Agent functionality works

The AI Task Agent is ready and will immediately start working with real data once these policies are fixed!

---

**Need Help?** If you encounter any issues, copy the exact error message and I'll provide additional troubleshooting steps.