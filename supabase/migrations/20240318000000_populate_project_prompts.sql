-- Function to populate project prompts
CREATE OR REPLACE FUNCTION populate_project_prompts()
RETURNS void AS $$
BEGIN
  -- Insert prompts for SisoAgency project
  -- Admin Dashboard
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'AdminDashboard', 'Frontend', 1, 'Analyze the current AdminDashboard component structure and identify areas for improvement', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 2, 'Research modern dashboard design patterns and relevant analytics features', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 3, 'Plan the implementation of new dashboard features and improvements', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 4, 'Implement core dashboard layout and basic components', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 5, 'Add interactive charts and data visualization components', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 6, 'Implement real-time data updates and notifications', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 7, 'Add customization options and user preferences', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 8, 'Optimize performance and implement caching strategies', 0, false),
    ('SisoAgency', 'AdminDashboard', 'Frontend', 9, 'Review and finalize the dashboard implementation', 0, false);

  -- Admin Clients
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'AdminClients', 'Frontend', 1, 'Analyze the current client management interface and user flows', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 2, 'Research best practices for client management systems', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 3, 'Plan the implementation of enhanced client management features', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 4, 'Implement client list view with filtering and sorting', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 5, 'Add client details view and editing capabilities', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 6, 'Implement client communication features', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 7, 'Add client activity tracking and history', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 8, 'Implement client reporting and analytics', 0, false),
    ('SisoAgency', 'AdminClients', 'Frontend', 9, 'Review and optimize the client management system', 0, false);

  -- Admin Teams
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('SisoAgency', 'AdminTeams', 'Frontend', 1, 'Analyze current team management functionality and workflows', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 2, 'Research team collaboration and management best practices', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 3, 'Plan implementation of team management features', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 4, 'Implement team creation and member management', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 5, 'Add team roles and permissions system', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 6, 'Implement team communication features', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 7, 'Add team performance tracking', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 8, 'Implement team resource allocation', 0, false),
    ('SisoAgency', 'AdminTeams', 'Frontend', 9, 'Review and optimize team management features', 0, false);

  -- Continue with more pages...
  -- Note: This is a sample of 3 pages, we'll add more in subsequent migrations
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_project_prompts();

-- Drop the function after execution
DROP FUNCTION populate_project_prompts(); 