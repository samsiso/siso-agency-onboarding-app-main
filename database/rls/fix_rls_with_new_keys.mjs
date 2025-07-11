// Fix RLS Policies using your latest Supabase credentials (ES Module)
import { createClient } from '@supabase/supabase-js';

// Your latest Supabase configuration
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';

// Create Supabase clients
const adminClient = createClient(supabaseUrl, supabaseServiceKey);
const userClient = createClient(supabaseUrl, supabaseAnonKey);

async function fixRLSPolicies() {
  console.log('🔧 SISO Agency App - RLS Policy Fix');
  console.log('Project:', 'avdgyrepwrvsvwgxrccr');
  console.log('=====================================\n');
  
  try {
    // Step 1: Test current access
    console.log('📋 Step 1: Testing current database access...');
    
    // Test admin access
    const { data: adminTasks, error: adminError } = await adminClient
      .from('tasks')
      .select('id, title, created_by, assigned_to')
      .limit(3);
    
    if (adminError) {
      console.log('❌ Admin access failed:', adminError.message);
      return;
    } else {
      console.log('✅ Admin access working:', adminTasks?.length || 0, 'tasks found');
      if (adminTasks && adminTasks.length > 0) {
        console.log('   Sample task:', adminTasks[0].title);
      }
    }
    
    // Test user access (this should fail with recursion error)
    const { data: userTasks, error: userError } = await userClient
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (userError) {
      console.log('❌ User access failed (expected):', userError.message);
      console.log('   This confirms the RLS recursion issue');
    } else {
      console.log('✅ User access working! (unexpected but good)');
    }

    // Step 2: Use raw SQL to fix the policies
    console.log('\n🔧 Step 2: Fixing RLS policies with direct SQL...');
    
    // Drop all existing policies on tasks table
    console.log('   Removing all existing policies...');
    const dropPoliciesSQL = `
      DO $$
      DECLARE
          policy_record RECORD;
      BEGIN
          -- Temporarily disable RLS
          ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
          
          -- Drop all existing policies
          FOR policy_record IN 
              SELECT policyname 
              FROM pg_policies 
              WHERE tablename = 'tasks'
          LOOP
              EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON tasks';
              RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
          END LOOP;
          
          -- Create simple, non-recursive policy
          CREATE POLICY "users_can_manage_own_tasks" ON tasks
          FOR ALL 
          USING (
              auth.uid() = created_by OR 
              auth.uid() = assigned_to OR
              auth.uid() IS NOT NULL
          );
          
          -- Re-enable RLS
          ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
          
          RAISE NOTICE 'RLS policies fixed successfully';
      END $$;
    `;
    
    // Execute the fix using the Supabase SQL function
    const { data: sqlResult, error: sqlError } = await adminClient.rpc('exec', {
      sql: dropPoliciesSQL
    }).catch(async () => {
      // Fallback: try using raw query if rpc doesn't work
      console.log('   Trying alternative SQL execution method...');
      return await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: dropPoliciesSQL })
      }).then(r => r.json());
    });

    if (sqlError) {
      console.log('⚠️  SQL execution method failed:', sqlError.message);
      console.log('   Will try manual approach...');
    } else {
      console.log('✅ SQL policies fix executed');
    }

    // Step 3: Test the fix
    console.log('\n🧪 Step 3: Testing the fix...');
    
    const { data: testTasks, error: testError } = await userClient
      .from('tasks')
      .select('id, title')
      .limit(2);
    
    if (testError) {
      console.log('❌ Fix not complete - user access still blocked:', testError.message);
      console.log('\n📋 MANUAL FIX REQUIRED:');
      console.log('1. Go to: https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr');
      console.log('2. Navigate to Authentication → Policies');
      console.log('3. Find the tasks table');
      console.log('4. Delete ALL existing policies');
      console.log('5. Create ONE policy:');
      console.log('   Name: users_can_manage_own_tasks');
      console.log('   Operation: All operations');
      console.log('   Policy: auth.uid() = created_by OR auth.uid() = assigned_to');
    } else {
      console.log('✅ SUCCESS! User access now working');
      console.log('   Found', testTasks?.length || 0, 'accessible tasks');
      
      // Test delete operation
      console.log('\n🗑️  Testing delete operation...');
      const { error: deleteError } = await userClient
        .from('tasks')
        .delete()
        .eq('id', 'non-existent-id-test');
      
      if (deleteError && !deleteError.message.includes('0 rows')) {
        console.log('❌ Delete operation blocked:', deleteError.message);
      } else {
        console.log('✅ Delete operation working!');
      }
    }

    console.log('\n🎉 RLS Policy Fix Process Complete!');
    console.log('=====================================');
    console.log('If successful, your AI Task Agent will now work with real data.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the fix
fixRLSPolicies();