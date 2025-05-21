-- Create the auto_prompts table
CREATE TABLE IF NOT EXISTS public.auto_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client TEXT NOT NULL,
  project TEXT NOT NULL,
  domain TEXT NOT NULL,
  module TEXT NOT NULL,
  feature TEXT NOT NULL,
  component TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  priority TEXT NOT NULL DEFAULT 'medium',
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  assigned_to UUID,
  tags TEXT[],
  step INTEGER,
  stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indices for faster queries
CREATE INDEX IF NOT EXISTS auto_prompts_project_idx ON public.auto_prompts (project);
CREATE INDEX IF NOT EXISTS auto_prompts_feature_idx ON public.auto_prompts (feature);
CREATE INDEX IF NOT EXISTS auto_prompts_status_idx ON public.auto_prompts (status);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_auto_prompts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_auto_prompts_updated_at
BEFORE UPDATE ON public.auto_prompts
FOR EACH ROW
EXECUTE FUNCTION update_auto_prompts_updated_at_column();

-- Add RLS policies
ALTER TABLE public.auto_prompts ENABLE ROW LEVEL SECURITY;

-- Everyone with a valid session can read auto_prompts
CREATE POLICY "Users can read auto_prompts" 
  ON public.auto_prompts 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Only admin users can insert, update, and delete auto_prompts
CREATE POLICY "Admin users can insert auto_prompts" 
  ON public.auto_prompts 
  FOR INSERT 
  WITH CHECK ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admin users can update auto_prompts" 
  ON public.auto_prompts 
  FOR UPDATE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admin users can delete auto_prompts" 
  ON public.auto_prompts 
  FOR DELETE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid())); 