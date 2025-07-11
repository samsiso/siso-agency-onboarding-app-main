// Fix RLS Policies using Supabase Client
import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  console.log('🔧 Starting RLS Policy Fix...');
  
  try {
    // Step 1: Check current policies
    console.log('\n📋 Checking current policies...');
    const { data: policies, error: policyError } = await supabase
      .rpc('exec_sql', {
        query: `SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'tasks' ORDER BY policyname;`
      });
    
    if (policyError) {
      console.log('Policy check error:', policyError.message);
    } else {
      console.log('Current policies found:', policies?.length || 0);
    }

    // Step 2: Drop all existing policies on tasks table
    console.log('\n🗑️  Dropping existing policies...');
    const dropSQL = `
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
    `;
    
    const { error: dropError } = await supabase.rpc('exec_sql', { query: dropSQL });
    if (dropError) {
      console.log('Drop error:', dropError.message);
    } else {
      console.log('✅ Dropped existing policies');
    }

    // Step 3: Create simple non-recursive policy
    console.log('\n✨ Creating simple policy...');
    const createSQL = `
      CREATE POLICY "users_can_manage_own_tasks" ON tasks
      FOR ALL 
      USING (
          auth.uid() = created_by OR 
          auth.uid() = assigned_to
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { query: createSQL });
    if (createError) {
      console.log('Create policy error:', createError.message);
    } else {
      console.log('✅ Created simple policy');
    }

    // Step 4: Enable RLS
    console.log('\n🔒 Enabling RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      query: 'ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsError) {
      console.log('RLS error:', rlsError.message);
    } else {
      console.log('✅ RLS enabled');
    }

    // Step 5: Test the fix
    console.log('\n🧪 Testing fix...');
    const { data: testData, error: testError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log('❌ Test failed:', testError.message);
    } else {
      console.log('✅ Test passed! Database access working');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixRLSPolicies();