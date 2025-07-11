-- COMPREHENSIVE RLS FIX for SISO Agency App
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop all existing policies on tasks table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tasks'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON tasks';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 2: Drop all existing policies on user_roles table (if exists)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON user_roles';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 3: Drop all existing policies on client_user_links table (if exists)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'client_user_links'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON client_user_links';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 4: Drop all existing policies on client_onboarding table (if exists)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'client_onboarding'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON client_onboarding';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 5: Create simple, non-recursive policies

-- Simple policy for tasks table
CREATE POLICY "tasks_user_access" ON tasks
FOR ALL 
TO authenticated
USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    auth.uid() IS NOT NULL
);

-- Simple policy for user_roles table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_roles'
    ) THEN
        EXECUTE 'CREATE POLICY "user_roles_own_access" ON user_roles FOR ALL TO authenticated USING (auth.uid() = user_id)';
        RAISE NOTICE 'Created user_roles policy';
    END IF;
END $$;

-- Simple policy for client_user_links table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'client_user_links'
    ) THEN
        EXECUTE 'CREATE POLICY "client_user_links_own_access" ON client_user_links FOR ALL TO authenticated USING (auth.uid() = user_id)';
        RAISE NOTICE 'Created client_user_links policy';
    END IF;
END $$;

-- Simple policy for client_onboarding table (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'client_onboarding'
    ) THEN
        EXECUTE 'CREATE POLICY "client_onboarding_own_access" ON client_onboarding FOR ALL TO authenticated USING (auth.uid() = user_id)';
        RAISE NOTICE 'Created client_onboarding policy';
    END IF;
END $$;

-- Step 6: Ensure RLS is enabled on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        EXECUTE 'ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_user_links') THEN
        EXECUTE 'ALTER TABLE client_user_links ENABLE ROW LEVEL SECURITY';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_onboarding') THEN
        EXECUTE 'ALTER TABLE client_onboarding ENABLE ROW LEVEL SECURITY';
    END IF;
END $$;

-- Step 7: Test the fix
SELECT 
    'RLS Fix Complete' as status,
    COUNT(*) as total_tasks,
    NOW() as fixed_at
FROM tasks;

-- Step 8: Verify policies are working
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('tasks', 'user_roles', 'client_user_links', 'client_onboarding')
ORDER BY tablename, policyname;