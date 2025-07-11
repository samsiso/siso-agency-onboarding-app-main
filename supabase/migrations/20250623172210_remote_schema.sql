-- Base schema migration - creates essential tables
-- This is a placeholder for the main schema that exists in your remote database

-- Create basic tasks table structure (simplified version)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(50) DEFAULT 'main',
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic projects table 
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can access their own tasks" ON tasks FOR ALL USING (auth.uid() = assigned_to);
CREATE POLICY "Users can access their own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- Create enums if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category') THEN
    CREATE TYPE task_category AS ENUM ('main', 'weekly', 'daily', 'siso_app_dev', 'onboarding_app', 'instagram');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
END $$;

-- Update tasks table to use proper enums
ALTER TABLE tasks ALTER COLUMN category DROP DEFAULT;
ALTER TABLE tasks ALTER COLUMN category TYPE task_category USING category::task_category;
ALTER TABLE tasks ALTER COLUMN category SET DEFAULT 'main'::task_category;

ALTER TABLE tasks ALTER COLUMN priority DROP DEFAULT;
ALTER TABLE tasks ALTER COLUMN priority TYPE task_priority USING priority::task_priority;
ALTER TABLE tasks ALTER COLUMN priority SET DEFAULT 'medium'::task_priority;