#!/usr/bin/env node

/**
 * Migration script to transfer hardcoded LifeLock data to Supabase
 * This script takes all the previously hardcoded data and properly inserts it into Supabase tables
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Need VITE_SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Complete hardcoded data structures found in the codebase
const HARDCODED_DATA = {
  morningRoutine: [
    { 
      id: '1', 
      title: 'Wake Up', 
      completed: false, 
      description: 'Start the day before midday to maximize productivity.' 
    },
    { 
      id: '2', 
      title: 'Get Blood Flowing (5 min)', 
      completed: false, 
      description: 'Max rep push-ups (Target PB: 30).', 
      logField: 'Log reps: ____' 
    },
    { 
      id: '3', 
      title: 'Hydrate (5 min)', 
      completed: false, 
      description: 'Drink 500 ml water to start the day.' 
    },
    { 
      id: '4', 
      title: 'Supplements & Pre-Workout (5 min)', 
      completed: false, 
      description: 'Take omega-3, multivitamin, ashwagandha, and pre-workout.' 
    },
    { 
      id: '5', 
      title: 'Shower & Brush Teeth (25 min)', 
      completed: false, 
      description: 'Cold shower to wake up.' 
    },
    { 
      id: '6', 
      title: 'Review & Plan Day (15 min)', 
      completed: false, 
      description: 'Go through tasks, prioritize, and allocate time slots.' 
    },
    { 
      id: '7', 
      title: 'Meditation (2 min)', 
      completed: false, 
      description: 'Meditate to set an innovative mindset for creating business value.' 
    }
  ],

  workoutItems: [
    { 
      id: '1', 
      title: 'Push-ups', 
      completed: false, 
      target: '50 reps', 
      logged: '' 
    },
    { 
      id: '2', 
      title: 'Squats', 
      completed: false, 
      target: '100 reps', 
      logged: '' 
    },
    { 
      id: '3', 
      title: 'Plank', 
      completed: false, 
      target: '2 minutes', 
      logged: '' 
    },
    { 
      id: '4', 
      title: 'Burpees', 
      completed: false, 
      target: '20 reps', 
      logged: '' 
    },
    { 
      id: '5', 
      title: 'Mountain Climbers', 
      completed: false, 
      target: '50 reps', 
      logged: '' 
    }
  ],

  healthItems: [
    { 
      id: '1', 
      title: 'Take vitamins/supplements', 
      completed: false 
    },
    { 
      id: '2', 
      title: 'Drink 2L+ water', 
      completed: false 
    },
    { 
      id: '3', 
      title: 'No smoking THC', 
      completed: false 
    },
    { 
      id: '4', 
      title: 'Eat balanced meals', 
      completed: false 
    },
    { 
      id: '5', 
      title: 'Get 7+ hours sleep', 
      completed: false 
    }
  ],

  lightFocusTasks: [
    { id: '1', title: '', completed: false },
    { id: '2', title: '', completed: false },
    { id: '3', title: '', completed: false },
    { id: '4', title: '', completed: false },
    { id: '5', title: '', completed: false }
  ],

  defaultMeals: {
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  },

  defaultMacros: {
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  },

  defaultHabits: {
    screen_time_minutes: 0,
    bullshit_content_minutes: 0,
    no_weed: false,
    no_scrolling: false,
    deep_work_hours: 0,
    light_work_hours: 0,
    habits_data: {
      lightFocusTasks: [
        { id: '1', title: '', completed: false },
        { id: '2', title: '', completed: false },
        { id: '3', title: '', completed: false },
        { id: '4', title: '', completed: false },
        { id: '5', title: '', completed: false }
      ]
    }
  },

  defaultReflections: {
    went_well: ['', '', ''],
    even_better_if: ['', '', '', '', ''],
    analysis: ['', '', ''],
    patterns: ['', '', ''],
    changes: ['', '', '']
  }
};

async function getUserId() {
  // Try to get the first admin user
  const { data: users, error } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin')
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error('❌ No admin users found. Please create an admin user first.');
    process.exit(1);
  }

  return users[0].user_id;
}

async function migrateRoutineData(userId, dateStr) {
  console.log('📋 Migrating morning routine data...');
  
  const routineData = {
    user_id: userId,
    date: dateStr,
    routine_type: 'morning',
    items: HARDCODED_DATA.morningRoutine,
    completed_count: 0,
    total_count: HARDCODED_DATA.morningRoutine.length,
    completion_percentage: 0
  };

  const { error } = await supabase
    .from('daily_routines')
    .upsert(routineData, { 
      onConflict: 'user_id,date,routine_type'
    });

  if (error) {
    console.error('❌ Failed to migrate routine data:', error);
    return false;
  }

  console.log('✅ Morning routine data migrated successfully');
  return true;
}

async function migrateWorkoutData(userId, dateStr) {
  console.log('💪 Migrating workout data...');
  
  const workoutData = {
    user_id: userId,
    date: dateStr,
    exercises: HARDCODED_DATA.workoutItems,
    total_exercises: HARDCODED_DATA.workoutItems.length,
    completed_exercises: 0,
    completion_percentage: 0,
    duration_minutes: 0,
    notes: ''
  };

  const { error } = await supabase
    .from('daily_workouts')
    .upsert(workoutData, { 
      onConflict: 'user_id,date'
    });

  if (error) {
    console.error('❌ Failed to migrate workout data:', error);
    return false;
  }

  console.log('✅ Workout data migrated successfully');
  return true;
}

async function migrateHealthData(userId, dateStr) {
  console.log('🌱 Migrating health data...');
  
  const healthData = {
    user_id: userId,
    date: dateStr,
    health_checklist: HARDCODED_DATA.healthItems,
    meals: HARDCODED_DATA.defaultMeals,
    macros: HARDCODED_DATA.defaultMacros,
    water_intake_ml: 0,
    sleep_hours: 0,
    energy_level: 5,
    mood_level: 5,
    notes: ''
  };

  const { error } = await supabase
    .from('daily_health')
    .upsert(healthData, { 
      onConflict: 'user_id,date'
    });

  if (error) {
    console.error('❌ Failed to migrate health data:', error);
    return false;
  }

  console.log('✅ Health data migrated successfully');
  return true;
}

async function migrateHabitsData(userId, dateStr) {
  console.log('📱 Migrating habits data...');
  
  const habitsData = {
    user_id: userId,
    date: dateStr,
    ...HARDCODED_DATA.defaultHabits
  };

  const { error } = await supabase
    .from('daily_habits')
    .upsert(habitsData, { 
      onConflict: 'user_id,date'
    });

  if (error) {
    console.error('❌ Failed to migrate habits data:', error);
    return false;
  }

  console.log('✅ Habits data migrated successfully');
  return true;
}

async function migrateReflectionsData(userId, dateStr) {
  console.log('🌙 Migrating reflections data...');
  
  const reflectionsData = {
    user_id: userId,
    date: dateStr,
    ...HARDCODED_DATA.defaultReflections,
    overall_rating: 5,
    key_learnings: '',
    tomorrow_focus: ''
  };

  const { error } = await supabase
    .from('daily_reflections')
    .upsert(reflectionsData, { 
      onConflict: 'user_id,date'
    });

  if (error) {
    console.error('❌ Failed to migrate reflections data:', error);
    return false;
  }

  console.log('✅ Reflections data migrated successfully');
  return true;
}

async function verifyMigration(userId, dateStr) {
  console.log('🔍 Verifying migration...');
  
  const tables = [
    'daily_routines',
    'daily_workouts', 
    'daily_health',
    'daily_habits',
    'daily_reflections'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr);

    if (error) {
      console.error(`❌ Failed to verify ${table}:`, error);
      return false;
    }

    if (!data || data.length === 0) {
      console.error(`❌ No data found in ${table} for verification`);
      return false;
    }

    console.log(`✅ ${table}: ${data.length} record(s) verified`);
  }

  return true;
}

async function main() {
  console.log('🚀 Starting LifeLock hardcoded data migration...');
  console.log('📅 Target date: Today');
  
  try {
    // Get user ID (first admin user)
    const userId = await getUserId();
    console.log(`👤 Using user ID: ${userId}`);
    
    // Use today's date
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    console.log(`📅 Migration date: ${dateStr}`);
    
    // Run all migrations
    const results = await Promise.all([
      migrateRoutineData(userId, dateStr),
      migrateWorkoutData(userId, dateStr),
      migrateHealthData(userId, dateStr),
      migrateHabitsData(userId, dateStr),
      migrateReflectionsData(userId, dateStr)
    ]);
    
    const allSuccessful = results.every(result => result === true);
    
    if (allSuccessful) {
      console.log('✅ All data migrations completed successfully!');
      
      // Verify the migration
      const verified = await verifyMigration(userId, dateStr);
      
      if (verified) {
        console.log('🎉 Migration completed and verified successfully!');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   - Morning routine: ${HARDCODED_DATA.morningRoutine.length} items`);
        console.log(`   - Workout exercises: ${HARDCODED_DATA.workoutItems.length} items`);
        console.log(`   - Health checklist: ${HARDCODED_DATA.healthItems.length} items`);
        console.log(`   - Light focus task slots: ${HARDCODED_DATA.lightFocusTasks.length} items`);
        console.log(`   - Default meal tracking structure: ✅`);
        console.log(`   - Default habits tracking: ✅`);
        console.log(`   - Default reflection prompts: ✅`);
        console.log('');
        console.log('🎯 You can now access the LifeLock day page with all the default data!');
      } else {
        console.error('❌ Migration verification failed');
        process.exit(1);
      }
    } else {
      console.error('❌ Some migrations failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main().catch(console.error);