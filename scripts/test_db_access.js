// Test database access and examine RLS policies
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYzODA4MiwiZXhwIjoyMDU5MjE0MDgyfQ.FjMLrYyfPIx7Efw4MzjwY8LdXVj2HcDmFPSQdOiQDRw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
  console.log('🔍 Testing database access...');
  
  try {
    // Test tasks table access
    console.log('\n📊 Testing tasks table...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);
    
    if (tasksError) {
      console.log('❌ Tasks error:', tasksError.message);
    } else {
      console.log('✅ Tasks accessible:', tasks?.length || 0, 'rows');
      if (tasks && tasks.length > 0) {
        console.log('Sample task:', tasks[0]);
      }
    }

    // Test with anon key (what the app uses)
    console.log('\n🔐 Testing with anon key (app access)...');
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    const { data: anonTasks, error: anonError } = await anonClient
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (anonError) {
      console.log('❌ Anon access error:', anonError.message);
      console.log('This is the error your AI Task Agent is experiencing!');
    } else {
      console.log('✅ Anon access working:', anonTasks?.length || 0, 'rows');
    }

    // Test delete operation
    console.log('\n🗑️  Testing delete operation...');
    const { error: deleteError } = await anonClient
      .from('tasks')
      .delete()
      .eq('id', 'test-id-that-does-not-exist');
    
    if (deleteError) {
      console.log('❌ Delete error:', deleteError.message);
    } else {
      console.log('✅ Delete operation accessible');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testDatabase();