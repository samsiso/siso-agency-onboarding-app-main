-- Add cycle_step and cycle_status columns to auto_prompts table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'cycle_step') THEN
        ALTER TABLE auto_prompts ADD COLUMN cycle_step TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'cycle_status') THEN
        ALTER TABLE auto_prompts ADD COLUMN cycle_status TEXT DEFAULT 'in_progress';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'cycle_number') THEN
        ALTER TABLE auto_prompts ADD COLUMN cycle_number INTEGER DEFAULT 1;
    END IF;
END $$;

-- Create page_cycles table for tracking development cycles
CREATE TABLE IF NOT EXISTS page_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    project_name TEXT NOT NULL,
    page_name TEXT NOT NULL,
    page_route TEXT NOT NULL,
    domain TEXT NOT NULL,
    current_step TEXT NOT NULL,
    cycle_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'in_progress',
    completed_steps TEXT[] DEFAULT '{}',
    metadata JSONB
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS page_cycles_project_idx ON page_cycles (project_name);
CREATE INDEX IF NOT EXISTS page_cycles_page_route_idx ON page_cycles (page_route);
CREATE INDEX IF NOT EXISTS page_cycles_domain_idx ON page_cycles (domain);
CREATE INDEX IF NOT EXISTS page_cycles_status_idx ON page_cycles (status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_cycles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_page_cycles_updated_at_trigger ON page_cycles;
CREATE TRIGGER update_page_cycles_updated_at_trigger
BEFORE UPDATE ON page_cycles
FOR EACH ROW
EXECUTE FUNCTION update_page_cycles_updated_at();

-- Add RLS policies for page_cycles
ALTER TABLE page_cycles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select page_cycles"
ON page_cycles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert page_cycles"
ON page_cycles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update page_cycles"
ON page_cycles FOR UPDATE
TO authenticated
USING (true);

-- Add RLS policies for auto_prompts if they don't already exist
ALTER TABLE auto_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users if they don't already exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'auto_prompts' AND policyname = 'Allow authenticated users to select auto_prompts') THEN
        CREATE POLICY "Allow authenticated users to select auto_prompts"
        ON auto_prompts FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'auto_prompts' AND policyname = 'Allow authenticated users to insert auto_prompts') THEN
        CREATE POLICY "Allow authenticated users to insert auto_prompts"
        ON auto_prompts FOR INSERT
        TO authenticated
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'auto_prompts' AND policyname = 'Allow authenticated users to update auto_prompts') THEN
        CREATE POLICY "Allow authenticated users to update auto_prompts"
        ON auto_prompts FOR UPDATE
        TO authenticated
        USING (true);
    END IF;
END $$; 