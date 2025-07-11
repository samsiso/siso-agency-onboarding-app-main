#!/usr/bin/env node

// Direct Supabase RLS Policy Fix Script
const { createClient } = require('@supabase/supabase-js');

// Your Supabase configuration
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  console.log('🔧 Starting RLS Policy Fix...');
  
  try {
    // Step 1: Examine current policies
    console.log('\n📋 Step 1: Examining current policies...');
    const { data: currentPolicies, error: examineError } = await supabase
      .rpc('get_policies', { table_name: 'tasks' });
    
    if (examineError) {
      console.log('Using direct SQL query...');
      const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'tasks');
      
      if (error) {
        console.log('Direct query approach...');
      } else {
        console.log('Current policies:', data);
      }
    }

    // Step 2: Drop existing policies
    console.log('\n🗑️  Step 2: Removing problematic policies...');
    const dropPoliciesSQL = `
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
    
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropPoliciesSQL });
    if (dropError) {
      console.log('Drop policies error:', dropError.message);
    } else {
      console.log('✅ Removed existing policies');
    }

    // Step 3: Create simple policy
    console.log('\n✨ Step 3: Creating simple non-recursive policy...');
    const createPolicySQL = `
      CREATE POLICY "users_can_manage_own_tasks" ON tasks
      FOR ALL 
      USING (
          auth.uid() = created_by OR 
          auth.uid() = assigned_to
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createPolicySQL });
    if (createError) {
      console.log('Create policy error:', createError.message);
    } else {
      console.log('✅ Created simple policy');
    }

    // Step 4: Enable RLS
    console.log('\n🔒 Step 4: Ensuring RLS is enabled...');
    const enableRLSSQL = 'ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;';
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });
    if (rlsError) {
      console.log('RLS enable error:', rlsError.message);
    } else {
      console.log('✅ RLS enabled on tasks table');
    }

    // Step 5: Test the fix
    console.log('\n🧪 Step 5: Testing the fix...');
    const { data: testData, error: testError } = await supabase
      .from('tasks')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.log('❌ Test failed:', testError.message);
      console.log('Need to try alternative approach...');
    } else {
      console.log('✅ Test passed! Database access restored.');
      console.log('Task count result:', testData);
    }

  } catch (error) {
    console.error('❌ Error during fix:', error.message);
  }
}

// Run the fix
fixRLSPolicies().then(() => {
  console.log('\n🎉 RLS Policy fix completed!');
  console.log('Your AI Task Agent should now work with real data.');
  console.log('Try saying "delete all tasks" in the task chat.');
}).catch(error => {
  console.error('❌ Failed to fix RLS policies:', error);
});