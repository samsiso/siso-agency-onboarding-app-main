-- Create an RPC function to get distinct projects
CREATE OR REPLACE FUNCTION public.get_distinct_projects()
RETURNS SETOF text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT project FROM public.auto_prompts ORDER BY project;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_distinct_projects() TO authenticated; 