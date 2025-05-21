-- Add page_name and prompt_type fields to auto_prompts table
ALTER TABLE IF EXISTS public.auto_prompts
ADD COLUMN IF NOT EXISTS page_name TEXT,
ADD COLUMN IF NOT EXISTS prompt_type TEXT CHECK (prompt_type IN ('analyze', 'plan', 'code', 'review', 'improve', 'other'));

-- Add indices for faster querying on these fields
CREATE INDEX IF NOT EXISTS auto_prompts_page_name_idx ON public.auto_prompts (page_name);
CREATE INDEX IF NOT EXISTS auto_prompts_prompt_type_idx ON public.auto_prompts (prompt_type);

-- Update existing data to set default values (optional)
UPDATE public.auto_prompts SET prompt_type = 'other' WHERE prompt_type IS NULL;

-- Create RPC function to get prompts by page name
CREATE OR REPLACE FUNCTION public.get_prompts_by_page(p_project TEXT, p_page_name TEXT)
RETURNS SETOF public.auto_prompts
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.auto_prompts 
  WHERE project = p_project AND page_name = p_page_name
  ORDER BY prompt_type, created_at ASC;
$$;

-- Create RPC function to get distinct page names for a project
CREATE OR REPLACE FUNCTION public.get_distinct_pages_by_project(p_project TEXT)
RETURNS SETOF text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT page_name FROM public.auto_prompts 
  WHERE project = p_project AND page_name IS NOT NULL
  ORDER BY page_name;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_prompts_by_page(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_distinct_pages_by_project(TEXT) TO authenticated; 