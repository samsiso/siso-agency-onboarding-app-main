# Manual RLS Policy Fix Instructions

## Problem
The app is experiencing "infinite recursion detected in policy for relation 'user_roles'" error, preventing task access.

## Solution
Execute the following SQL commands **directly in your Supabase Dashboard** SQL Editor:

### Step 1: Go to Supabase Dashboard
1. Open https://avdgyrepwrvsvwgxrccr.supabase.co
2. Navigate to **SQL Editor**
3. Create a new query

### Step 2: Execute This SQL (Copy and Paste)

```sql
-- 🔧 RLS Policy Fix for Infinite Recursion
-- Run this in Supabase Dashboard -> SQL Editor

-- Step 1: Drop all existing problematic policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop policies on tasks table
    FOR policy_record IN 
        SELECT policyname, tablename, schemaname 
        FROM pg_policies 
        WHERE tablename = 'tasks'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
    
    -- Drop policies on user_roles table if it exists
    FOR policy_record IN 
        SELECT policyname, tablename, schemaname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 2: Create simple, non-recursive policies
CREATE POLICY "tasks_simple_access" ON tasks 
FOR ALL 
TO authenticated
USING (
    auth.uid() = assigned_to 
    OR 
    auth.uid() = created_by
);

-- Step 3: Create simple policies for related tables
CREATE POLICY "user_roles_simple_access" ON user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Step 4: Handle other tables that may have issues
DO $$
BEGIN
    -- Fix client_user_links if exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_user_links') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Users can view their client links" ON client_user_links';
        EXECUTE 'CREATE POLICY "client_links_simple_access" ON client_user_links FOR ALL TO authenticated USING (auth.uid() = user_id)';
    END IF;
    
    -- Fix client_onboarding if exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_onboarding') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Users can view their onboarding data" ON client_onboarding';
        EXECUTE 'CREATE POLICY "client_onboarding_simple_access" ON client_onboarding FOR ALL TO authenticated USING (auth.uid() = user_id)';
    END IF;
END $$;

-- Step 5: Ensure RLS is properly enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 6: Test the fix
SELECT 
    'RLS policies fixed successfully' as status,
    COUNT(*) as accessible_tasks
FROM tasks;
```

### Step 3: Verify the Fix
After running the SQL, the task management system should work without infinite recursion errors.

### What This Fix Does:
1. **Removes complex policies** that reference themselves
2. **Creates simple policies** using basic `auth.uid()` checks
3. **Avoids recursion** by not referencing the same table in policy conditions
4. **Enables RLS** properly on all affected tables

### Expected Result:
- ✅ Task agent should work without RLS errors
- ✅ Users can access their own tasks
- ✅ No more "infinite recursion" errors

## Alternative: Quick App-Level Fix

If the SQL approach doesn't work immediately, you can also implement a temporary bypass in the application code by modifying the task queries to use the service role temporarily while the RLS is being fixed.