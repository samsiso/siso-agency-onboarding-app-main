
-- Create API token usage tracking table
CREATE TABLE IF NOT EXISTS public.api_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  operations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE public.api_token_usage IS 'Tracks daily API token usage to stay within limits';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_api_token_usage_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_api_token_usage_modtime
BEFORE UPDATE ON public.api_token_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_api_token_usage_modtime();

-- Add a scheduled job to reset monthly token usage on the 1st of each month
CREATE OR REPLACE FUNCTION public.reset_monthly_token_usage()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Only run this on the 1st day of the month
  IF date_part('day', CURRENT_DATE) = 1 THEN
    -- Log the monthly usage before resetting
    INSERT INTO public.api_token_usage_history (
      month_start_date,
      month_end_date,
      total_tokens_used,
      operations_summary
    )
    SELECT
      date_trunc('month', min(date))::date,
      date_trunc('month', max(date))::date + interval '1 month - 1 day',
      sum(tokens_used),
      jsonb_agg(
        jsonb_build_object(
          'date', date,
          'tokens_used', tokens_used,
          'operations', operations
        )
      )
    FROM
      public.api_token_usage
    WHERE
      date >= date_trunc('month', current_date - interval '1 month')::date
      AND date < date_trunc('month', current_date)::date;
  END IF;
END;
$$;

-- Create monthly history table to track usage patterns over time
CREATE TABLE IF NOT EXISTS public.api_token_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_start_date DATE NOT NULL,
  month_end_date DATE NOT NULL,
  total_tokens_used INTEGER NOT NULL,
  operations_summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
