-- Create the UI Prompt System with 9 steps
-- This includes three tables: pages, prompt_templates, and auto_prompts

-- Create enum for UI prompt steps
CREATE TYPE public.ui_prompt_step AS ENUM (
  'analyze_codebase',
  'list_issues',
  'review_pdr',
  'create_plan',
  'propose_enhancements',
  'implement_responsiveness',
  'implement_accessibility',
  'implement_design_enhancements',
  'review_updates'
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
CREATE TABLE IF NOT EXISTS public.pages (
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
  UNIQUE(project_id, route)
);

-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  step ui_prompt_step NOT NULL,
  template_content TEXT NOT NULL,
  estimated_time TEXT,
  order_position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(step)
);

-- Create auto_prompts table (enhanced version)
CREATE TABLE IF NOT EXISTS public.ui_prompts (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pages_project_id_idx ON public.pages(project_id);
CREATE INDEX IF NOT EXISTS pages_route_idx ON public.pages(route);
CREATE INDEX IF NOT EXISTS ui_prompts_page_id_idx ON public.ui_prompts(page_id);
CREATE INDEX IF NOT EXISTS ui_prompts_step_idx ON public.ui_prompts(step);
CREATE INDEX IF NOT EXISTS ui_prompts_status_idx ON public.ui_prompts(status);
CREATE INDEX IF NOT EXISTS prompt_templates_step_idx ON public.prompt_templates(step);

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

-- Add RLS policies
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_prompts ENABLE ROW LEVEL SECURITY;

-- Everyone with auth can read
CREATE POLICY "Users can read pages" 
  ON public.pages 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read templates" 
  ON public.prompt_templates 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read ui_prompts" 
  ON public.ui_prompts 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert pages" 
  ON public.pages 
  FOR INSERT 
  WITH CHECK ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can update pages" 
  ON public.pages 
  FOR UPDATE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete pages" 
  ON public.pages 
  FOR DELETE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert templates" 
  ON public.prompt_templates 
  FOR INSERT 
  WITH CHECK ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can update templates" 
  ON public.prompt_templates 
  FOR UPDATE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete templates" 
  ON public.prompt_templates 
  FOR DELETE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can insert ui_prompts" 
  ON public.ui_prompts 
  FOR INSERT 
  WITH CHECK ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can update ui_prompts" 
  ON public.ui_prompts 
  FOR UPDATE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete ui_prompts" 
  ON public.ui_prompts 
  FOR DELETE 
  USING ((SELECT is_admin() FROM auth.users WHERE id = auth.uid()));

-- Insert default prompt templates for the 9-step process
INSERT INTO public.prompt_templates (title, description, step, template_content, estimated_time, order_position)
VALUES
  (
    'Analyze Codebase',
    'Deep analysis of the current codebase for the page',
    'analyze_codebase',
    E'# Codebase Analysis for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Analysis Tasks\n1. Review the current implementation code\n2. Identify component structure and hierarchy\n3. Analyze state management approach\n4. Review routing and navigation\n5. Identify reusable components\n\n## Questions to Answer\n- What is the current architecture of this page?\n- How is state being managed?\n- What components are being used?\n- What libraries and dependencies are involved?\n- Are there any performance concerns in the current implementation?\n\n## Deliverables\n- Detailed component breakdown\n- State management analysis\n- Performance assessment\n- Identified code issues and technical debt',
    '30-60 minutes',
    1
  ),
  (
    'List Issues',
    'Identify and document UI/UX issues in the current implementation',
    'list_issues',
    E'# UI/UX Issues for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Issue Identification Tasks\n1. Identify visual inconsistencies\n2. Document responsiveness problems\n3. List accessibility issues\n4. Highlight UX pain points\n5. Note performance issues affecting UI\n\n## Categories to Consider\n- Layout and Spacing\n- Typography\n- Color and Contrast\n- Responsive Behavior\n- Interaction Feedback\n- Loading States\n- Error Handling\n- Accessibility\n\n## Deliverables\n- Comprehensive list of UI/UX issues\n- Screenshots or examples of each issue\n- Priority level for each issue\n- Impact assessment of each issue',
    '30-45 minutes',
    2
  ),
  (
    'Review PDR',
    'Review Product Design Requirements for compliance and gaps',
    'review_pdr',
    E'# PDR Review for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## PDR Review Tasks\n1. Review original design specifications\n2. Compare current implementation against requirements\n3. Identify any deviations from the design\n4. Note missing features or components\n5. Check for brand guideline compliance\n\n## Questions to Answer\n- Does the current implementation match the design requirements?\n- Are there any missing features or components?\n- Is the implementation following brand guidelines and design system?\n- Are there requirements that need clarification?\n- Are there any technical constraints affecting design implementation?\n\n## Deliverables\n- Gap analysis between requirements and implementation\n- List of design requirement violations\n- Recommendations for alignment\n- Questions for design team clarification',
    '30-45 minutes',
    3
  ),
  (
    'Create Plan',
    'Develop a structured implementation plan to address issues',
    'create_plan',
    E'# Implementation Plan for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Planning Tasks\n1. Prioritize identified issues and gaps\n2. Define implementation approach for each issue\n3. Estimate effort for each fix\n4. Create implementation sequence\n5. Identify dependencies and potential challenges\n\n## Plan Considerations\n- Component refactoring needs\n- State management improvements\n- Responsive design approach\n- Accessibility requirements\n- Performance optimizations\n\n## Deliverables\n- Detailed implementation roadmap\n- Task breakdown with estimates\n- Dependencies and critical path\n- Testing approach\n- Risk assessment',
    '45-60 minutes',
    4
  ),
  (
    'Propose Enhancements',
    'Suggest UI/UX improvements beyond fixing issues',
    'propose_enhancements',
    E'# Enhancement Proposals for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Enhancement Areas\n1. Visual design improvements\n2. Interaction and feedback enhancements\n3. Motion and animation suggestions\n4. Information architecture refinements\n5. Feature enhancements\n\n## Questions to Consider\n- How can we improve the visual hierarchy?\n- What interactions could be more intuitive?\n- How might we reduce cognitive load?\n- What micro-interactions would improve feedback?\n- Are there any innovative patterns we could introduce?\n\n## Deliverables\n- Detailed enhancement proposals\n- Mockups or descriptions of improvements\n- Expected impact of each enhancement\n- Implementation complexity assessment\n- Prioritized list of recommendations',
    '45-60 minutes',
    5
  ),
  (
    'Implement Responsiveness',
    'Improve responsive design across all breakpoints',
    'implement_responsiveness',
    E'# Responsive Implementation for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Responsiveness Tasks\n1. Implement mobile-first responsive layout\n2. Address specific breakpoint issues\n3. Optimize for tablets and larger screens\n4. Handle orientation changes\n5. Implement responsive typography\n\n## Technical Approach\n- Use Tailwind\'s responsive utilities\n- Implement grid and flexbox layouts\n- Apply responsive spacing and padding\n- Optimize images and media for different screen sizes\n- Use appropriate component variants based on screen size\n\n## Deliverables\n- Updated responsive components\n- Fixed layout issues across breakpoints\n- Responsive typography implementation\n- Testing results across device sizes',
    '2-4 hours',
    6
  ),
  (
    'Implement Accessibility',
    'Enhance accessibility compliance and usability',
    'implement_accessibility',
    E'# Accessibility Implementation for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Accessibility Tasks\n1. Add proper ARIA attributes\n2. Implement keyboard navigation\n3. Improve focus states and management\n4. Enhance screen reader compatibility\n5. Fix color contrast issues\n\n## Technical Approach\n- Use semantic HTML elements\n- Implement proper heading hierarchy\n- Add appropriate ARIA roles and labels\n- Ensure keyboard navigability\n- Test with screen readers\n- Fix color contrast ratios\n\n## Deliverables\n- Accessibility-enhanced components\n- Keyboard navigation improvements\n- Screen reader compatibility updates\n- Documentation of accessibility features\n- Testing results and compliance level',
    '2-3 hours',
    7
  ),
  (
    'Implement Design Enhancements',
    'Apply visual and interaction improvements',
    'implement_design_enhancements',
    E'# Design Enhancement Implementation for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Enhancement Tasks\n1. Implement visual design improvements\n2. Add micro-interactions and animations\n3. Enhance feedback mechanisms\n4. Improve information hierarchy\n5. Apply polish to UI details\n\n## Technical Approach\n- Use Tailwind for styling enhancements\n- Implement animations with CSS transitions/animations\n- Enhance component states and feedback\n- Refine typography and spacing\n- Add finishing touches to UI elements\n\n## Deliverables\n- Enhanced visual components\n- Implemented micro-interactions\n- Refined UI details\n- Improved feedback mechanisms\n- Documentation of enhancements',
    '2-4 hours',
    8
  ),
  (
    'Review Updates',
    'Final review of all implemented changes',
    'review_updates',
    E'# Implementation Review for [PAGE_NAME]\n\n## Context\n- Page: [PAGE_NAME] ([PAGE_ROUTE])\n- Project: [PROJECT_NAME]\n\n## Review Tasks\n1. Verify all issues have been addressed\n2. Check implementation against design requirements\n3. Test responsiveness across devices\n4. Validate accessibility improvements\n5. Assess performance impact\n\n## Questions to Answer\n- Have all identified issues been resolved?\n- Does the implementation meet design requirements?\n- Is the page fully responsive and accessible?\n- Are there any regressions or new issues?\n- What could be improved in future iterations?\n\n## Deliverables\n- Comprehensive review report\n- Before/after comparison\n- Testing results across devices\n- Performance metrics\n- Recommendations for future improvements',
    '30-60 minutes',
    9
  );

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
  v_prompt_content TEXT;
  v_new_prompt_id UUID;
BEGIN
  -- Get template
  SELECT id, template_content INTO v_template_id, v_template_content
  FROM public.prompt_templates
  WHERE step = p_step;
  
  -- Get page info
  SELECT name, route, project_id INTO v_page_name, v_page_route, v_project_id
  FROM public.pages
  WHERE id = p_page_id;
  
  -- Replace placeholders in template
  v_prompt_content := REPLACE(v_template_content, '[PAGE_NAME]', v_page_name);
  v_prompt_content := REPLACE(v_prompt_content, '[PAGE_ROUTE]', v_page_route);
  v_prompt_content := REPLACE(v_prompt_content, '[PROJECT_NAME]', v_project_id);
  
  -- Add custom notes if provided
  IF p_custom_notes IS NOT NULL THEN
    v_prompt_content := v_prompt_content || E'\n\n## Additional Notes\n' || p_custom_notes;
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
    
    -- Update the page status if we've reached the final step
    IF v_next_step = 'review_updates' THEN
      UPDATE public.pages
      SET status = 'review'
      WHERE id = p_page_id;
    ELSIF v_next_step = 'implement_design_enhancements' THEN
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
  p_description TEXT DEFAULT NULL
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
    status
  )
  VALUES (
    p_project_id,
    p_page_name,
    p_page_route,
    p_description,
    'initialized'
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION generate_ui_prompt(UUID, ui_prompt_step, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION advance_ui_page_step(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_ui_page_workflow(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_ui_prompt_step(ui_prompt_step) TO authenticated; 