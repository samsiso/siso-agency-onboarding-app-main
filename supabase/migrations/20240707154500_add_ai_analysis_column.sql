
-- Add ai_analysis column to ai_news table if it doesn't exist
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ai_news'
        AND column_name = 'ai_analysis'
    ) THEN
        -- Add the column
        ALTER TABLE public.ai_news
        ADD COLUMN ai_analysis JSONB DEFAULT NULL;
    END IF;
END$$;

-- Add has_ai_analysis column to ai_news table if it doesn't exist
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ai_news'
        AND column_name = 'has_ai_analysis'
    ) THEN
        -- Add the column
        ALTER TABLE public.ai_news
        ADD COLUMN has_ai_analysis BOOLEAN DEFAULT FALSE;
    END IF;
END$$;

-- Add analysis_date column to ai_news table if it doesn't exist
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'ai_news'
        AND column_name = 'analysis_date'
    ) THEN
        -- Add the column
        ALTER TABLE public.ai_news
        ADD COLUMN analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END$$;
