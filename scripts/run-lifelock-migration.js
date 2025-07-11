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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runLifeLockMigration() {
  try {
    console.log('🚀 Starting LifeLock Tables Migration...');
    
    // Read the LifeLock migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250710_add_lifelock_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Loaded LifeLock migration file');
    console.log('📝 Migration file size:', migrationSQL.length, 'characters');
    
    // Split into logical chunks for execution
    const chunks = [
      // Chunk 1: Daily Routines Table
      `CREATE TABLE IF NOT EXISTS daily_routines (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        routine_type VARCHAR(50) NOT NULL DEFAULT 'morning',
        items JSONB NOT NULL DEFAULT '[]',
        completed_count INTEGER DEFAULT 0,
        total_count INTEGER DEFAULT 0,
        completion_percentage NUMERIC(5,2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date, routine_type)
      );`,
      
      // Chunk 2: Daily Workouts Table
      `CREATE TABLE IF NOT EXISTS daily_workouts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        exercises JSONB NOT NULL DEFAULT '[]',
        total_exercises INTEGER DEFAULT 0,
        completed_exercises INTEGER DEFAULT 0,
        completion_percentage NUMERIC(5,2) DEFAULT 0,
        duration_minutes INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date)
      );`,
      
      // Chunk 3: Daily Health Table
      `CREATE TABLE IF NOT EXISTS daily_health (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        health_checklist JSONB NOT NULL DEFAULT '[]',
        meals JSONB NOT NULL DEFAULT '{}',
        macros JSONB NOT NULL DEFAULT '{}',
        water_intake_ml INTEGER DEFAULT 0,
        sleep_hours NUMERIC(3,1) DEFAULT 0,
        energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
        mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 10),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date)
      );`,
      
      // Chunk 4: Daily Habits Table
      `CREATE TABLE IF NOT EXISTS daily_habits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        screen_time_minutes INTEGER DEFAULT 0,
        bullshit_content_minutes INTEGER DEFAULT 0,
        no_weed BOOLEAN DEFAULT FALSE,
        no_scrolling BOOLEAN DEFAULT FALSE,
        deep_work_hours NUMERIC(4,2) DEFAULT 0,
        light_work_hours NUMERIC(4,2) DEFAULT 0,
        habits_data JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date)
      );`,
      
      // Chunk 5: Daily Reflections Table
      `CREATE TABLE IF NOT EXISTS daily_reflections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        went_well TEXT[] DEFAULT '{}',
        even_better_if TEXT[] DEFAULT '{}',
        analysis TEXT[] DEFAULT '{}',
        patterns TEXT[] DEFAULT '{}',
        changes TEXT[] DEFAULT '{}',
        overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
        key_learnings TEXT,
        tomorrow_focus TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date)
      );`,
      
      // Chunk 6: Indexes
      `CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date);
       CREATE INDEX IF NOT EXISTS idx_daily_workouts_user_date ON daily_workouts(user_id, date);
       CREATE INDEX IF NOT EXISTS idx_daily_health_user_date ON daily_health(user_id, date);
       CREATE INDEX IF NOT EXISTS idx_daily_habits_user_date ON daily_habits(user_id, date);
       CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON daily_reflections(user_id, date);`,
      
      // Chunk 7: Enable RLS
      `ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
       ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;
       ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
       ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
       ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;`,
      
      // Chunk 8: RLS Policies
      `CREATE POLICY IF NOT EXISTS "Users can access their own daily routines" ON daily_routines FOR ALL USING (auth.uid() = user_id);
       CREATE POLICY IF NOT EXISTS "Users can access their own daily workouts" ON daily_workouts FOR ALL USING (auth.uid() = user_id);
       CREATE POLICY IF NOT EXISTS "Users can access their own daily health" ON daily_health FOR ALL USING (auth.uid() = user_id);
       CREATE POLICY IF NOT EXISTS "Users can access their own daily habits" ON daily_habits FOR ALL USING (auth.uid() = user_id);
       CREATE POLICY IF NOT EXISTS "Users can access their own daily reflections" ON daily_reflections FOR ALL USING (auth.uid() = user_id);`
    ];
    
    // Execute each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      if (!chunk) continue;
      
      console.log(`⚡ Executing chunk ${i + 1}/${chunks.length}...`);
      
      try {
        // For DDL operations, we'll use the SQL execution function
        const { data, error } = await supabase.rpc('exec_sql', { sql: chunk });
        
        if (error) {
          console.log(`⚠️  Chunk ${i + 1} error:`, error.message);
          // Try direct approach for DDL
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey
              },
              body: JSON.stringify({ sql: chunk })
            });
            
            if (response.ok) {
              console.log(`✅ Chunk ${i + 1} executed successfully (direct)`);
            } else {
              console.log(`⚠️  Chunk ${i + 1} needs manual execution`);
            }
          } catch (directError) {
            console.log(`⚠️  Chunk ${i + 1} needs manual execution in Supabase SQL Editor`);
          }
        } else {
          console.log(`✅ Chunk ${i + 1} executed successfully`);
        }
      } catch (execError) {
        console.log(`⚠️  Chunk ${i + 1} needs manual execution:`, execError.message);
      }
    }
    
    // Test table creation
    console.log('\n🔍 Testing table access...');
    
    const tables = [
      'daily_routines',
      'daily_workouts', 
      'daily_health',
      'daily_habits',
      'daily_reflections'
    ];
    
    let successCount = 0;
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Table '${table}' is accessible`);
          successCount++;
        }
      } catch (testError) {
        console.log(`❌ Table '${table}': ${testError.message}`);
      }
    }
    
    console.log(`\n📊 Migration Results: ${successCount}/${tables.length} tables accessible`);
    
    if (successCount === tables.length) {
      console.log('🎉 LifeLock Migration completed successfully!');
      console.log('🔗 All LifeLock tables are ready for use');
    } else {
      console.log('⚠️  Some tables may need manual creation');
      console.log('📋 Please run the migration file in Supabase SQL Editor:');
      console.log('   File:', migrationPath);
    }
    
  } catch (error) {
    console.error('❌ LifeLock Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runLifeLockMigration();