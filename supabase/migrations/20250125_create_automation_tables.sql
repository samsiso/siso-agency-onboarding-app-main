-- =============================================
-- SISO Agency Automation System Database Schema
-- =============================================

-- Create automation_tasks table
CREATE TABLE IF NOT EXISTS public.automation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('development', 'testing', 'deployment', 'analysis', 'maintenance')),
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused')) DEFAULT 'pending',
  prompt TEXT NOT NULL,
  allowed_tools JSONB DEFAULT '[]',
  estimated_tokens INTEGER DEFAULT 1000,
  actual_tokens INTEGER,
  execution_time_ms INTEGER,
  result JSONB,
  error TEXT,
  created_by VARCHAR(255) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for automation_tasks
CREATE INDEX idx_automation_tasks_status ON public.automation_tasks(status);
CREATE INDEX idx_automation_tasks_category ON public.automation_tasks(category);
CREATE INDEX idx_automation_tasks_priority ON public.automation_tasks(priority);
CREATE INDEX idx_automation_tasks_created_by ON public.automation_tasks(created_by);
CREATE INDEX idx_automation_tasks_created_at ON public.automation_tasks(created_at);

-- Create token_usage_history table
CREATE TABLE IF NOT EXISTS public.token_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(50) CHECK (service IN ('claude-code', 'anthropic-api', 'openai', 'custom')),
  tokens_used INTEGER NOT NULL,
  category VARCHAR(50),
  operation VARCHAR(255),
  cost DECIMAL(10, 6),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for token_usage_history
CREATE INDEX idx_token_usage_service ON public.token_usage_history(service);
CREATE INDEX idx_token_usage_category ON public.token_usage_history(category);
CREATE INDEX idx_token_usage_timestamp ON public.token_usage_history(timestamp);
CREATE INDEX idx_token_usage_date ON public.token_usage_history(DATE(timestamp));

-- Create rate_limit_usage table
CREATE TABLE IF NOT EXISTS public.rate_limit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  tokens_used INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  window_minute INTEGER,
  window_hour INTEGER,
  window_day VARCHAR(50)
);

-- Create indexes for rate_limit_usage
CREATE INDEX idx_rate_limit_category ON public.rate_limit_usage(category);
CREATE INDEX idx_rate_limit_timestamp ON public.rate_limit_usage(timestamp);
CREATE INDEX idx_rate_limit_window ON public.rate_limit_usage(window_day, window_hour, window_minute);

-- Create rate_limit_config table
CREATE TABLE IF NOT EXISTS public.rate_limit_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) UNIQUE NOT NULL,
  max_tokens_per_minute INTEGER NOT NULL DEFAULT 1000,
  max_tokens_per_hour INTEGER NOT NULL DEFAULT 15000,
  max_tokens_per_day INTEGER NOT NULL DEFAULT 100000,
  max_requests_per_minute INTEGER NOT NULL DEFAULT 5,
  max_requests_per_hour INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create token_limits_config table
CREATE TABLE IF NOT EXISTS public.token_limits_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_limit INTEGER NOT NULL DEFAULT 100000,
  monthly_limit INTEGER NOT NULL DEFAULT 2500000,
  per_operation_limit INTEGER NOT NULL DEFAULT 10000,
  emergency_buffer INTEGER NOT NULL DEFAULT 50000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create automation_analytics table for reporting
CREATE TABLE IF NOT EXISTS public.automation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  category VARCHAR(50),
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  failed_tasks INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  avg_execution_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unique constraint on automation_analytics
CREATE UNIQUE INDEX idx_automation_analytics_date_category ON public.automation_analytics(date, category);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_automation_tasks_modtime
    BEFORE UPDATE ON public.automation_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rate_limit_config_modtime
    BEFORE UPDATE ON public.rate_limit_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_token_limits_config_modtime
    BEFORE UPDATE ON public.token_limits_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics()
