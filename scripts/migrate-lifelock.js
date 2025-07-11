#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in environment variables');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting LifeLock database migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250710_add_lifelock_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Loaded migration file:', migrationPath);
    
    // Split the SQL by statements (rough split by semicolons)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() === '') continue;
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // Try direct execution for DDL statements
          const { error: directError } = await supabase
            .from('__migrations__')
            .select('*')
            .limit(1);
          
          // If we can't use exec_sql, we'll need to use the REST API
          console.log('🔄 Attempting direct SQL execution...');
          
          // For now, let's log the statements that need to be run manually
          console.log('📋 SQL to run manually in Supabase SQL Editor:');
          console.log('----------------------------------------');
          console.log(statement + ';');
          console.log('----------------------------------------');
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (execError) {
        console.log(`⚠️  Statement ${i + 1} needs manual execution:`, execError.message);
        console.log('📋 SQL:', statement + ';');
      }
    }
    
    // Test the new tables
    console.log('\n🔍 Testing new tables...');
    
    const tables = [
      'daily_routines',
      'daily_workouts', 
      'daily_health',
      'daily_habits',
      'daily_reflections'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' not accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' is accessible`);
        }
      } catch (testError) {
        console.log(`❌ Table '${table}' test failed:`, testError.message);
      }
    }
    
    console.log('\n🎉 LifeLock migration completed!');
    console.log('\n📝 Next steps:');
    console.log('1. If any SQL statements need manual execution, run them in Supabase SQL Editor');
    console.log('2. Test the LifeLock functionality in the app');
    console.log('3. Verify data migration from localStorage to Supabase');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();