import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DatabaseSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string} | null>(null);
  
  const setupUIPromptSystem = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Read SQL script content directly
      const migrationContent = `
      -- First drop the existing tables if they exist to avoid conflicts
      DROP TABLE IF EXISTS public.ui_prompts CASCADE;
      DROP TABLE IF EXISTS public.prompt_templates CASCADE;
      DROP TABLE IF EXISTS public.pages CASCADE;
      DROP TABLE IF EXISTS public.auto_prompts CASCADE;
      
      -- Drop the types if they exist
      DROP TYPE IF EXISTS public.ui_prompt_step CASCADE;
      DROP TYPE IF EXISTS public.prompt_status CASCADE;
      
      -- Create enum for UI prompt steps based on the new 8-prompt cycle
      CREATE TYPE public.ui_prompt_step AS ENUM (
        'analyze_codebase_1',
        'analyze_codebase_2',
        'extract_pdr_data',
        'plan_innovation_1',
        'plan_innovation_2',
        'execute_plan_1',
        'execute_plan_2',
        'execute_plan_3',
        'review_update_1',
        'review_update_2'
      );
      
      -- Create enum for prompt status
      CREATE TYPE public.prompt_status AS ENUM (
        'draft',
        'pending',
        'in_progress',
        'completed',
        'archived'
      );
      
      -- Create pages table
      CREATE TABLE public.pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id TEXT NOT NULL,
        name TEXT NOT NULL,
        route TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'in_progress',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        metadata JSONB DEFAULT '{}'::jsonb,
        priority INTEGER DEFAULT 1,
        category TEXT,
        pdr_source TEXT,
        UNIQUE(project_id, route)
      );
      
      -- Create prompt_templates table
      CREATE TABLE public.prompt_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        step ui_prompt_step NOT NULL,
        template_content TEXT NOT NULL,
        estimated_time TEXT,
        order_position INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        category TEXT,
        UNIQUE(step)
      );
      
      -- Create ui_prompts table
      CREATE TABLE public.ui_prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
        template_id UUID REFERENCES public.prompt_templates(id),
        step ui_prompt_step NOT NULL,
        content TEXT NOT NULL,
        status prompt_status DEFAULT 'draft',
        response TEXT,
        iteration INTEGER DEFAULT 1,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        metadata JSONB DEFAULT '{}'::jsonb,
        assigned_to UUID,
        issues JSONB[] DEFAULT ARRAY[]::jsonb[],
        suggestions JSONB[] DEFAULT ARRAY[]::jsonb[]
      );
      `;
      
      // Execute the SQL to create the schema
      await supabase.rpc('exec_sql', { sql: migrationContent });
      
      // Create indexes and functions
      await supabase.rpc('exec_sql', { sql: `
        -- Create indexes for better performance
        CREATE INDEX pages_project_id_idx ON public.pages(project_id);
        CREATE INDEX pages_route_idx ON public.pages(route);
        CREATE INDEX pages_category_idx ON public.pages(category);
        CREATE INDEX ui_prompts_page_id_idx ON public.ui_prompts(page_id);
        CREATE INDEX ui_prompts_step_idx ON public.ui_prompts(step);
        CREATE INDEX ui_prompts_status_idx ON public.ui_prompts(status);
        CREATE INDEX prompt_templates_step_idx ON public.prompt_templates(step);
        CREATE INDEX prompt_templates_category_idx ON public.prompt_templates(category);
        
        -- Function to update updated_at timestamps
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Create triggers for updated_at
        CREATE TRIGGER update_pages_updated_at
        BEFORE UPDATE ON public.pages
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_prompt_templates_updated_at
        BEFORE UPDATE ON public.prompt_templates
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_ui_prompts_updated_at
        BEFORE UPDATE ON public.ui_prompts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `});
      
      // Create helper functions
      await supabase.rpc('exec_sql', { sql: `
        -- Function to get the next step in the UI prompt workflow
        CREATE OR REPLACE FUNCTION get_next_ui_prompt_step(current_step ui_prompt_step)
        RETURNS ui_prompt_step
        LANGUAGE plpgsql
        AS $$
        DECLARE
          next_step ui_prompt_step;
        BEGIN
          SELECT step INTO next_step
          FROM public.prompt_templates
          WHERE order_position > (SELECT order_position FROM public.prompt_templates WHERE step = current_step)
          ORDER BY order_position ASC
          LIMIT 1;
          
          RETURN next_step;
        END;
        $$;
        
        -- Function to generate a UI prompt based on a template
        CREATE OR REPLACE FUNCTION generate_ui_prompt(
          p_page_id UUID,
          p_step ui_prompt_step,
          p_custom_notes TEXT DEFAULT NULL
        )
        RETURNS UUID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          v_template_id UUID;
          v_template_content TEXT;
          v_page_name TEXT;
          v_page_route TEXT;
          v_project_id TEXT;
          v_pdr_source TEXT;
          v_category TEXT;
          v_prompt_content TEXT;
          v_new_prompt_id UUID;
        BEGIN
          -- Get template
          SELECT id, template_content INTO v_template_id, v_template_content
          FROM public.prompt_templates
          WHERE step = p_step;
          
          -- Get page info
          SELECT name, route, project_id, pdr_source, category INTO v_page_name, v_page_route, v_project_id, v_pdr_source, v_category
          FROM public.pages
          WHERE id = p_page_id;
          
          -- Replace placeholders in template
          v_prompt_content := REPLACE(v_template_content, '[PAGE]', v_page_name);
          v_prompt_content := REPLACE(v_prompt_content, '[PAGE_ROUTE]', v_page_route);
          v_prompt_content := REPLACE(v_prompt_content, '[PATH]', v_page_route);
          v_prompt_content := REPLACE(v_prompt_content, '[PROJECT_NAME]', v_project_id);
          v_prompt_content := REPLACE(v_prompt_content, '[FEATURE_SOURCE]', COALESCE(v_pdr_source, 'PDR documentation'));
          v_prompt_content := REPLACE(v_prompt_content, '[CATEGORY]', COALESCE(v_category, 'general'));
          
          -- Add custom notes if provided
          IF p_custom_notes IS NOT NULL THEN
            v_prompt_content := v_prompt_content || E'\\n\\n## Additional Notes\\n' || p_custom_notes;
          END IF;
          
          -- Insert new prompt
          INSERT INTO public.ui_prompts (
            page_id,
            template_id,
            step,
            content,
            status,
            metadata
          )
          VALUES (
            p_page_id,
            v_template_id,
            p_step,
            v_prompt_content,
            'draft',
            jsonb_build_object('generated_at', now(), 'template_id', v_template_id)
          )
          RETURNING id INTO v_new_prompt_id;
          
          RETURN v_new_prompt_id;
        END;
        $$;
        
        -- Function to advance a page to the next UI prompt step
        CREATE OR REPLACE FUNCTION advance_ui_page_step(
          p_page_id UUID,
          p_custom_notes TEXT DEFAULT NULL
        )
        RETURNS ui_prompt_step
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          v_current_step ui_prompt_step;
          v_next_step ui_prompt_step;
          v_current_prompt_id UUID;
        BEGIN
          -- Get the current step for this page
          SELECT step INTO v_current_step
          FROM public.ui_prompts
          WHERE page_id = p_page_id
          ORDER BY created_at DESC
          LIMIT 1;
          
          -- Mark current step prompts as completed
          UPDATE public.ui_prompts
          SET status = 'completed'
          WHERE page_id = p_page_id AND step = v_current_step AND status != 'completed';
          
          -- Get the next step
          v_next_step := get_next_ui_prompt_step(v_current_step);
          
          -- If there's a next step, create a prompt for it
          IF v_next_step IS NOT NULL THEN
            PERFORM generate_ui_prompt(p_page_id, v_next_step, p_custom_notes);
            
            -- Update the page status based on which phase we're in
            IF v_next_step = 'review_update_1' THEN
              UPDATE public.pages
              SET status = 'review'
              WHERE id = p_page_id;
            ELSIF v_next_step = 'execute_plan_1' THEN
              UPDATE public.pages
              SET status = 'implementing'
              WHERE id = p_page_id;
            END IF;
          ELSE
            -- We've completed all steps
            UPDATE public.pages
            SET status = 'completed'
            WHERE id = p_page_id;
          END IF;
          
          RETURN v_next_step;
        END;
        $$;
        
        -- Function to initialize a page's UI prompt workflow
        CREATE OR REPLACE FUNCTION initialize_ui_page_workflow(
          p_project_id TEXT,
          p_page_name TEXT,
          p_page_route TEXT,
          p_description TEXT DEFAULT NULL,
          p_category TEXT DEFAULT NULL,
          p_pdr_source TEXT DEFAULT NULL
        )
        RETURNS UUID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          v_page_id UUID;
          v_first_step ui_prompt_step;
        BEGIN
          -- Create the page
          INSERT INTO public.pages (
            project_id,
            name,
            route,
            description,
            status,
            category,
            pdr_source
          )
          VALUES (
            p_project_id,
            p_page_name,
            p_page_route,
            p_description,
            'initialized',
            p_category,
            p_pdr_source
          )
          RETURNING id INTO v_page_id;
          
          -- Get the first step
          SELECT step INTO v_first_step
          FROM public.prompt_templates
          ORDER BY order_position ASC
          LIMIT 1;
          
          -- Generate the first prompt
          PERFORM generate_ui_prompt(v_page_id, v_first_step);
          
          RETURN v_page_id;
        END;
        $$;
      `});
      
      // Insert the 8-prompt cycle templates 
      await supabase.rpc('exec_sql', { sql: `
        -- Insert default prompt templates for the 8-prompt cycle
        INSERT INTO public.prompt_templates (title, description, step, template_content, estimated_time, order_position, category)
        VALUES
          (
            'Analyze Codebase - Step 1',
            'Initial analysis of page UI codebase',
            'analyze_codebase_1',
            E'# Codebase Analysis for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- Category: [CATEGORY]\\n\\n## Task\\nAnalyze the [PAGE] component\\'s UI codebase in [PATH] and identify areas for improvement in responsiveness, accessibility, and design consistency.\\n\\n## Questions to Answer\\n- What is the current architecture of this page?\\n- How is state being managed?\\n- What components are being used?\\n- What libraries and dependencies are involved?\\n- Are there any performance concerns in the current implementation?\\n- What responsiveness issues exist?\\n- What accessibility issues exist?\\n- What design consistency issues exist?\\n\\n## Deliverables\\n- Detailed component breakdown\\n- State management analysis\\n- Performance assessment\\n- Identified code issues and technical debt',
            '30-45 minutes',
            1,
            'Analyze Codebase'
          ),
          (
            'Analyze Codebase - Step 2',
            'Detailed listing of UI issues',
            'analyze_codebase_2',
            E'# UI Issues List for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- Category: [CATEGORY]\\n\\n## Task\\nList specific UI issues in the [PAGE] component (e.g., alignment, color contrast, mobile support) and suggest fixes based on modern frontend best practices.\\n\\n## Categories to Consider\\n- Layout and Spacing\\n- Typography\\n- Color and Contrast\\n- Responsive Behavior\\n- Interaction Feedback\\n- Loading States\\n- Error Handling\\n- Accessibility\\n\\n## Deliverables\\n- Comprehensive list of UI/UX issues\\n- Screenshots or examples of each issue\\n- Priority level for each issue\\n- Suggested fixes for each issue',
            '30-45 minutes',
            2,
            'Analyze Codebase'
          ),
          (
            'Extract PDR Data',
            'Extract UI requirements from PDR',
            'extract_pdr_data',
            E'# PDR Data Extraction for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nReview the PDR for the [PAGE] component ([FEATURE_SOURCE]) and extract UI requirements (e.g., layout, styling, interactions) to guide improvements.\\n\\n## Questions to Answer\\n- What are the specific UI requirements for this page?\\n- Are there any design specifications that need to be followed?\\n- What interactions and user flows are defined?\\n- Are there any specific accessibility requirements?\\n- What are the responsive design requirements?\\n\\n## Deliverables\\n- Structured list of UI requirements\\n- Design specifications\\n- Interaction requirements\\n- Responsive design requirements\\n- Accessibility requirements',
            '30-45 minutes',
            3,
            'Extract PDR Data'
          ),
          (
            'Plan Innovation - Step 1',
            'Create detailed UI improvement plan',
            'plan_innovation_1',
            E'# UI Improvement Plan for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nCreate a detailed plan to innovate the [PAGE] component\\'s UI, incorporating PDR requirements ([FEATURE_SOURCE]) and addressing codebase issues. Include steps for enhancing design, accessibility, and user experience.\\n\\n## Plan Structure\\n1. Current State Overview\\n2. Improvement Goals\\n3. Step-by-Step Implementation Plan\\n4. Timeline and Dependencies\\n5. Quality Assurance Approach\\n\\n## Deliverables\\n- Comprehensive UI improvement plan\\n- Prioritized list of changes\\n- Implementation steps with clear instructions\\n- Timeline estimates\\n- Success criteria',
            '45-60 minutes',
            4,
            'Plan Innovation'
          ),
          (
            'Plan Innovation - Step 2',
            'Propose creative UI enhancements',
            'plan_innovation_2',
            E'# Creative UI Enhancements for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nPropose 3-5 creative UI enhancements for the [PAGE] component (e.g., animations, micro-interactions, dark mode) that align with the PDR and modern trends.\\n\\n## Enhancement Categories\\n- Visual Design Improvements\\n- Interaction Enhancements\\n- Animation and Motion\\n- Feature Additions\\n- User Experience Optimizations\\n\\n## Deliverables\\n- 3-5 detailed enhancement proposals\\n- Mockups or descriptions of improvements\\n- Implementation complexity assessment\\n- Expected user impact\\n- Alignment with design system and PDR',
            '45-60 minutes',
            5,
            'Plan Innovation'
          ),
          (
            'Execute Plan - Step 1',
            'Implement first phase of UI improvements',
            'execute_plan_1',
            E'# UI Implementation Phase 1 for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nImplement the first step of the [PAGE] UI improvement plan, updating the codebase in [PATH] with clean, documented code.\\n\\n## Focus Areas\\n- Core Layout Structure\\n- Responsive Framework\\n- Base Component Updates\\n- Foundational Styling\\n\\n## Deliverables\\n- Updated code with implementation of first phase\\n- Clean, well-documented changes\\n- Responsive layout improvements\\n- Base component structure enhancements',
            '2-3 hours',
            6,
            'Execute Plan'
          ),
          (
            'Execute Plan - Step 2',
            'Implement second phase of UI improvements',
            'execute_plan_2',
            E'# UI Implementation Phase 2 for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nExecute the second step of the [PAGE] UI plan, ensuring compatibility with the framework and PDR requirements.\\n\\n## Focus Areas\\n- Component Refinement\\n- Interactive Elements\\n- Content Presentation\\n- Visual Design Improvements\\n\\n## Deliverables\\n- Updated code with implementation of second phase\\n- Enhanced interactive elements\\n- Improved content presentation\\n- Visual design enhancements\\n- Compatibility with framework',
            '2-3 hours',
            7,
            'Execute Plan'
          ),
          (
            'Execute Plan - Step 3',
            'Implement third phase of UI improvements',
            'execute_plan_3',
            E'# UI Implementation Phase 3 for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nApply the third step of the [PAGE] UI plan, focusing on accessibility and performance.\\n\\n## Focus Areas\\n- Accessibility Enhancements\\n- Performance Optimizations\\n- Final Polish\\n- Edge Case Handling\\n\\n## Deliverables\\n- Updated code with implementation of third phase\\n- Accessibility improvements (ARIA attributes, keyboard navigation)\\n- Performance optimizations\\n- Final UI polish\\n- Handling of edge cases',
            '2-3 hours',
            8,
            'Execute Plan'
          ),
          (
            'Review & Update - Step 1',
            'Review updated UI for alignment with PDR',
            'review_update_1',
            E'# UI Implementation Review for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nReview the updated [PAGE] component UI in [PATH] for alignment with the PDR ([FEATURE_SOURCE]), quality standards, and plan. Suggest fixes for any issues.\\n\\n## Review Criteria\\n- PDR Requirement Fulfillment\\n- Code Quality and Structure\\n- Accessibility Compliance\\n- Responsive Behavior\\n- Visual Design Consistency\\n- Performance Impact\\n\\n## Deliverables\\n- Comprehensive review report\\n- Identified issues and recommendations\\n- Validation against PDR requirements\\n- Quality assessment\\n- Final improvement suggestions',
            '45-60 minutes',
            9,
            'Review & Update'
          ),
          (
            'Review & Update - Step 2',
            'Update PDR and changelog with UI changes',
            'review_update_2',
            E'# PDR & Changelog Update for [PAGE]\\n\\n## Context\\n- Page: [PAGE]\\n- Path: [PATH]\\n- PDR Source: [FEATURE_SOURCE]\\n- Category: [CATEGORY]\\n\\n## Task\\nUpdate the PDR and changelog for the [PAGE] component with details of UI changes, including new features, fixes, and quality improvements.\\n\\n## Documentation Structure\\n- Summary of Changes\\n- New Features Added\\n- Issues Resolved\\n- UI/UX Improvements\\n- Accessibility Enhancements\\n- Performance Optimizations\\n- Screenshots & Comparisons\\n\\n## Deliverables\\n- Updated PDR documentation\\n- Detailed changelog entry\\n- Before/after comparisons\\n- Feature documentation updates\\n- Technical documentation updates',
            '30-45 minutes',
            10,
            'Review & Update'
          );
      `});
      
      // Set up RLS policies
      await supabase.rpc('exec_sql', { sql: `
        -- Allow RLS and set up policies
        ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.ui_prompts ENABLE ROW LEVEL SECURITY;
        
        -- Everyone with auth can read
        CREATE POLICY "Users can read pages" 
          ON public.pages 
          FOR SELECT 
          USING (true);
        
        CREATE POLICY "Users can read templates" 
          ON public.prompt_templates 
          FOR SELECT 
          USING (true);
        
        CREATE POLICY "Users can read ui_prompts" 
          ON public.ui_prompts 
          FOR SELECT 
          USING (true);
        
        -- Everyone with auth can insert/update/delete
        CREATE POLICY "Users can insert pages" 
          ON public.pages 
          FOR INSERT 
          WITH CHECK (true);
        
        CREATE POLICY "Users can update pages" 
          ON public.pages 
          FOR UPDATE 
          USING (true);
        
        CREATE POLICY "Users can delete pages" 
          ON public.pages 
          FOR DELETE 
          USING (true);
        
        CREATE POLICY "Users can insert templates" 
          ON public.prompt_templates 
          FOR INSERT 
          WITH CHECK (true);
        
        CREATE POLICY "Users can update templates" 
          ON public.prompt_templates 
          FOR UPDATE 
          USING (true);
        
        CREATE POLICY "Users can delete templates" 
          ON public.prompt_templates 
          FOR DELETE 
          USING (true);
        
        CREATE POLICY "Users can insert ui_prompts" 
          ON public.ui_prompts 
          FOR INSERT 
          WITH CHECK (true);
        
        CREATE POLICY "Users can update ui_prompts" 
          ON public.ui_prompts 
          FOR UPDATE 
          USING (true);
        
        CREATE POLICY "Users can delete ui_prompts" 
          ON public.ui_prompts 
          FOR DELETE 
          USING (true);
        
        -- Grant execute permissions
        GRANT EXECUTE ON FUNCTION generate_ui_prompt(UUID, ui_prompt_step, TEXT) TO authenticated;
        GRANT EXECUTE ON FUNCTION advance_ui_page_step(UUID, TEXT) TO authenticated;
        GRANT EXECUTE ON FUNCTION initialize_ui_page_workflow(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
        GRANT EXECUTE ON FUNCTION get_next_ui_prompt_step(ui_prompt_step) TO authenticated;
      `});
      
      // Insert sample pages for 25 key areas with categories
      await supabase.rpc('exec_sql', { sql: `
        -- Insert sample pages for 25 key areas with categories
        INSERT INTO public.pages (project_id, name, route, description, priority, category, pdr_source)
        VALUES
        ('ubahcrypt', 'Dashboard', '/dashboard', 'Main trading dashboard with account overview', 1, 'Core Trading', 'Dashboard PDR v2.1'),
        ('ubahcrypt', 'Market Overview', '/market', 'Market overview with price charts and trends', 2, 'Market Data', 'Market PDR v1.5'),
        ('ubahcrypt', 'Trade', '/trade', 'Trading interface for buying and selling crypto', 3, 'Core Trading', 'Trading Interface PDR v3.0'),
        ('ubahcrypt', 'Order History', '/orders', 'History of all completed and pending orders', 4, 'Core Trading', 'Orders PDR v1.2'),
        ('ubahcrypt', 'Wallet', '/wallet', 'Crypto wallet management interface', 5, 'Wallet & Assets', 'Wallet PDR v2.0'),
        ('ubahcrypt', 'Assets', '/assets', 'View and manage all crypto assets', 6, 'Wallet & Assets', 'Assets PDR v1.8'),
        ('ubahcrypt', 'Portfolio', '/portfolio', 'Portfolio performance tracking and analysis', 7, 'Portfolio', 'Portfolio PDR v2.2'),
        ('ubahcrypt', 'Settings', '/settings', 'User account settings and preferences', 8, 'Account', 'Settings PDR v1.3'),
        ('ubahcrypt', 'KYC Verification', '/kyc', 'Know Your Customer verification process', 9, 'Account', 'KYC PDR v3.1'),
        ('ubahcrypt', 'Security', '/security', 'Account security settings and 2FA', 10, 'Account', 'Security PDR v2.5'),
        ('ubahcrypt', 'Notifications', '/notifications', 'Notification center and preferences', 11, 'Account', 'Notifications PDR v1.0'),
        ('ubahcrypt', 'API Management', '/api', 'API key management for developers', 12, 'Developer', 'API PDR v2.0'),
        ('ubahcrypt', 'Help Center', '/help', 'Support documentation and FAQs', 13, 'Support', 'Help Center PDR v1.5'),
        ('ubahcrypt', 'News Feed', '/news', 'Cryptocurrency news and updates', 14, 'Information', 'News PDR v1.2'),
        ('ubahcrypt', 'Market Analysis', '/analysis', 'Detailed market analysis tools', 15, 'Market Data', 'Analysis PDR v2.3'),
        ('ubahcrypt', 'Exchange', '/exchange', 'Primary exchange interface', 16, 'Core Trading', 'Exchange PDR v3.5'),
        ('ubahcrypt', 'Spot Trading', '/spot', 'Spot trading interface', 17, 'Core Trading', 'Spot Trading PDR v2.0'),
        ('ubahcrypt', 'Futures Trading', '/futures', 'Futures and derivatives trading', 18, 'Advanced Trading', 'Futures PDR v2.7'),
        ('ubahcrypt', 'Staking', '/staking', 'Staking options for passive income', 19, 'Earning', 'Staking PDR v1.9'),
        ('ubahcrypt', 'Earn', '/earn', 'Various earning options including yield farming', 20, 'Earning', 'Earn PDR v2.1'),
        ('ubahcrypt', 'NFT Marketplace', '/nft', 'Marketplace for NFT trading', 21, 'NFT', 'NFT Marketplace PDR v1.0'),
        ('ubahcrypt', 'Launchpad', '/launchpad', 'Platform for new token launches', 22, 'New Assets', 'Launchpad PDR v1.3'),
        ('ubahcrypt', 'Mobile App QR', '/mobile', 'QR code for mobile app download', 23, 'Mobile', 'Mobile QR PDR v1.0'),
        ('ubahcrypt', 'Referral Program', '/referral', 'User referral program', 24, 'Growth', 'Referral PDR v1.5'),
        ('ubahcrypt', 'Community', '/community', 'Community forum and discussions', 25, 'Information', 'Community PDR v1.2');
      `});
      
      // Initialize workflow for each page with first prompt
      await supabase.rpc('exec_sql', { sql: `
        -- Initialize workflow for each page with first prompt
        DO $$
        DECLARE
            page_record RECORD;
        BEGIN
            FOR page_record IN SELECT id, name, route, category FROM public.pages LOOP
                PERFORM generate_ui_prompt(
                    page_record.id, 
                    'analyze_codebase_1'::ui_prompt_step, 
                    'Initial analysis for ' || page_record.name || ' in category ' || page_record.category
                );
            END LOOP;
        END $$;
      `});
      
      setResult({
        success: true,
        message: 'New 8-prompt cycle UI system setup completed successfully! Created 25 pages with initial prompts.'
      });
    } catch (error) {
      console.error('Error setting up UI Prompt system:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>UI Prompt Cycle System Database Setup</CardTitle>
          <CardDescription>
            This page will set up the new 8-prompt cycle system and populate sample data for 25 pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">The New 8-Prompt Cycle System:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-medium">Analyze Codebase (2 prompts):</span> Analyze the page's UI and identify issues</li>
              <li><span className="font-medium">Extract PDR Data (1 prompt):</span> Extract UI requirements from PDR</li>
              <li><span className="font-medium">Plan Innovation (2 prompts):</span> Create a plan for improvement and propose enhancements</li>
              <li><span className="font-medium">Execute Plan (3 prompts):</span> Implement the UI improvements in three phases</li>
              <li><span className="font-medium">Review & Update (2 prompts):</span> Review updates and update documentation</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={setupUIPromptSystem} 
              disabled={isLoading} 
              size="lg"
              className="w-full max-w-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up Database...
                </>
              ) : (
                'Setup New 8-Prompt Cycle System'
              )}
            </Button>
          </div>
          
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 