RETURNS void AS $$
DECLARE
    yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
    -- Aggregate automation task analytics
    INSERT INTO public.automation_analytics (date, category, total_tasks, completed_tasks, failed_tasks, total_tokens_used, avg_execution_time_ms)
    SELECT 
        yesterday::date,
        category,
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_tasks,
        COALESCE(SUM(actual_tokens), 0) as total_tokens_used,
        COALESCE(AVG(execution_time_ms), 0)::integer as avg_execution_time_ms
    FROM public.automation_tasks
    WHERE DATE(created_at) = yesterday
    GROUP BY category
    ON CONFLICT (date, category) 
    DO UPDATE SET
        total_tasks = EXCLUDED.total_tasks,
        completed_tasks = EXCLUDED.completed_tasks,
        failed_tasks = EXCLUDED.failed_tasks,
        total_tokens_used = EXCLUDED.total_tokens_used,
        avg_execution_time_ms = EXCLUDED.avg_execution_time_ms;

    -- Update cost information from token usage
    UPDATE public.automation_analytics 
    SET total_cost = (
        SELECT COALESCE(SUM(cost), 0)
        FROM public.token_usage_history 
        WHERE DATE(timestamp) = yesterday
        AND category = automation_analytics.category
    )
    WHERE date = yesterday;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old data
CREATE OR REPLACE FUNCTION public.cleanup_old_automation_data()
RETURNS void AS $$
DECLARE
    cutoff_date DATE := CURRENT_DATE - INTERVAL '90 days';
BEGIN
    -- Clean up old rate limit usage data (keep 30 days)
    DELETE FROM public.rate_limit_usage 
    WHERE timestamp < CURRENT_DATE - INTERVAL '30 days';
    
    -- Clean up old token usage history (keep 90 days)
    DELETE FROM public.token_usage_history 
    WHERE timestamp < cutoff_date;
    
    -- Archive old completed/failed tasks (keep 90 days)
    -- You might want to archive to another table instead of deleting
    DELETE FROM public.automation_tasks 
    WHERE created_at < cutoff_date 
    AND status IN ('completed', 'failed');
    
    RAISE NOTICE 'Cleaned up automation data older than %', cutoff_date;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SECURITY (RLS POLICIES)
-- =============================================

-- Enable Row Level Security
ALTER TABLE public.automation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_limits_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication setup)
-- These are basic policies - customize based on your user roles

-- Automation tasks - users can see their own tasks, admins can see all
CREATE POLICY "Users can view own automation tasks" ON public.automation_tasks
    FOR SELECT USING (
        auth.uid()::text = created_by 
        OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Users can create automation tasks" ON public.automation_tasks
    FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update own automation tasks" ON public.automation_tasks
    FOR UPDATE USING (
        auth.uid()::text = created_by 
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Token usage - authenticated users can view aggregated data
CREATE POLICY "Authenticated users can view token usage" ON public.token_usage_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert token usage" ON public.token_usage_history
    FOR INSERT WITH CHECK (true);

-- Rate limiting - authenticated users can view
CREATE POLICY "Authenticated users can view rate limits" ON public.rate_limit_usage
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert rate limit data" ON public.rate_limit_usage
    FOR INSERT WITH CHECK (true);

-- Config tables - only admins can modify
CREATE POLICY "Admins can manage rate limit config" ON public.rate_limit_config
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage token limits config" ON public.token_limits_config
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Analytics - authenticated users can view
CREATE POLICY "Authenticated users can view analytics" ON public.automation_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default rate limit configurations
INSERT INTO public.rate_limit_config (category, max_tokens_per_minute, max_tokens_per_hour, max_tokens_per_day, max_requests_per_minute, max_requests_per_hour)
VALUES 
    ('development', 1000, 15000, 100000, 5, 50),
    ('testing', 500, 8000, 50000, 3, 30),
    ('deployment', 2000, 20000, 80000, 2, 20),
    ('analysis', 800, 12000, 60000, 4, 40),
    ('maintenance', 300, 5000, 30000, 2, 15)
ON CONFLICT (category) DO NOTHING;

-- Insert default token limits
INSERT INTO public.token_limits_config (daily_limit, monthly_limit, per_operation_limit, emergency_buffer)
VALUES (100000, 2500000, 10000, 50000)
ON CONFLICT DO NOTHING;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.automation_tasks IS 'Stores automation tasks and their execution details';
COMMENT ON TABLE public.token_usage_history IS 'Tracks token usage across all services for cost monitoring';
COMMENT ON TABLE public.rate_limit_usage IS 'Real-time rate limiting data for preventing API abuse';
COMMENT ON TABLE public.rate_limit_config IS 'Configurable rate limits by category';
COMMENT ON TABLE public.token_limits_config IS 'Global token usage limits and budgets';
COMMENT ON TABLE public.automation_analytics IS 'Pre-aggregated analytics for reporting dashboards';