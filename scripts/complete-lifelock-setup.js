#!/usr/bin/env node

/**
 * Complete LifeLock setup - creates user, sets admin, and migrates all data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test user credentials
const TEST_USER_EMAIL = 'admin@siso.agency';
const TEST_USER_PASSWORD = 'SisoAdmin2025!';

// Complete LifeLock data
const LIFELOCK_DATA = {
  morningRoutine: [
    { id: '1', title: 'Wake Up', completed: false, description: 'Start the day before midday to maximize productivity.' },
    { id: '2', title: 'Get Blood Flowing (5 min)', completed: false, description: 'Max rep push-ups (Target PB: 30).', logField: 'Log reps: ____' },
    { id: '3', title: 'Hydrate (5 min)', completed: false, description: 'Drink 500 ml water to start the day.' },
    { id: '4', title: 'Supplements & Pre-Workout (5 min)', completed: false, description: 'Take omega-3, multivitamin, ashwagandha, and pre-workout.' },
    { id: '5', title: 'Shower & Brush Teeth (25 min)', completed: false, description: 'Cold shower to wake up.' },
    { id: '6', title: 'Review & Plan Day (15 min)', completed: false, description: 'Go through tasks, prioritize, and allocate time slots.' },
    { id: '7', title: 'Meditation (2 min)', completed: false, description: 'Meditate to set an innovative mindset for creating business value.' }
  ],

  workoutItems: [
    { id: '1', title: 'Push-ups', completed: false, target: '50 reps', logged: '' },
    { id: '2', title: 'Squats', completed: false, target: '100 reps', logged: '' },
    { id: '3', title: 'Plank', completed: false, target: '2 minutes', logged: '' },
    { id: '4', title: 'Burpees', completed: false, target: '20 reps', logged: '' },
    { id: '5', title: 'Mountain Climbers', completed: false, target: '50 reps', logged: '' }
  ],

  healthItems: [
    { id: '1', title: 'Take vitamins/supplements', completed: false },
    { id: '2', title: 'Drink 2L+ water', completed: false },
    { id: '3', title: 'No smoking THC', completed: false },
    { id: '4', title: 'Eat balanced meals', completed: false },
    { id: '5', title: 'Get 7+ hours sleep', completed: false }
  ]
};

async function createTestUser() {
  console.log('👤 Creating test user account...');
  
  const { data, error } = await supabase.auth.signUp({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    options: {
      data: {
        role: 'admin'
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✅ User already exists, signing in...');
      return await signInUser();
    }
    console.error('❌ Failed to create user:', error);
    return null;
  }

  if (data.user) {
    console.log('✅ User created successfully:', data.user.id);
    return data.user;
  }

  return null;
}

async function signInUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD
  });

  if (error) {
    console.error('❌ Failed to sign in:', error);
    return null;
  }

  console.log('✅ Signed in successfully:', data.user.id);
  return data.user;
}

async function setupAdminRole(userId) {
  console.log('🔧 Setting up admin role...');
  
  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role: 'admin',
      onboarding_completed: true
    });

  if (profileError && !profileError.message.includes('duplicate')) {
    console.error('❌ Profile error:', profileError);
  } else {
    console.log('✅ Profile created/updated');
  }

  // Create admin role
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role: 'admin'
    });

  if (roleError && !roleError.message.includes('duplicate')) {
    console.error('❌ Role error:', roleError);
  } else {
    console.log('✅ Admin role assigned');
  }
}

async function migrateLifeLockData(userId) {
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  console.log(`📊 Migrating LifeLock data for ${dateStr}...`);

  // Morning routine
  console.log('📋 Inserting morning routine...');
  const { error: routineError } = await supabase
    .from('daily_routines')
    .upsert({
      user_id: userId,
      date: dateStr,
      routine_type: 'morning',
      items: LIFELOCK_DATA.morningRoutine,
      completed_count: 0,
      total_count: LIFELOCK_DATA.morningRoutine.length,
      completion_percentage: 0
    }, { onConflict: 'user_id,date,routine_type' });

  if (routineError) {
    console.error('❌ Morning routine error:', routineError);
  } else {
    console.log('✅ Morning routine migrated');
  }

  // Workout data
  console.log('💪 Inserting workout data...');
  const { error: workoutError } = await supabase
    .from('daily_workouts')
    .upsert({
      user_id: userId,
      date: dateStr,
      exercises: LIFELOCK_DATA.workoutItems,
      total_exercises: LIFELOCK_DATA.workoutItems.length,
      completed_exercises: 0,
      completion_percentage: 0,
      duration_minutes: 0,
      notes: ''
    }, { onConflict: 'user_id,date' });

  if (workoutError) {
    console.error('❌ Workout error:', workoutError);
  } else {
    console.log('✅ Workout data migrated');
  }

  // Health data
  console.log('🌱 Inserting health data...');
  const { error: healthError } = await supabase
    .from('daily_health')
    .upsert({
      user_id: userId,
      date: dateStr,
      health_checklist: LIFELOCK_DATA.healthItems,
      meals: { breakfast: '', lunch: '', dinner: '', snacks: '' },
      macros: { calories: '', protein: '', carbs: '', fats: '' },
      water_intake_ml: 0,
      sleep_hours: 0,
      energy_level: 5,
      mood_level: 5,
      notes: ''
    }, { onConflict: 'user_id,date' });

  if (healthError) {
    console.error('❌ Health error:', healthError);
  } else {
    console.log('✅ Health data migrated');
  }

  // Habits data
  console.log('📱 Inserting habits data...');
  const { error: habitsError } = await supabase
    .from('daily_habits')
    .upsert({
      user_id: userId,
      date: dateStr,
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
    }, { onConflict: 'user_id,date' });

  if (habitsError) {
    console.error('❌ Habits error:', habitsError);
  } else {
    console.log('✅ Habits data migrated');
  }

  // Reflections data
  console.log('🌙 Inserting reflections data...');
  const { error: reflectionsError } = await supabase
    .from('daily_reflections')
    .upsert({
      user_id: userId,
      date: dateStr,
      went_well: ['', '', ''],
      even_better_if: ['', '', '', '', ''],
      analysis: ['', '', ''],
      patterns: ['', '', ''],
      changes: ['', '', ''],
      overall_rating: 5,
      key_learnings: '',
      tomorrow_focus: ''
    }, { onConflict: 'user_id,date' });

  if (reflectionsError) {
    console.error('❌ Reflections error:', reflectionsError);
  } else {
    console.log('✅ Reflections data migrated');
  }
}

async function verifyMigration(userId) {
  console.log('🔍 Verifying migration...');
  
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const tables = [
    'daily_routines',
    'daily_workouts', 
    'daily_health',
    'daily_habits',
    'daily_reflections'
  ];

  let allVerified = true;

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr);

    if (error) {
      console.error(`❌ ${table} verification failed:`, error);
      allVerified = false;
    } else if (!data || data.length === 0) {
      console.error(`❌ No data found in ${table}`);
      allVerified = false;
    } else {
      console.log(`✅ ${table}: ${data.length} record(s) verified`);
    }
  }

  return allVerified;
}

async function main() {
  console.log('🚀 Starting complete LifeLock setup...');
  console.log('');

  try {
    // Step 1: Create/sign in user
    const user = await createTestUser();
    if (!user) {
      console.error('❌ Failed to create/sign in user');
      process.exit(1);
    }

    // Step 2: Setup admin role
    await setupAdminRole(user.id);

    // Step 3: Migrate LifeLock data
    await migrateLifeLockData(user.id);

    // Step 4: Verify everything worked
    const verified = await verifyMigration(user.id);

    console.log('');
    if (verified) {
      console.log('🎉 Complete LifeLock setup successful!');
      console.log('');
      console.log('📊 Migration Summary:');
      console.log(`   👤 User: ${TEST_USER_EMAIL}`);
      console.log(`   🔐 Password: ${TEST_USER_PASSWORD}`);
      console.log(`   📋 Morning routine: ${LIFELOCK_DATA.morningRoutine.length} items`);
      console.log(`   💪 Workout exercises: ${LIFELOCK_DATA.workoutItems.length} items`);
      console.log(`   🌱 Health checklist: ${LIFELOCK_DATA.healthItems.length} items`);
      console.log(`   📱 Light focus tasks: 5 slots`);
      console.log(`   🌙 Reflection prompts: ✅`);
      console.log('');
      console.log('🎯 You can now:');
      console.log('   1. Sign in with the credentials above');
      console.log('   2. Access /admin/life-lock/day');
      console.log('   3. See all your hardcoded data working!');
    } else {
      console.error('❌ Setup completed but verification failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);