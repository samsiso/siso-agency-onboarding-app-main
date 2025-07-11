-- CLEAN LIFELOCK MIGRATION - No Duplicates
-- Run this after the previous RLS fix to avoid policy conflicts
-- This creates only the missing tables and policies

-- ===================================
-- PART 1: CREATE MISSING TABLES ONLY
-- ===================================

-- Check and create only missing LifeLock tables
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

-- Enhanced task management tables
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
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
);

CREATE TABLE IF NOT EXISTS time_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  block_type VARCHAR(20) DEFAULT 'work' CHECK (block_type IN ('work', 'deep_focus', 'light_focus', 'break', 'meeting', 'personal')),
  title VARCHAR(255),
  description TEXT,
  task_ids UUID[],
  is_flexible BOOLEAN DEFAULT false,
  buffer_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date, start_time)
);

CREATE TABLE IF NOT EXISTS task_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  planned_duration INTEGER,
  actual_duration INTEGER,
  overrun_minutes INTEGER GENERATED ALWAYS AS (GREATEST(0, actual_duration - planned_duration)) STORED,
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
);

-- ===================================
-- PART 2: ADD MISSING TASK COLUMNS
-- ===================================

-- Add enhanced columns to tasks table (will skip if already exist)
DO $$ 
BEGIN
  -- Add new columns one by one with error handling
  BEGIN
    ALTER TABLE tasks ADD COLUMN project_id UUID;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN work_type VARCHAR(20) DEFAULT 'deep_focus' CHECK (work_type IN ('deep_focus', 'light_focus', 'admin', 'creative', 'meeting', 'review'));
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN focus_level INTEGER DEFAULT 3 CHECK (focus_level >= 1 AND focus_level <= 5);
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN energy_level VARCHAR(10) DEFAULT 'medium' CHECK (energy_level IN ('low', 'medium', 'high'));
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN time_block_start TIME;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN time_block_end TIME;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN estimated_duration INTEGER;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN actual_duration INTEGER;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN deep_work_session_id UUID;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN tags TEXT[];
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN subtasks JSONB DEFAULT '[]';
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN notes TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN context_switching_cost INTEGER DEFAULT 0;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN flow_state_potential INTEGER DEFAULT 3 CHECK (flow_state_potential >= 1 AND flow_state_potential <= 5);
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN lifelock_sync BOOLEAN DEFAULT true;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN auto_schedule BOOLEAN DEFAULT false;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN dependencies UUID[];
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN template_id UUID;
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE tasks ADD COLUMN effort_points INTEGER DEFAULT 1 CHECK (effort_points >= 1 AND effort_points <= 13);
  EXCEPTION WHEN duplicate_column THEN NULL;
  END;
END $$;

