-- Create prompt_stretches table
CREATE TABLE IF NOT EXISTS public.prompt_stretches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  project TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sequence INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  
  -- Add constraints
  CONSTRAINT valid_page_number CHECK (page_number BETWEEN 1 AND 25),
  CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Add index on project and page_number for faster queries
CREATE INDEX IF NOT EXISTS prompt_stretches_project_page_idx ON public.prompt_stretches (project, page_number);

-- Add updated_at trigger
CREATE TRIGGER set_prompt_stretches_updated_at
BEFORE UPDATE ON public.prompt_stretches
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Add stretch_id and iteration columns to auto_prompts
ALTER TABLE IF EXISTS public.auto_prompts 
ADD COLUMN IF NOT EXISTS stretch_id UUID REFERENCES public.prompt_stretches(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS iteration INTEGER DEFAULT 1;

-- Create RPC function to get stretches by page and project
CREATE OR REPLACE FUNCTION public.get_prompt_stretches_by_page(p_project TEXT, p_page_number INTEGER)
RETURNS SETOF public.prompt_stretches
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.prompt_stretches 
  WHERE project = p_project AND page_number = p_page_number
  ORDER BY sequence ASC;
$$;

-- Create RPC function to get prompts by stretch
CREATE OR REPLACE FUNCTION public.get_prompts_by_stretch(p_stretch_id UUID)
RETURNS SETOF public.auto_prompts
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.auto_prompts 
  WHERE stretch_id = p_stretch_id
  ORDER BY iteration ASC, created_at ASC;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_prompt_stretches_by_page(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prompts_by_stretch(UUID) TO authenticated;

-- Row-level security policies
ALTER TABLE public.prompt_stretches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view stretches"
  ON public.prompt_stretches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert stretches"
  ON public.prompt_stretches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update stretches"
  ON public.prompt_stretches FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete stretches"
  ON public.prompt_stretches FOR DELETE
  TO authenticated
  USING (true); 