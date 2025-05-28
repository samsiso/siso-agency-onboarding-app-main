-- Create plan_templates table for shareable app plans
CREATE TABLE plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  raw_content TEXT, -- Original pasted content
  formatted_content JSONB, -- Parsed and structured content
  meta_data JSONB DEFAULT '{}', -- Additional data like client info, pricing, etc.
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' -- active, archived, draft
);

-- Create indexes for better performance
CREATE INDEX idx_plan_templates_slug ON plan_templates(slug);
CREATE INDEX idx_plan_templates_created_by ON plan_templates(created_by);
CREATE INDEX idx_plan_templates_status ON plan_templates(status);
CREATE INDEX idx_plan_templates_created_at ON plan_templates(created_at DESC);

-- Enable RLS
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;

-- Allow public read access for viewing published plans
CREATE POLICY "Public can view published plans" ON plan_templates
  FOR SELECT USING (is_public = true AND status = 'active');

-- Admin can manage their own plans
CREATE POLICY "Users can manage own plans" ON plan_templates
  FOR ALL USING (auth.uid() = created_by);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plan_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_plan_templates_updated_at
  BEFORE UPDATE ON plan_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_templates_updated_at();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_plan_slug(plan_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from title
  base_slug := LOWER(TRIM(plan_title));
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := TRIM(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'plan';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM plan_templates WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql; 