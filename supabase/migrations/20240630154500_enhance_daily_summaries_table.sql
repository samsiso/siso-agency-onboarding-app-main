
-- Add new columns to the ai_news_daily_summaries table for enhanced analytics
ALTER TABLE public.ai_news_daily_summaries 
  ADD COLUMN IF NOT EXISTS sentiment TEXT,
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC,
  ADD COLUMN IF NOT EXISTS categorized_key_points JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS key_technologies JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS application_details TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS impact_severity JSONB DEFAULT '{}'::jsonb, 
  ADD COLUMN IF NOT EXISTS impact_trends JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS analysis_depth TEXT DEFAULT 'standard';

-- Update the get_daily_summary function to include new fields
DROP FUNCTION IF EXISTS public.get_daily_summary(date);

CREATE OR REPLACE FUNCTION get_daily_summary(target_date date)
RETURNS SETOF ai_news_daily_summaries AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM ai_news_daily_summaries 
  WHERE date = target_date
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to all users, including unauthenticated ones
GRANT EXECUTE ON FUNCTION get_daily_summary(date) TO PUBLIC;
