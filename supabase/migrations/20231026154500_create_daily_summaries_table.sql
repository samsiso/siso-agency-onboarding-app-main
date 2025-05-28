
-- Create table for storing daily AI news summaries
CREATE TABLE IF NOT EXISTS public.ai_news_daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT[] DEFAULT '{}',
  practical_applications TEXT[] DEFAULT '{}',
  industry_impacts JSONB DEFAULT '{}'::jsonb,
  article_count INTEGER DEFAULT 0,
  generated_with TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint to ensure one summary per date
ALTER TABLE public.ai_news_daily_summaries
  ADD CONSTRAINT unique_date_summary UNIQUE (date);

-- Add function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_daily_summaries_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_daily_summaries_updated_at
BEFORE UPDATE ON public.ai_news_daily_summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_daily_summaries_column();

-- Create table for scheduled news tasks
CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies to allow reading daily summaries
ALTER TABLE public.ai_news_daily_summaries ENABLE ROW LEVEL SECURITY;

-- Everyone can read the daily summaries
CREATE POLICY "Public can read daily summaries" 
  ON public.ai_news_daily_summaries 
  FOR SELECT 
  USING (true);

-- Only authenticated users with admin role can insert/update daily summaries
CREATE POLICY "Only admins can create daily summaries" 
  ON public.ai_news_daily_summaries 
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update daily summaries" 
  ON public.ai_news_daily_summaries 
  FOR UPDATE 
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
