-- LifeLock Daily Tracking Tables Migration
-- Created: 2025-07-10
-- Purpose: Create database tables for LifeLock daily action tracking system

-- 1. Daily Routines Table (for morning routine tracking)
CREATE TABLE IF NOT EXISTS daily_routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  routine_type VARCHAR(50) NOT NULL DEFAULT 'morning', -- 'morning', 'evening', etc.
  items JSONB NOT NULL DEFAULT '[]', -- Array of routine items with completion status
  completed_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one routine per user per date per type
  UNIQUE(user_id, date, routine_type)
);

-- 2. Daily Workouts Table (for workout tracking with reps/sets)
CREATE TABLE IF NOT EXISTS daily_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]', -- Array of exercises with targets and logged results
  total_exercises INTEGER DEFAULT 0,
  completed_exercises INTEGER DEFAULT 0,
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one workout per user per date
  UNIQUE(user_id, date)
);

-- 3. Daily Health Metrics Table (for health tracking, meals, macros)
CREATE TABLE IF NOT EXISTS daily_health (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  health_checklist JSONB NOT NULL DEFAULT '[]', -- Array of health items (vitamins, water, etc.)
  meals JSONB NOT NULL DEFAULT '{}', -- Breakfast, lunch, dinner, snacks
  macros JSONB NOT NULL DEFAULT '{}', -- Calories, protein, carbs, fats
  water_intake_ml INTEGER DEFAULT 0,
  sleep_hours NUMERIC(3,1) DEFAULT 0,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one health record per user per date
  UNIQUE(user_id, date)
);

-- 4. Daily Habits Table (for screen time, habit tracking)
CREATE TABLE IF NOT EXISTS daily_habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  screen_time_minutes INTEGER DEFAULT 0,
  bullshit_content_minutes INTEGER DEFAULT 0,
  no_weed BOOLEAN DEFAULT FALSE,
  no_scrolling BOOLEAN DEFAULT FALSE,
  deep_work_hours NUMERIC(4,2) DEFAULT 0,
  light_work_hours NUMERIC(4,2) DEFAULT 0,
  habits_data JSONB NOT NULL DEFAULT '{}', -- Flexible habit tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one habits record per user per date
  UNIQUE(user_id, date)
);

-- 5. Daily Reflections Table (for nightly checkout)
CREATE TABLE IF NOT EXISTS daily_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  went_well TEXT[] DEFAULT '{}', -- Array of positive things
  even_better_if TEXT[] DEFAULT '{}', -- Array of improvement areas
  analysis TEXT[] DEFAULT '{}', -- Analysis and insights
  patterns TEXT[] DEFAULT '{}', -- Behavioral patterns identified
  changes TEXT[] DEFAULT '{}', -- Changes to implement
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
  key_learnings TEXT,
  tomorrow_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one reflection per user per date
  UNIQUE(user_id, date)
);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_user_date ON daily_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_health_user_date ON daily_health(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_habits_user_date ON daily_habits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON daily_reflections(user_id, date);

-- 7. Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_routines_updated_at BEFORE UPDATE ON daily_routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_workouts_updated_at BEFORE UPDATE ON daily_workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_health_updated_at BEFORE UPDATE ON daily_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_habits_updated_at BEFORE UPDATE ON daily_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_reflections_updated_at BEFORE UPDATE ON daily_reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Row Level Security (RLS) policies
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access only
CREATE POLICY "Users can access their own daily routines" ON daily_routines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily workouts" ON daily_workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily health" ON daily_health FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily habits" ON daily_habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily reflections" ON daily_reflections FOR ALL USING (auth.uid() = user_id);

-- 9. Create a function to get or create daily records
CREATE OR REPLACE FUNCTION get_or_create_daily_record(
  table_name TEXT,
  target_date DATE DEFAULT CURRENT_DATE,
  default_data JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
  record_id UUID;
  user_uuid UUID;
BEGIN
  -- Get current user
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Try to find existing record
  EXECUTE format('SELECT id FROM %I WHERE user_id = $1 AND date = $2', table_name)
  USING user_uuid, target_date
  INTO record_id;
  
  -- If no record exists, create one
  IF record_id IS NULL THEN
    EXECUTE format('INSERT INTO %I (user_id, date) VALUES ($1, $2) RETURNING id', table_name)
    USING user_uuid, target_date
    INTO record_id;
  END IF;
  
  RETURN record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create helper functions for common operations
CREATE OR REPLACE FUNCTION update_routine_completion(
  target_date DATE DEFAULT CURRENT_DATE,
  routine_type VARCHAR(50) DEFAULT 'morning'
) RETURNS VOID AS $$
DECLARE
  user_uuid UUID;
  completed INTEGER;
  total INTEGER;
  percentage NUMERIC(5,2);
BEGIN
  user_uuid := auth.uid();
  
  -- Calculate completion from JSONB array
  SELECT 
    (SELECT COUNT(*) FROM jsonb_array_elements(items) item WHERE (item->>'completed')::BOOLEAN = TRUE),
    (SELECT COUNT(*) FROM jsonb_array_elements(items))
  FROM daily_routines 
  WHERE user_id = user_uuid AND date = target_date AND routine_type = routine_type
  INTO completed, total;
  
  -- Calculate percentage
  percentage := CASE WHEN total > 0 THEN (completed::NUMERIC / total::NUMERIC) * 100 ELSE 0 END;
  
  -- Update the record
  UPDATE daily_routines 
  SET 
    completed_count = completed,
    total_count = total,
    completion_percentage = percentage,
    updated_at = NOW()
  WHERE user_id = user_uuid AND date = target_date AND routine_type = routine_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;