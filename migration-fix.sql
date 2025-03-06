
-- First, check if the policy already exists to avoid duplicates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_news_daily_summaries' 
        AND policyname = 'Service function can manage daily summaries'
    ) THEN
        -- Add a policy to allow edge functions to insert/update daily summaries
        CREATE POLICY "Service function can manage daily summaries" 
        ON public.ai_news_daily_summaries 
        FOR ALL 
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;

-- Update existing policy for admins to clearly define what they can do
DROP POLICY IF EXISTS "Only admins can create daily summaries" ON public.ai_news_daily_summaries;
DROP POLICY IF EXISTS "Only admins can update daily summaries" ON public.ai_news_daily_summaries;

-- Create more specific admin policies
CREATE POLICY "Admins can create daily summaries" 
ON public.ai_news_daily_summaries 
FOR INSERT 
TO authenticated
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update daily summaries" 
ON public.ai_news_daily_summaries 
FOR UPDATE 
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Fix potential permissions on ai_news_summaries table if it has RLS enabled
ALTER TABLE IF EXISTS public.ai_news_summaries ENABLE ROW LEVEL SECURITY;

-- Check if policy exists before creating for ai_news_summaries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_news_summaries' 
        AND policyname = 'Service functions can manage article summaries'
    ) THEN
        CREATE POLICY "Service functions can manage article summaries"
        ON public.ai_news_summaries
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;

-- Check if policy exists before creating for ai_news
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ai_news' 
        AND policyname = 'Service functions can access articles'
    ) THEN
        CREATE POLICY "Service functions can access articles"
        ON public.ai_news
        FOR SELECT
        USING (true);
    END IF;
END
$$;
