-- Create the pages table for storing page/component details
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    project TEXT NOT NULL,
    client TEXT NOT NULL,
    domain TEXT NOT NULL,
    codebase_path TEXT NOT NULL,
    feature_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS pages_project_idx ON pages(project);
CREATE INDEX IF NOT EXISTS pages_domain_idx ON pages(domain);

-- Create the prompt_templates table for storing reusable prompt templates
CREATE TABLE IF NOT EXISTS prompt_templates (
    id SERIAL PRIMARY KEY,
    cycle_order INTEGER NOT NULL,
    stage TEXT NOT NULL,
    template_text TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on cycle order
CREATE INDEX IF NOT EXISTS prompt_templates_cycle_order_idx ON prompt_templates(cycle_order);

-- Create the enhanced auto_prompts table (or keep the existing one with modifications)
-- First, check if the table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'auto_prompts') THEN
        -- Create the table if it doesn't exist
        CREATE TABLE auto_prompts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            page_id INTEGER REFERENCES pages(id),
            cycle_order INTEGER NOT NULL,
            prompt_text TEXT NOT NULL,
            stage TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            completed_at TIMESTAMPTZ,
            response TEXT,
            metadata JSONB
        );
    ELSE
        -- Add columns if they don't exist (for existing table)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'page_id') THEN
            ALTER TABLE auto_prompts ADD COLUMN page_id INTEGER REFERENCES pages(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'cycle_order') THEN
            ALTER TABLE auto_prompts ADD COLUMN cycle_order INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auto_prompts' AND column_name = 'completed_at') THEN
            ALTER TABLE auto_prompts ADD COLUMN completed_at TIMESTAMPTZ;
        END IF;
    END IF;
END $$;

-- Create indexes for auto_prompts
CREATE INDEX IF NOT EXISTS auto_prompts_page_id_idx ON auto_prompts(page_id);
CREATE INDEX IF NOT EXISTS auto_prompts_status_idx ON auto_prompts(status);
CREATE INDEX IF NOT EXISTS auto_prompts_cycle_order_idx ON auto_prompts(cycle_order);

-- Create or replace functions for updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at fields if they don't exist
DO $$ 
BEGIN
    -- For pages table
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pages_updated_at') THEN
        CREATE TRIGGER update_pages_updated_at
        BEFORE UPDATE ON pages
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- For prompt_templates table
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_prompt_templates_updated_at') THEN
        CREATE TRIGGER update_prompt_templates_updated_at
        BEFORE UPDATE ON prompt_templates
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create helper functions for prompt generation
CREATE OR REPLACE FUNCTION generate_page_prompts(page_id INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO auto_prompts (page_id, cycle_order, prompt_text, stage, status, created_at)
    SELECT 
        page_id, 
        t.cycle_order,
        replace(
            replace(
                replace(
                    t.template_text, 
                    '[page]', p.name
                ), 
                '[path]', p.codebase_path
            ), 
            '[feature_source]', COALESCE(p.feature_source, 'requirements')
        ),
        t.stage, 
        'pending', 
        NOW()
    FROM pages p, prompt_templates t
    WHERE p.id = page_id
    ORDER BY t.cycle_order;
END;
$$ LANGUAGE plpgsql;

-- Create a view for the prompt queue
CREATE OR REPLACE VIEW ui_prompt_queue AS
SELECT 
    ap.id,
    p.name as page_name,
    p.project,
    p.client,
    p.domain,
    p.codebase_path,
    p.feature_source,
    ap.cycle_order,
    ap.stage,
    ap.status,
    ap.prompt_text,
    ap.created_at,
    ap.completed_at
FROM auto_prompts ap
JOIN pages p ON ap.page_id = p.id
ORDER BY p.name, ap.cycle_order;

-- Insert the 9-step prompt cycle templates
INSERT INTO prompt_templates (cycle_order, stage, template_text, description, estimated_time) 
VALUES
    (1, 'analyze', 'Analyze the [page] component''s UI codebase in [path] and identify areas for improvement in responsiveness, accessibility, and design consistency.', 'Initial code analysis', '30-60 minutes'),
    
    (2, 'list_issues', 'List specific UI issues in the [page] component (e.g., alignment, color contrast, mobile support) and suggest fixes based on modern frontend best practices.', 'Issue identification', '30-45 minutes'),
    
    (3, 'review_pdr', 'Review the PDR for the [page] component ([feature_source]) and extract UI requirements (e.g., layout, styling, interactions) to guide improvements.', 'Requirements review', '30-45 minutes'),
    
    (4, 'create_plan', 'Create a detailed plan to innovate the [page] component''s UI, incorporating PDR requirements ([feature_source]) and addressing codebase issues. Include steps for improving responsiveness, accessibility, and design.', 'Implementation planning', '45-60 minutes'),
    
    (5, 'propose_enhancements', 'Propose 3-5 creative UI enhancements for the [page] component (e.g., animations, micro-interactions, dark mode) that align with the PDR and modern trends.', 'UI enhancement proposals', '45-60 minutes'),
    
    (6, 'implement_responsiveness', 'Implement UI improvements for the [page] component to enhance responsiveness, ensuring compatibility across devices.', 'Responsiveness implementation', '1-2 hours'),
    
    (7, 'implement_accessibility', 'Enhance the accessibility of the [page] component''s UI, adding necessary ARIA labels and ensuring keyboard navigation.', 'Accessibility implementation', '1-2 hours'),
    
    (8, 'implement_design', 'Apply the proposed design enhancements to the [page] component''s UI, such as adding animations and supporting dark mode.', 'Design enhancement implementation', '1-3 hours'),
    
    (9, 'review_updates', 'Review the updated [page] component UI in [path] for alignment with the PDR ([feature_source]), quality standards, and the improvement plan. Suggest any necessary fixes.', 'Final review and fixes', '30-60 minutes')
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to select pages"
ON pages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert pages"
ON pages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pages"
ON pages FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to select prompt_templates"
ON prompt_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to select auto_prompts"
ON auto_prompts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert auto_prompts"
ON auto_prompts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update auto_prompts"
ON auto_prompts FOR UPDATE
TO authenticated
USING (true); 