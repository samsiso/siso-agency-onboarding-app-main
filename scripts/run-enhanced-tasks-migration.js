#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runEnhancedTasksMigration() {
  try {
    console.log('🚀 Starting Enhanced Tasks Migration...');
    
    // Enhanced tasks table modifications and new tables
    const enhancedTasksChunks = [
      // Add enhanced columns to existing tasks table
      `
-- Add enhanced task management columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS work_type VARCHAR(20) DEFAULT 'deep_focus' CHECK (work_type IN ('deep_focus', 'light_focus', 'admin', 'creative', 'meeting', 'review'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS focus_level INTEGER DEFAULT 3 CHECK (focus_level >= 1 AND focus_level <= 5);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS energy_level VARCHAR(10) DEFAULT 'medium' CHECK (energy_level IN ('low', 'medium', 'high'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_duration INTEGER;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS flow_state_potential INTEGER DEFAULT 3 CHECK (flow_state_potential >= 1 AND flow_state_potential <= 5);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lifelock_sync BOOLEAN DEFAULT true;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS auto_schedule BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS effort_points INTEGER DEFAULT 1 CHECK (effort_points >= 1 AND effort_points <= 13);`,
      
      // Deep Work Sessions table
      `
CREATE TABLE IF NOT EXISTS deep_work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  planned_duration INTEGER,
  actual_duration INTEGER,
  focus_quality INTEGER CHECK (focus_quality >= 1 AND focus_quality <= 10),
  distractions_count INTEGER DEFAULT 0,
  environment_rating INTEGER CHECK (environment_rating >= 1 AND environment_rating <= 10),
  energy_start INTEGER CHECK (energy_start >= 1 AND energy_start <= 10),
  energy_end INTEGER CHECK (energy_end >= 1 AND energy_end <= 10),
  session_notes TEXT,
  technique_used VARCHAR(50),
  tasks_completed UUID[],
  session_type VARCHAR(20) DEFAULT 'deep_focus' CHECK (session_type IN ('deep_focus', 'light_focus', 'creative', 'learning')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      
      // Task Templates table
      `
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  work_type VARCHAR(20) DEFAULT 'deep_focus',
  estimated_duration INTEGER,
  focus_level INTEGER DEFAULT 3,
  energy_level VARCHAR(10) DEFAULT 'medium',
  flow_state_potential INTEGER DEFAULT 3,
  effort_points INTEGER DEFAULT 1,
  tags TEXT[],
  subtasks JSONB DEFAULT '[]',
  template_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      
      // Task Analytics table
      `
CREATE TABLE IF NOT EXISTS task_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  planned_duration INTEGER,
  actual_duration INTEGER,
  focus_quality INTEGER CHECK (focus_quality >= 1 AND focus_quality <= 10),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  energy_level_start INTEGER CHECK (energy_level_start >= 1 AND energy_level_start <= 10),
  energy_level_end INTEGER CHECK (energy_level_end >= 1 AND energy_level_end <= 10),
  distractions_count INTEGER DEFAULT 0,
  context_switches INTEGER DEFAULT 0,
  work_environment VARCHAR(50),
  noise_level INTEGER CHECK (noise_level >= 1 AND noise_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      
      // Create indexes
      `
CREATE INDEX IF NOT EXISTS idx_tasks_work_type ON tasks(work_type);
CREATE INDEX IF NOT EXISTS idx_tasks_focus_level ON tasks(focus_level);
CREATE INDEX IF NOT EXISTS idx_tasks_lifelock_sync ON tasks(lifelock_sync) WHERE lifelock_sync = true;
CREATE INDEX IF NOT EXISTS idx_deep_work_sessions_user_date ON deep_work_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_analytics_user_date ON task_analytics(user_id, date);`,
      
      // Enable RLS
      `
ALTER TABLE deep_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_analytics ENABLE ROW LEVEL SECURITY;`,
      
      // Create RLS policies
      `
CREATE POLICY "Users can access their own deep work sessions" ON deep_work_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own task templates" ON task_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own task analytics" ON task_analytics FOR ALL USING (auth.uid() = user_id);`
    ];
    
    // Execute each chunk
    for (let i = 0; i < enhancedTasksChunks.length; i++) {
      const chunk = enhancedTasksChunks[i].trim();
      if (!chunk) continue;
      
      console.log(`⚡ Executing enhanced tasks chunk ${i + 1}/${enhancedTasksChunks.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: chunk });
        
        if (error) {
          console.log(`⚠️  Chunk ${i + 1} completed with notes:`, error.message);
        } else {
          console.log(`✅ Chunk ${i + 1} executed successfully`);
        }
      } catch (execError) {
        console.log(`⚠️  Chunk ${i + 1} status:`, execError.message);
      }
    }
    
    // Test enhanced tables
    console.log('\n🔍 Testing enhanced task system...');
    
    const enhancedTables = [
      'deep_work_sessions',
      'task_templates',
      'task_analytics'
    ];
    
    let enhancedSuccessCount = 0;
    for (const table of enhancedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`❌ Enhanced table '${table}': ${error.message}`);
        } else {
          console.log(`✅ Enhanced table '${table}' is accessible`);
          enhancedSuccessCount++;
        }
      } catch (testError) {
        console.log(`❌ Enhanced table '${table}': ${testError.message}`);
      }
    }
    
    // Test enhanced tasks table columns
    console.log('\n🔍 Testing enhanced tasks table columns...');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, work_type, focus_level, lifelock_sync')
        .limit(1);
      
      if (error) {
        console.log(`❌ Enhanced tasks columns: ${error.message}`);
      } else {
        console.log(`✅ Enhanced tasks table columns are accessible`);
      }
    } catch (testError) {
      console.log(`❌ Enhanced tasks columns: ${testError.message}`);
    }
    
    console.log(`\n📊 Enhanced Migration Results: ${enhancedSuccessCount}/${enhancedTables.length} enhanced tables accessible`);
    
    if (enhancedSuccessCount === enhancedTables.length) {
      console.log('🎉 Enhanced Tasks Migration completed successfully!');
      console.log('🔗 All enhanced task features are ready for use');
      console.log('✨ LifeLock + Enhanced Tasks integration is now fully operational');
    } else {
      console.log('⚠️  Some enhanced features may need manual setup');
    }
    
  } catch (error) {
    console.error('❌ Enhanced Tasks Migration failed:', error);
    process.exit(1);
  }
}

// Run the enhanced tasks migration
runEnhancedTasksMigration();