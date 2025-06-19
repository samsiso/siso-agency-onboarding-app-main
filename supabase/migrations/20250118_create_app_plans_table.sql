-- Create app_plans table for storing generated app plans
CREATE TABLE IF NOT EXISTS app_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  business_type TEXT,
  target_audience TEXT,
  app_concept TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  technical_requirements JSONB,
  timeline TEXT,
  budget_range TEXT,
  development_phases JSONB DEFAULT '[]'::jsonb,
  ui_ux_plan JSONB,
  market_analysis JSONB,
  revenue_model JSONB,
  risk_mitigation JSONB,
  status TEXT DEFAULT 'completed',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_app_plans_user_id ON app_plans(user_id);
CREATE INDEX idx_app_plans_created_at ON app_plans(created_at DESC);
CREATE INDEX idx_app_plans_status ON app_plans(status);

-- Enable RLS
ALTER TABLE app_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own app plans" ON app_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own app plans" ON app_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app plans" ON app_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app plans" ON app_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_plans_updated_at BEFORE UPDATE ON app_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();