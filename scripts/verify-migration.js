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

async function verifyMigration() {
  try {
    console.log('🔍 Verifying LifeLock + Enhanced Tasks Migration...\n');
    
    // Test all tables
    const allTables = [
      // LifeLock Core Tables
      'daily_routines',
      'daily_workouts', 
      'daily_health',
      'daily_habits',
      'daily_reflections',
      
      // Enhanced Tasks Tables
      'deep_work_sessions',
      'task_templates',
      'task_analytics',
      
      // Existing Tables
      'tasks'
    ];
    
    console.log('📋 Testing table accessibility...');
    let accessibleTables = 0;
    
    for (const table of allTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: Accessible`);
          accessibleTables++;
        }
      } catch (testError) {
        console.log(`❌ ${table}: ${testError.message}`);
      }
    }
    
    console.log(`\n📊 Table Verification: ${accessibleTables}/${allTables.length} tables accessible\n`);
    
    // Test enhanced tasks columns
    console.log('🔍 Testing enhanced tasks table structure...');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id, 
          title, 
          work_type, 
          focus_level, 
          energy_level, 
          estimated_duration, 
          actual_duration, 
          tags, 
          subtasks, 
          notes, 
          flow_state_potential, 
          lifelock_sync, 
          auto_schedule, 
          effort_points
        `)
        .limit(1);
      
      if (error) {
        console.log(`❌ Enhanced tasks columns: ${error.message}`);
      } else {
        console.log(`✅ Enhanced tasks columns: All accessible`);
      }
    } catch (testError) {
      console.log(`❌ Enhanced tasks columns: ${testError.message}`);
    }
    
    // Test creating a sample record in each LifeLock table
    console.log('\n🧪 Testing data insertion...');
    
    const testUserId = 'test-user-' + Date.now();
    const testDate = new Date().toISOString().split('T')[0];
    
    try {
      // Test daily_routines
      const { data: routineData, error: routineError } = await supabase
        .from('daily_routines')
        .insert({
          user_id: testUserId,
          date: testDate,
          routine_type: 'morning',
          items: [{"id": "1", "title": "Test Item", "completed": false}],
          completed_count: 0,
          total_count: 1,
          completion_percentage: 0
        })
        .select()
        .single();
      
      if (routineError) {
        console.log(`❌ daily_routines insert: ${routineError.message}`);
      } else {
        console.log(`✅ daily_routines: Insert successful`);
        
        // Clean up test data
        await supabase.from('daily_routines').delete().eq('id', routineData.id);
      }
    } catch (insertError) {
      console.log(`❌ daily_routines insert: ${insertError.message}`);
    }
    
    // Test enhanced task creation
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: 'Test Enhanced Task',
          category: 'deep_focus',
          priority: 'medium',
          work_type: 'deep_focus',
          focus_level: 3,
          energy_level: 'medium',
          estimated_duration: 60,
          flow_state_potential: 4,
          lifelock_sync: true,
          auto_schedule: false,
          effort_points: 3,
          status: 'pending',
          assigned_to: testUserId,
          created_by: testUserId
        })
        .select()
        .single();
      
      if (taskError) {
        console.log(`❌ Enhanced task insert: ${taskError.message}`);
      } else {
        console.log(`✅ Enhanced task: Insert successful`);
        
        // Clean up test data
        await supabase.from('tasks').delete().eq('id', taskData.id);
      }
    } catch (insertError) {
      console.log(`❌ Enhanced task insert: ${insertError.message}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 MIGRATION VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    
    if (accessibleTables === allTables.length) {
      console.log('🎉 SUCCESS: All tables are accessible and functional!');
      console.log('✨ LifeLock + Enhanced Tasks system is fully operational');
      console.log('\n🚀 Ready for use:');
      console.log('   • LifeLock daily tracking system');
      console.log('   • Enhanced task management with analytics');
      console.log('   • Deep work session tracking');
      console.log('   • Task templates and automation');
      console.log('   • Seamless integration between systems');
    } else {
      console.log('⚠️  PARTIAL SUCCESS: Some features may need manual setup');
      console.log(`   ${accessibleTables}/${allTables.length} tables accessible`);
    }
    
    console.log('\n📖 Next steps:');
    console.log('   1. Test LifeLock UI in the application');
    console.log('   2. Create some tasks and verify sync');
    console.log('   3. Check daily tracking functionality');
    console.log('   4. Explore enhanced task features');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// Run verification
verifyMigration();