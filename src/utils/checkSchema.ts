import { supabase } from '../lib/supabase';

async function checkSchema() {
  try {
    // Get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return;
    }

    console.log('Available tables:', tables);

    // For each table, get its structure
    for (const table of tables || []) {
      const { data: columns, error: columnsError } = await supabase
        .rpc('debug_table_structure', { table_name: table.tablename });

      if (columnsError) {
        console.error(`Error fetching columns for ${table.tablename}:`, columnsError);
        continue;
      }

      console.log(`\nStructure for table ${table.tablename}:`, columns);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();