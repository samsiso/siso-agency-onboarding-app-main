-- Function to populate final project prompts
CREATE OR REPLACE FUNCTION populate_final_project_prompts()
RETURNS void AS $$
BEGIN
  -- Financial Management
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'Financial', 'Frontend', 1, 'Analyze current financial management interface and workflows', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 2, 'Research financial management best practices and compliance requirements', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 3, 'Plan implementation of enhanced financial features', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 4, 'Implement invoice generation and management', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 5, 'Add payment processing and tracking', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 6, 'Implement financial reporting and analytics', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 7, 'Add budget management and forecasting', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 8, 'Implement expense tracking and categorization', 0, false),
    ('SisoAgency', 'Financial', 'Frontend', 9, 'Review and optimize financial management system', 0, false);

  -- Resource Hub
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'ResourceHub', 'Frontend', 1, 'Analyze current resource management and sharing system', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 2, 'Research knowledge management and resource sharing best practices', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 3, 'Plan implementation of enhanced resource hub', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 4, 'Implement resource library and categorization', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 5, 'Add search and filtering capabilities', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 6, 'Implement resource sharing and permissions', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 7, 'Add version control and change tracking', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 8, 'Implement resource analytics and insights', 0, false),
    ('SisoAgency', 'ResourceHub', 'Frontend', 9, 'Review and optimize resource hub functionality', 0, false);

  -- Settings and Profile
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'Settings', 'Frontend', 1, 'Analyze current settings and profile management interface', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 2, 'Research user preferences and profile management best practices', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 3, 'Plan implementation of enhanced settings system', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 4, 'Implement profile management and customization', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 5, 'Add notification preferences and management', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 6, 'Implement security settings and privacy controls', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 7, 'Add integration management and API keys', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 8, 'Implement backup and data export features', 0, false),
    ('SisoAgency', 'Settings', 'Frontend', 9, 'Review and optimize settings management system', 0, false);

  -- Help and Support
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'Help', 'Frontend', 1, 'Analyze current help and support system', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 2, 'Research help documentation and support best practices', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 3, 'Plan implementation of enhanced help system', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 4, 'Implement help center and documentation', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 5, 'Add interactive guides and tutorials', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 6, 'Implement ticket system and support chat', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 7, 'Add FAQ and troubleshooting guides', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 8, 'Implement feedback collection and improvement system', 0, false),
    ('SisoAgency', 'Help', 'Frontend', 9, 'Review and optimize help and support features', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_final_project_prompts();

-- Drop the function after execution
DROP FUNCTION populate_final_project_prompts(); 