-- 🚀 COMPLETE TIME TRACKING SYSTEM - IMPLEMENTATION
-- Priority: IMMEDIATE | Value: EXTREMELY HIGH

-- ===================================
-- PART 1: EXTEND EXISTING TASKS TABLE
-- ===================================

-- Add time tracking columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tracked_duration INTEGER DEFAULT 0; -- in minutes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS billable_hours NUMERIC(4,2) DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_billable BOOLEAN DEFAULT true;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(8,2) DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS timer_running BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_timer_start TIMESTAMP WITH TIME ZONE;

-- ===================================
-- PART 2: CREATE TIME ENTRIES TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time tracking
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  -- Billing information
  billable_hours NUMERIC(4,2) DEFAULT 0,
  hourly_rate NUMERIC(8,2) DEFAULT 0,
  total_amount NUMERIC(10,2) GENERATED ALWAYS AS (billable_hours * hourly_rate) STORED,
  is_billable BOOLEAN DEFAULT true,
  
  -- Entry details
  description TEXT,
  activity_type VARCHAR(50) DEFAULT 'work',
  status VARCHAR(20) DEFAULT 'active',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);-- 🚀 COMPLETE TIME TRACKING SYSTEM - IMPLEMENTATION
-- Priority: IMMEDIATE | Value: EXTREMELY HIGH

-- ===================================
-- PART 1: EXTEND EXISTING TASKS TABLE
-- ===================================

-- Add time tracking columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tracked_duration INTEGER DEFAULT 0; -- in minutes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS billable_hours NUMERIC(4,2) DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_billable BOOLEAN DEFAULT true;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(8,2) DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS timer_running BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_timer_start TIMESTAMP WITH TIME ZONE;

-- ===================================
-- PART 2: CREATE TIME ENTRIES TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time tracking
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  -- Billing information
  billable_hours NUMERIC(4,2) DEFAULT 0,
  hourly_rate NUMERIC(8,2) DEFAULT 0,
  total_amount NUMERIC(10,2) GENERATED ALWAYS AS (billable_hours * hourly_rate) STORED,
  is_billable BOOLEAN DEFAULT true,
  
  -- Entry details
  description TEXT,
  activity_type VARCHAR(50) DEFAULT 'work',
  status VARCHAR(20) DEFAULT 'active',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PART 3: CREATE USER RATES TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS user_hourly_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID,
  project_id UUID,
  
  -- Rate information
  hourly_rate NUMERIC(8,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  rate_type VARCHAR(20) DEFAULT 'standard',
  
  -- Date range
  effective_from DATE NOT NULL,
  effective_to DATE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no overlapping rates
  UNIQUE(user_id, client_id, project_id, effective_from)
);-- ===================================
-- PART 4: CREATE INDEXES
-- ===================================

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time);
CREATE INDEX IF NOT EXISTS idx_time_entries_billable ON time_entries(is_billable) WHERE is_billable = true;
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date ON time_entries(user_id, DATE(start_time AT TIME ZONE 'UTC'));

-- User rates indexes
CREATE INDEX IF NOT EXISTS idx_user_rates_user_id ON user_hourly_rates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rates_client_id ON user_hourly_rates(client_id);
CREATE INDEX IF NOT EXISTS idx_user_rates_effective ON user_hourly_rates(effective_from, effective_to);

-- Tasks time tracking indexes
CREATE INDEX IF NOT EXISTS idx_tasks_timer_running ON tasks(timer_running) WHERE timer_running = true;
CREATE INDEX IF NOT EXISTS idx_tasks_billable ON tasks(is_billable) WHERE is_billable = true;

-- ===================================
-- PART 5: CREATE TRIGGERS
-- ===================================

-- Update time entries updated_at trigger
CREATE TRIGGER update_time_entries_updated_at 
  BEFORE UPDATE ON time_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update user rates updated_at trigger
CREATE TRIGGER update_user_hourly_rates_updated_at 
  BEFORE UPDATE ON user_hourly_rates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate duration when end_time is set
CREATE OR REPLACE FUNCTION calculate_time_entry_duration()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate duration in minutes if end_time is set
  IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    
    -- Calculate billable hours (rounded to 2 decimal places)
    IF NEW.is_billable THEN
      NEW.billable_hours := ROUND(NEW.duration_minutes / 60.0, 2);
    ELSE
      NEW.billable_hours := 0;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_time_entry_duration_trigger
  BEFORE INSERT OR UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_time_entry_duration();-- ===================================
-- PART 6: RLS POLICIES
-- ===================================

-- Enable RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hourly_rates ENABLE ROW LEVEL SECURITY;

-- Time entries policies
DO $$ BEGIN
  CREATE POLICY "Users can access their own time entries" ON time_entries
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view time entries for their tasks" ON time_entries
    FOR SELECT USING (
      auth.uid() IN (
        SELECT assigned_to FROM tasks WHERE id = time_entries.task_id
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- User rates policies
DO $$ BEGIN
  CREATE POLICY "Users can access their own hourly rates" ON user_hourly_rates
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ===================================
-- PART 7: UTILITY FUNCTIONS
-- ===================================

-- Function to start a timer for a task
CREATE OR REPLACE FUNCTION start_task_timer(
  task_uuid UUID,
  activity_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
  time_entry_id UUID;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Stop any currently running timers for this user
  UPDATE tasks SET 
    timer_running = false,
    last_timer_start = NULL
  WHERE assigned_to = user_uuid AND timer_running = true;
  
  -- Start new timer
  UPDATE tasks SET 
    timer_running = true,
    last_timer_start = NOW()
  WHERE id = task_uuid AND assigned_to = user_uuid;
  
  -- Create time entry
  INSERT INTO time_entries (task_id, user_id, start_time, description)
  VALUES (task_uuid, user_uuid, NOW(), activity_description)
  RETURNING id INTO time_entry_id;
  
  RETURN time_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;-- Function to stop a timer for a task
CREATE OR REPLACE FUNCTION stop_task_timer(
  task_uuid UUID,
  activity_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  user_uuid UUID;
  start_time_val TIMESTAMP WITH TIME ZONE;
  duration_mins INTEGER;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Get the start time
  SELECT last_timer_start INTO start_time_val
  FROM tasks 
  WHERE id = task_uuid AND assigned_to = user_uuid AND timer_running = true;
  
  IF start_time_val IS NULL THEN
    RETURN FALSE; -- Timer not running
  END IF;
  
  -- Calculate duration
  duration_mins := EXTRACT(EPOCH FROM (NOW() - start_time_val)) / 60;
  
  -- Stop timer
  UPDATE tasks SET 
    timer_running = false,
    last_timer_start = NULL,
    tracked_duration = COALESCE(tracked_duration, 0) + duration_mins
  WHERE id = task_uuid AND assigned_to = user_uuid;
  
  -- Update the most recent time entry
  UPDATE time_entries SET 
    end_time = NOW(),
    description = COALESCE(activity_description, description)
  WHERE task_id = task_uuid 
    AND user_id = user_uuid 
    AND end_time IS NULL
    AND start_time = start_time_val;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- COMPLETION MESSAGE
-- ===================================

SELECT 'Time Tracking System implemented successfully! 🎉' as result,
       'Ready to start tracking time and billing hours.' as next_steps;