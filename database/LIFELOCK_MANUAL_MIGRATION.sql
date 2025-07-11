-- LifeLock Database Migration - Copy and paste this into Supabase SQL Editor
-- This creates all the necessary tables for LifeLock daily tracking

-- 1. Daily Routines Table (for morning routine tracking)
CREATE TABLE IF NOT EXISTS daily_routines (
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
);

-- 2. Daily Workouts Table
CREATE TABLE IF NOT EXISTS daily_workouts (
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
);

-- 3. Daily Health Metrics Table
CREATE TABLE IF NOT EXISTS daily_health (
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
);

-- 4. Daily Habits Table
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
  habits_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- 5. Daily Reflections Table
CREATE TABLE IF NOT EXISTS daily_reflections (
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
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_user_date ON daily_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_health_user_date ON daily_health(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_habits_user_date ON daily_habits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON daily_reflections(user_id, date);

-- 7. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for updated_at
CREATE TRIGGER update_daily_routines_updated_at BEFORE UPDATE ON daily_routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_workouts_updated_at BEFORE UPDATE ON daily_workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_health_updated_at BEFORE UPDATE ON daily_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_habits_updated_at BEFORE UPDATE ON daily_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_reflections_updated_at BEFORE UPDATE ON daily_reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Enable Row Level Security (RLS)
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies
CREATE POLICY "Users can access their own daily routines" ON daily_routines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily workouts" ON daily_workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily health" ON daily_health FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily habits" ON daily_habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own daily reflections" ON daily_reflections FOR ALL USING (auth.uid() = user_id);