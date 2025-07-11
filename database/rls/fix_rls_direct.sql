-- 🔧 DIRECT RLS POLICY FIX
-- Copy and paste this into your Supabase SQL Editor

-- ==========================================
-- STEP 1: SEE CURRENT PROBLEM
-- ==========================================
SELECT 
    tablename,
    policyname,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'tasks'
ORDER BY policyname;

-- ==========================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ==========================================
-- Run this to remove all policies causing recursion
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

-- ==========================================
-- STEP 3: CREATE SIMPLE NON-RECURSIVE POLICY
-- ==========================================
CREATE POLICY "users_can_manage_own_tasks" ON tasks
FOR ALL 
USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to
);

-- ==========================================
-- STEP 4: ENABLE RLS
-- ==========================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- STEP 5: TEST THE FIX
-- ==========================================
-- This should work without infinite recursion error
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN created_by = auth.uid() THEN 1 END) as owned_tasks,
    COUNT(CASE WHEN assigned_to = auth.uid() THEN 1 END) as assigned_tasks
FROM tasks;

-- ==========================================
-- STEP 6: VERIFY FINAL STATE
-- ==========================================
-- Should show only 1 simple policy
SELECT 
    tablename,
    policyname,
    cmd,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'tasks';