-- RLS Policy Diagnostic and Fix Script
-- Run this in your Supabase SQL Editor

-- ==========================================
-- STEP 1: EXAMINE CURRENT POLICIES
-- ==========================================

-- Check all policies on tasks table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'tasks' 
ORDER BY policyname;

-- Check all policies on user_roles table (if it exists)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'user_roles' 
ORDER BY policyname;

-- Check table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('tasks', 'user_roles')
ORDER BY table_name, ordinal_position;

-- ==========================================
-- STEP 2: BACKUP CURRENT POLICIES
-- ==========================================

-- Generate DROP statements for current policies (run this first to see what will be removed)
SELECT 
    'DROP POLICY IF EXISTS "' || policyname || '" ON ' || schemaname || '.' || tablename || ';' as drop_statement
FROM pg_policies 
WHERE tablename IN ('tasks', 'user_roles');

-- ==========================================
-- STEP 3: REMOVE PROBLEMATIC POLICIES
-- ==========================================

-- Drop all existing policies on tasks table
-- (Run these one by one if you want to be careful)
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

-- Drop all existing policies on user_roles table (if it exists)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname, tablename, schemaname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- ==========================================
-- STEP 4: CREATE SIMPLE, NON-RECURSIVE POLICIES
-- ==========================================

-- Simple policy for tasks table (no recursion)
CREATE POLICY "users_can_manage_own_tasks" ON tasks
FOR ALL 
USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to
);

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Simple policy for user_roles table (if it exists)
-- Only create this if user_roles table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_roles'
    ) THEN
        EXECUTE 'CREATE POLICY "users_can_view_own_role" ON user_roles FOR SELECT USING (auth.uid() = user_id)';
        EXECUTE 'ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Created policy for user_roles table';
    ELSE
        RAISE NOTICE 'user_roles table does not exist, skipping policy creation';
    END IF;
END $$;

-- ==========================================
-- STEP 5: VERIFY FIX
-- ==========================================

-- Test basic task query (should work without recursion)
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN created_by = auth.uid() THEN 1 END) as owned_tasks,
    COUNT(CASE WHEN assigned_to = auth.uid() THEN 1 END) as assigned_tasks
FROM tasks;

-- Show final policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename IN ('tasks', 'user_roles')
ORDER BY tablename, policyname;

-- ==========================================
-- STEP 6: ADDITIONAL SAFETY CHECKS
-- ==========================================

-- Check if there are any foreign key constraints that might cause issues
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('tasks', 'user_roles')
    AND tc.constraint_type = 'FOREIGN KEY';

-- Check for any remaining recursive references
SELECT 
    p.schemaname,
    p.tablename,
    p.policyname,
    p.qual
FROM pg_policies p
WHERE p.qual LIKE '%user_roles%' 
   OR p.qual LIKE '%tasks%'
ORDER BY p.tablename, p.policyname;