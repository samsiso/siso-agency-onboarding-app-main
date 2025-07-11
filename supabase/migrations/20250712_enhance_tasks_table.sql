-- Enhanced Tasks Table Migration for LifeLock Integration
-- Created: 2025-07-10
-- Purpose: Enhance tasks table to support LifeLock, projects, work types, and scheduling

-- 1. Add new columns to existing tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS work_type VARCHAR(20) DEFAULT 'deep_focus' CHECK (work_type IN ('deep_focus', 'light_focus', 'admin', 'creative', 'meeting', 'review'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS focus_level INTEGER DEFAULT 3 CHECK (focus_level >= 1 AND focus_level <= 5);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS energy_level VARCHAR(10) DEFAULT 'medium' CHECK (energy_level IN ('low', 'medium', 'high'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_block_start TIME;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_block_end TIME;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_duration INTEGER; -- in minutes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS actual_duration INTEGER; -- in minutes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deep_work_session_id UUID;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS context_switching_cost INTEGER DEFAULT 0; -- in minutes
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS flow_state_potential INTEGER DEFAULT 3 CHECK (flow_state_potential >= 1 AND flow_state_potential <= 5);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lifelock_sync BOOLEAN DEFAULT true;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS auto_schedule BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS dependencies UUID[]; -- array of task IDs
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS effort_points INTEGER DEFAULT 1 CHECK (effort_points >= 1 AND effort_points <= 13); -- Fibonacci for story points

-- 2. Extend existing enums for better categorization
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'deep_focus';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'light_focus';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'personal_dev';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'client_work';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'business_dev';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'admin_tasks';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'learning';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'health_fitness';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'creative';
ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'research';

-- 3. Add new priority levels
ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'critical';

-- 4. Create Deep Work Sessions table (for tracking focused work periods)
CREATE TABLE IF NOT EXISTS deep_work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  planned_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  focus_quality INTEGER CHECK (focus_quality >= 1 AND focus_quality <= 10),
  distractions_count INTEGER DEFAULT 0,
  environment_rating INTEGER CHECK (environment_rating >= 1 AND environment_rating <= 10),
  energy_start INTEGER CHECK (energy_start >= 1 AND energy_start <= 10),
  energy_end INTEGER CHECK (energy_end >= 1 AND energy_end <= 10),
  session_notes TEXT,
  technique_used VARCHAR(50), -- pomodoro, timeboxing, etc.
  tasks_completed UUID[],
  session_type VARCHAR(20) DEFAULT 'deep_focus' CHECK (session_type IN ('deep_focus', 'light_focus', 'creative', 'learning')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Task Templates table (for recurring task patterns)
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category task_category NOT NULL,
  priority task_priority DEFAULT 'medium',
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

-- 6. Create Project-Task relationship enhancements
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completion_percentage NUMERIC(5,2) DEFAULT 0,
  priority task_priority DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Time Blocks table (for calendar integration)
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
  buffer_time INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date, start_time)
);

-- 8. Create Task Analytics table (for performance tracking)
CREATE TABLE IF NOT EXISTS task_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Time tracking
  planned_duration INTEGER,
  actual_duration INTEGER,
  overrun_minutes INTEGER GENERATED ALWAYS AS (GREATEST(0, actual_duration - planned_duration)) STORED,
  
  -- Performance metrics
  focus_quality INTEGER CHECK (focus_quality >= 1 AND focus_quality <= 10),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  
  -- Context
  energy_level_start INTEGER CHECK (energy_level_start >= 1 AND energy_level_start <= 10),
  energy_level_end INTEGER CHECK (energy_level_end >= 1 AND energy_level_end <= 10),
  distractions_count INTEGER DEFAULT 0,
  context_switches INTEGER DEFAULT 0,
  
  -- Environment
  work_environment VARCHAR(50), -- home_office, coffee_shop, library, etc.
  noise_level INTEGER CHECK (noise_level >= 1 AND noise_level <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_work_type ON tasks(work_type);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date_priority ON tasks(due_date, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_category ON tasks(assigned_to, category);
CREATE INDEX IF NOT EXISTS idx_tasks_lifelock_sync ON tasks(lifelock_sync) WHERE lifelock_sync = true;
CREATE INDEX IF NOT EXISTS idx_deep_work_sessions_user_date ON deep_work_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_time_blocks_user_date ON time_blocks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_analytics_user_date ON task_analytics(user_id, date);

-- 10. Create triggers for updated_at columns (with conditional creation)
DO $$ BEGIN
  CREATE TRIGGER update_deep_work_sessions_updated_at BEFORE UPDATE ON deep_work_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON task_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_time_blocks_updated_at BEFORE UPDATE ON time_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 11. Enable RLS on new tables
ALTER TABLE deep_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_analytics ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS policies (with conditional creation)
DO $$ BEGIN
  CREATE POLICY "Users can access their own deep work sessions" ON deep_work_sessions FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can access their own task templates" ON task_templates FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can access project milestones they own" ON project_milestones FOR ALL USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can access their own time blocks" ON time_blocks FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can access their own task analytics" ON task_analytics FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 13. Create utility functions for task management

-- Function to auto-schedule tasks based on priority and duration
CREATE OR REPLACE FUNCTION auto_schedule_tasks(
  target_date DATE DEFAULT CURRENT_DATE,
  start_hour INTEGER DEFAULT 9,
  end_hour INTEGER DEFAULT 17
) RETURNS TABLE(task_id UUID, suggested_start_time TIME, suggested_end_time TIME) AS $$
DECLARE
  current_schedule_time TIME;
  task_record RECORD;
BEGIN
  current_schedule_time := (start_hour || ':00:00')::TIME;
  
  FOR task_record IN 
    SELECT t.id, t.estimated_duration, t.priority, t.work_type
    FROM tasks t
    WHERE t.due_date = target_date 
      AND t.status = 'pending'
      AND t.auto_schedule = true
      AND t.assigned_to = auth.uid()
    ORDER BY 
      CASE t.priority 
        WHEN 'critical' THEN 5
        WHEN 'urgent' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
      END DESC,
      t.focus_level DESC
  LOOP
    -- Check if we have enough time left in the day
    IF current_schedule_time + (task_record.estimated_duration || ' minutes')::INTERVAL <= (end_hour || ':00:00')::TIME THEN
      task_id := task_record.id;
      suggested_start_time := current_schedule_time;
      suggested_end_time := current_schedule_time + (task_record.estimated_duration || ' minutes')::INTERVAL;
      
      -- Add buffer time between tasks
      current_schedule_time := suggested_end_time + '15 minutes'::INTERVAL;
      
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate task completion statistics
CREATE OR REPLACE FUNCTION get_task_stats(
  user_uuid UUID DEFAULT auth.uid(),
  date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  date_to DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
  total_tasks INTEGER,
  completed_tasks INTEGER,
  completion_rate NUMERIC,
  avg_focus_quality NUMERIC,
  total_deep_work_hours NUMERIC,
  avg_task_duration NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_tasks,
    COUNT(*) FILTER (WHERE status = 'done')::INTEGER as completed_tasks,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'done')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 
      2
    ) as completion_rate,
    ROUND(AVG(ta.focus_quality), 2) as avg_focus_quality,
    ROUND(
      SUM(ta.actual_duration) FILTER (WHERE t.work_type = 'deep_focus') / 60.0, 
      2
    ) as total_deep_work_hours,
    ROUND(AVG(ta.actual_duration), 2) as avg_task_duration
  FROM tasks t
  LEFT JOIN task_analytics ta ON t.id = ta.task_id
  WHERE t.assigned_to = user_uuid
    AND t.due_date BETWEEN date_from AND date_to;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync tasks with LifeLock daily routines
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
  
  -- Get deep focus tasks for the day
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
  
  -- Get light focus tasks for the day
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