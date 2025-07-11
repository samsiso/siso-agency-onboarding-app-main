-- Simple RLS Policy Fix
-- Date: 2025-07-10
-- Purpose: Fix infinite recursion in RLS policies

-- 1. Drop all existing problematic policies
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

-- 2. Create simple, non-recursive policies for tasks
CREATE POLICY "tasks_access_policy" ON tasks 
FOR ALL 
TO authenticated
USING (
    (SELECT auth.uid()) = assigned_to 
    OR 
    (SELECT auth.uid()) = created_by
);

-- 3. Create simple policies for other affected tables
-- Only create if tables exist
DO $$
BEGIN
    -- Fix user_roles table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        EXECUTE 'CREATE POLICY "user_roles_access_policy" ON user_roles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id)';
        RAISE NOTICE 'Created user_roles policy';
    END IF;
    
    -- Fix client_user_links table if it exists  
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_user_links') THEN
        EXECUTE 'CREATE POLICY "client_user_links_access_policy" ON client_user_links FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id)';
        RAISE NOTICE 'Created client_user_links policy';
    END IF;
    
    -- Fix client_onboarding table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_onboarding') THEN
        EXECUTE 'CREATE POLICY "client_onboarding_access_policy" ON client_onboarding FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id)';
        RAISE NOTICE 'Created client_onboarding policy';
    END IF;
END $$;

-- 4. Ensure RLS is enabled on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 5. Verify the fix with a simple query test
-- This should not cause infinite recursion
SELECT 
    COUNT(*) as task_count,
    'RLS policies fixed successfully' as status
FROM tasks 
WHERE assigned_to = (SELECT auth.uid())
LIMIT 1;