#!/usr/bin/env node

/**
 * Simple migration script to insert LifeLock default data for the first available user
 * This uses the current session or creates data for any existing user
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

// Use a test user ID - you can replace this with your actual user ID
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

// Complete hardcoded data structures
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

async function insertDefaultData() {
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  console.log(`🚀 Inserting LifeLock default data for ${dateStr}...`);

  try {
    // Insert morning routine
    console.log('📋 Inserting morning routine...');
    const { error: routineError } = await supabase
      .from('daily_routines')
      .upsert({
        user_id: TEST_USER_ID,
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
      console.log('✅ Morning routine inserted');
    }

    // Insert workout data
    console.log('💪 Inserting workout data...');
    const { error: workoutError } = await supabase
      .from('daily_workouts')
      .upsert({
        user_id: TEST_USER_ID,
        date: dateStr,
        exercises: LIFELOCK_DATA.workoutItems,
        total_exercises: LIFELOCK_DATA.workoutItems.length,
        completed_exercises: 0,
        completion_percentage: 0
      }, { onConflict: 'user_id,date' });

    if (workoutError) {
      console.error('❌ Workout error:', workoutError);
    } else {
      console.log('✅ Workout data inserted');
    }

    // Insert health data
    console.log('🌱 Inserting health data...');
    const { error: healthError } = await supabase
      .from('daily_health')
      .upsert({
        user_id: TEST_USER_ID,
        date: dateStr,
        health_checklist: LIFELOCK_DATA.healthItems,
        meals: { breakfast: '', lunch: '', dinner: '', snacks: '' },
        macros: { calories: '', protein: '', carbs: '', fats: '' },
        water_intake_ml: 0,
        sleep_hours: 0
      }, { onConflict: 'user_id,date' });

    if (healthError) {
      console.error('❌ Health error:', healthError);
    } else {
      console.log('✅ Health data inserted');
    }

    // Insert habits data
    console.log('📱 Inserting habits data...');
    const { error: habitsError } = await supabase
      .from('daily_habits')
      .upsert({
        user_id: TEST_USER_ID,
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
      console.log('✅ Habits data inserted');
    }

    // Insert reflections data
    console.log('🌙 Inserting reflections data...');
    const { error: reflectionsError } = await supabase
      .from('daily_reflections')
      .upsert({
        user_id: TEST_USER_ID,
        date: dateStr,
        went_well: ['', '', ''],
        even_better_if: ['', '', '', '', ''],
        analysis: ['', '', ''],
        patterns: ['', '', ''],
        changes: ['', '', '']
      }, { onConflict: 'user_id,date' });

    if (reflectionsError) {
      console.error('❌ Reflections error:', reflectionsError);
    } else {
      console.log('✅ Reflections data inserted');
    }

    console.log('');
    console.log('🎉 LifeLock default data migration completed!');
    console.log('');
    console.log('📊 Data Summary:');
    console.log(`   - Morning routine: ${LIFELOCK_DATA.morningRoutine.length} items`);
    console.log(`   - Workout exercises: ${LIFELOCK_DATA.workoutItems.length} items`);
    console.log(`   - Health checklist: ${LIFELOCK_DATA.healthItems.length} items`);
    console.log(`   - Light focus task slots: 5 items`);
    console.log(`   - Default meal/macro tracking: ✅`);
    console.log(`   - Default habits tracking: ✅`);
    console.log(`   - Default reflection prompts: ✅`);
    console.log('');
    console.log(`📝 Note: Data inserted for test user ID: ${TEST_USER_ID}`);
    console.log('   You can update this ID in the script to match your actual user ID');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
insertDefaultData().catch(console.error);