-- ===================================
-- PART 3: CREATE INDEXES
-- ===================================

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_user_date ON daily_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_health_user_date ON daily_health(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_habits_user_date ON daily_habits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON daily_reflections(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_templates_user_active ON task_templates(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_time_blocks_user_date ON time_blocks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_analytics_user_date ON task_analytics(user_id, date);

-- Enhanced task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_work_type ON tasks(work_type);
CREATE INDEX IF NOT EXISTS idx_tasks_lifelock_sync ON tasks(lifelock_sync) WHERE lifelock_sync = true;

-- ===================================
-- PART 4: CREATE TRIGGERS
-- ===================================

-- Create triggers for new tables (using existing function)
DO $$ 
BEGIN
  -- Create triggers only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_routines_updated_at') THEN
    CREATE TRIGGER update_daily_routines_updated_at BEFORE UPDATE ON daily_routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_workouts_updated_at') THEN
    CREATE TRIGGER update_daily_workouts_updated_at BEFORE UPDATE ON daily_workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_health_updated_at') THEN
    CREATE TRIGGER update_daily_health_updated_at BEFORE UPDATE ON daily_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_habits_updated_at') THEN
    CREATE TRIGGER update_daily_habits_updated_at BEFORE UPDATE ON daily_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_reflections_updated_at') THEN
    CREATE TRIGGER update_daily_reflections_updated_at BEFORE UPDATE ON daily_reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_task_templates_updated_at') THEN
    CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON task_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_time_blocks_updated_at') THEN
    CREATE TRIGGER update_time_blocks_updated_at BEFORE UPDATE ON time_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===================================
-- PART 5: ENABLE RLS AND CREATE POLICIES
-- ===================================

-- Enable RLS on new tables
ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies with duplicate protection
DO $$ 
BEGIN
  -- Daily routines policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own daily routines' AND polrelid = 'daily_routines'::regclass) THEN
    CREATE POLICY "Users can access their own daily routines" ON daily_routines FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Daily workouts policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own daily workouts' AND polrelid = 'daily_workouts'::regclass) THEN
    CREATE POLICY "Users can access their own daily workouts" ON daily_workouts FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Daily health policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own daily health' AND polrelid = 'daily_health'::regclass) THEN
    CREATE POLICY "Users can access their own daily health" ON daily_health FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Daily habits policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own daily habits' AND polrelid = 'daily_habits'::regclass) THEN
    CREATE POLICY "Users can access their own daily habits" ON daily_habits FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Daily reflections policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own daily reflections' AND polrelid = 'daily_reflections'::regclass) THEN
    CREATE POLICY "Users can access their own daily reflections" ON daily_reflections FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Task templates policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own task templates' AND polrelid = 'task_templates'::regclass) THEN
    CREATE POLICY "Users can access their own task templates" ON task_templates FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Time blocks policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own time blocks' AND polrelid = 'time_blocks'::regclass) THEN
    CREATE POLICY "Users can access their own time blocks" ON time_blocks FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Task analytics policy
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can access their own task analytics' AND polrelid = 'task_analytics'::regclass) THEN
    CREATE POLICY "Users can access their own task analytics" ON task_analytics FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ===================================
-- PART 6: UTILITY FUNCTIONS
-- ===================================

-- Function to sync tasks with LifeLock
CREATE OR REPLACE FUNCTION sync_tasks_to_lifelock(
  target_date DATE DEFAULT CURRENT_DATE
) RETURNS BOOLEAN AS $$
DECLARE
  user_uuid UUID;
  deep_focus_tasks JSONB;
  light_focus_tasks JSONB;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get deep focus tasks
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', t.id,
      'title', t.title,
      'description', t.description,
      'priority', t.priority,
      'estimated_duration', t.estimated_duration,
      'work_type', t.work_type,
      'completed', (t.status = 'done')
    )
  )
  INTO deep_focus_tasks
  FROM tasks t
  WHERE t.assigned_to = user_uuid
    AND t.due_date = target_date
    AND t.work_type = 'deep_focus'
    AND t.lifelock_sync = true;
  
  -- Get light focus tasks
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', t.id,
      'title', t.title,
      'description', t.description,
      'priority', t.priority,
      'estimated_duration', t.estimated_duration,
      'work_type', t.work_type,
      'completed', (t.status = 'done')
    )
  )
  INTO light_focus_tasks
  FROM tasks t
  WHERE t.assigned_to = user_uuid
    AND t.due_date = target_date
    AND t.work_type = 'light_focus'
    AND t.lifelock_sync = true;
  
  -- Update daily_habits with task data
  INSERT INTO daily_habits (user_id, date, habits_data)
  VALUES (
    user_uuid,
    target_date,
    jsonb_build_object(
      'deep_focus_tasks', COALESCE(deep_focus_tasks, '[]'::jsonb),
      'light_focus_tasks', COALESCE(light_focus_tasks, '[]'::jsonb),
      'last_sync', NOW()
    )
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    habits_data = daily_habits.habits_data || jsonb_build_object(
      'deep_focus_tasks', COALESCE(deep_focus_tasks, '[]'::jsonb),
      'light_focus_tasks', COALESCE(light_focus_tasks, '[]'::jsonb),
      'last_sync', NOW()
    ),
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'LifeLock migration completed successfully! All tables, policies, and functions are now ready.' as result;