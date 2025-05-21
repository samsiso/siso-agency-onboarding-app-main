-- Insert test data for UbahCrypt project
INSERT INTO public.auto_prompts (
  client, 
  project, 
  domain, 
  module, 
  feature, 
  component, 
  prompt, 
  status, 
  priority, 
  notes,
  tags,
  step,
  stage
) VALUES 
(
  'Ubah Inc.', 
  'UbahCrypt', 
  'Frontend', 
  'Authentication', 
  'User Login', 
  'LoginForm', 
  'Create a React component for user login with email and password fields, with proper validation using zod schema. It should connect to the Supabase auth.signIn method and include error handling for invalid credentials.', 
  'completed', 
  'high', 
  'Login feature for cryptocurrency exchange',
  ARRAY['authentication', 'form', 'validation'],
  1,
  'Implementation'
),
(
  'Ubah Inc.', 
  'UbahCrypt', 
  'Frontend', 
  'Dashboard', 
  'Portfolio Overview', 
  'PortfolioChart', 
  'Create a responsive chart component using recharts that displays cryptocurrency holdings with price history. Include tooltips for detailed information and color coding based on performance.', 
  'in_progress', 
  'medium', 
  'Main dashboard visualization for the crypto portfolio',
  ARRAY['data-visualization', 'charts', 'dashboard'],
  2,
  'Implementation'
),
(
  'Ubah Inc.', 
  'UbahCrypt', 
  'Backend', 
  'API', 
  'Price Fetching', 
  NULL, 
  'Implement a serverless function to fetch current cryptocurrency prices from CoinGecko API. Include caching to minimize API calls and rate limiting to prevent overuse.', 
  'draft', 
  'critical', 
  'Core functionality for price tracking',
  ARRAY['api', 'pricing', 'serverless'],
  1,
  'Planning'
);

-- Insert test data for SisoAgency project
INSERT INTO public.auto_prompts (
  client, 
  project, 
  domain, 
  module, 
  feature, 
  component, 
  prompt, 
  status, 
  priority, 
  notes,
  step,
  stage
) VALUES 
(
  'SISO', 
  'SisoAgency', 
  'Backend', 
  'Client Management', 
  'Client Onboarding', 
  'OnboardingFlow', 
  'Create a step-by-step onboarding flow for agency clients with progress tracking and data validation at each step. The flow should include company information, project requirements, and billing details.', 
  'in_progress', 
  'high', 
  'Critical onboarding process for new clients',
  1,
  'Development'
),
(
  'SISO', 
  'SisoAgency', 
  'Frontend', 
  'Analytics', 
  'Performance Dashboard', 
  'MetricsDisplay', 
  'Build an analytics dashboard that displays key performance metrics for agency clients, including project status, timeline adherence, and budget tracking. Use nivo charts for data visualization.', 
  'draft', 
  'medium', 
  'Dashboard for client performance tracking',
  2,
  'Design'
); 