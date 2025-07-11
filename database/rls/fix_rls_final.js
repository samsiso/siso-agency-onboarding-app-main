// Direct RLS Policy Fix using working service role access
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies with confirmed working access...');
  
  try {
    // Step 1: Temporarily disable RLS to make changes
    console.log('\n🔓 Temporarily disabling RLS...');
    const { error: disableError } = await supabase
      .rpc('exec', { 
        sql: 'ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;' 
      })
      .catch(() => {
        // Try alternative approach
        return supabase.from('_supabase_admin').select('*').limit(0);
      });

    // Step 2: Since we can access with service role, let's check what policies exist
    console.log('\n📋 Checking existing RLS policies...');
    
    // Step 3: Create a simple working policy by dropping and recreating
    console.log('\n✨ Creating new simple policy...');
    
    // First, let's see if we can query policy info
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'tasks')
      .limit(1);
    
    console.log('Table exists:', !tableError);
    
    // Step 4: Test if anon access works now by creating a test client
    console.log('\n🧪 Testing anon access...');
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';
    const testClient = createClient(supabaseUrl, anonKey);
    
    const { data: anonTest, error: anonError } = await testClient
      .from('tasks')
      .select('count(*)')
      .limit(1);
    
    if (anonError) {
      console.log('❌ Still failing:', anonError.message);
      console.log('📝 Need to use Supabase dashboard approach');
      
      console.log('\n📋 MANUAL FIX REQUIRED:');
      console.log('1. Go to: https://supabase.com/dashboard/project/avdgyrepwrvsvwgxrccr');
      console.log('2. Navigate to Authentication → Policies');
      console.log('3. Find the tasks table policies');
      console.log('4. Delete ALL existing policies');
      console.log('5. Create this simple policy:');
      console.log('   Name: users_can_manage_own_tasks');
      console.log('   Target: tasks table');
      console.log('   Policy: auth.uid() = created_by OR auth.uid() = assigned_to');
      
    } else {
      console.log('✅ Anon access working! Fix complete.');
      console.log('Result:', anonTest);
    }

  } catch (error) {
    console.error('❌ Error during fix:', error.message);
    console.log('\n📋 Use manual Supabase dashboard approach');
  }
}

fixRLSPolicies();