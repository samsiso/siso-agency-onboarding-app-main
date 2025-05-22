-- Function to populate more project prompts
CREATE OR REPLACE FUNCTION populate_more_project_prompts()
RETURNS void AS $$
BEGIN
  -- Auth Pages
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'Auth', 'Frontend', 1, 'Analyze current authentication flow and security measures', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 2, 'Research modern authentication patterns and security best practices', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 3, 'Plan implementation of enhanced authentication system', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 4, 'Implement core authentication components', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 5, 'Add social authentication options', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 6, 'Implement password recovery and account management', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 7, 'Add multi-factor authentication', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 8, 'Implement session management and security features', 0, false),
    ('SisoAgency', 'Auth', 'Frontend', 9, 'Review and optimize authentication system', 0, false);

  -- Client Dashboard
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'ClientDashboard', 'Frontend', 1, 'Analyze current client dashboard interface and functionality', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 2, 'Research client portal best practices and user experience patterns', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 3, 'Plan implementation of enhanced client dashboard', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 4, 'Implement core dashboard components and layout', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 5, 'Add project progress tracking and reporting', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 6, 'Implement communication and notification features', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 7, 'Add document sharing and collaboration tools', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 8, 'Implement analytics and insights features', 0, false),
    ('SisoAgency', 'ClientDashboard', 'Frontend', 9, 'Review and optimize client dashboard experience', 0, false);

  -- Projects and Tasks
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 1, 'Analyze current project and task management system', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 2, 'Research project management best practices and methodologies', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 3, 'Plan implementation of enhanced project management features', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 4, 'Implement project creation and basic task management', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 5, 'Add task dependencies and timeline visualization', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 6, 'Implement resource allocation and team assignment', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 7, 'Add progress tracking and reporting features', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 8, 'Implement project templates and automation', 0, false),
    ('SisoAgency', 'ProjectsAndTasks', 'Frontend', 9, 'Review and optimize project management system', 0, false);

  -- Onboarding
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'Onboarding', 'Frontend', 1, 'Analyze current onboarding flow and user experience', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 2, 'Research effective onboarding patterns and best practices', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 3, 'Plan implementation of improved onboarding experience', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 4, 'Implement welcome flow and initial setup wizard', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 5, 'Add interactive tutorials and guided tours', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 6, 'Implement progress tracking and checkpoints', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 7, 'Add personalization and customization options', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 8, 'Implement feedback collection and analytics', 0, false),
    ('SisoAgency', 'Onboarding', 'Frontend', 9, 'Review and optimize onboarding experience', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_more_project_prompts();

-- Drop the function after execution
DROP FUNCTION populate_more_project_prompts(); 