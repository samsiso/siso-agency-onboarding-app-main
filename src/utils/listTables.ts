import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://avdgyrepwrvsvwgxrccr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU";

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  // Query to list all tables in the public schema
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('Available tables in public schema:', JSON.stringify(data, null, 2));
}

listTables();