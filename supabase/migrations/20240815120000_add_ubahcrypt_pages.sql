-- Add UbahCrypt MVP pages as sample data

-- First create a temporary table to hold the page data
CREATE TEMP TABLE temp_ubahcrypt_pages (
  page_name TEXT,
  page_route TEXT,
  domain TEXT
);

-- Insert all 25 pages with their routes and domains
INSERT INTO temp_ubahcrypt_pages (page_name, page_route, domain) VALUES
  ('Login/Signup Page', '/auth', 'Frontend'),
  ('Onboarding/Tutorial Page', '/onboarding', 'Frontend'),
  ('Dashboard', '/dashboard', 'Frontend'),
  ('Markets Page', '/markets', 'Frontend'),
  ('News Page', '/news', 'Frontend'),
  ('Wallet Page', '/wallet', 'Frontend'),
  ('Portfolio Page', '/portfolio', 'Frontend'),
  ('Trading Page', '/trade', 'Frontend'),
  ('Open Orders Page', '/orders', 'Frontend'),
  ('Transaction History Page', '/transactions', 'Frontend'),
  ('Transaction Fee Estimator Page', '/fee-estimator', 'Frontend'),
  ('Staking Page', '/stake', 'Frontend'),
  ('Staking Comparison Page', '/stake-compare', 'Frontend'),
  ('Security Settings Page', '/security-center', 'Frontend'),
  ('KYC Management Page', '/kyc', 'Frontend'),
  ('Security Information Page', '/security-info', 'Frontend'),
  ('Educational Content Page', '/education', 'Frontend'),
  ('Educational Search/Categories Page', '/education/search', 'Frontend'),
  ('Community Forum Page', '/community', 'Frontend'),
  ('Affiliate Page', '/affiliate', 'Frontend'),
  ('Referral Leaderboard Page', '/leaderboard', 'Frontend'),
  ('Notifications Page', '/notifications', 'Frontend'),
  ('API Management Page', '/api-management', 'Backend'),
  ('Settings Page', '/settings', 'Frontend'),
  ('Support/Help Page', '/support', 'Frontend');

-- Add placeholder prompts for these pages
-- Let's add a few sample prompts for each domain type (Frontend, Backend, Research)
DO $$
DECLARE
  page_record RECORD;
  prompt_types TEXT[] := ARRAY['analyze', 'plan', 'code', 'review', 'improve'];
  prompt_type TEXT;
  project_name TEXT := 'UbahCrypt';
BEGIN
  -- For each page in our temp table
  FOR page_record IN SELECT * FROM temp_ubahcrypt_pages LOOP
    -- For each prompt type (analyze, plan, code)
    FOR i IN 1..3 LOOP
      prompt_type := prompt_types[i];
      
      -- Insert a sample prompt
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
        page_name, 
        prompt_type
      ) VALUES (
        'Ubah Inc.', 
        project_name, 
        page_record.domain, 
        CASE 
          WHEN page_record.domain = 'Frontend' THEN 'UI/UX'
          WHEN page_record.domain = 'Backend' THEN 'API'
          ELSE 'Documentation'
        END, 
        page_record.page_name, 
        CASE 
          WHEN page_record.domain = 'Frontend' THEN page_record.page_name || ' Component'
          WHEN page_record.domain = 'Backend' THEN page_record.page_name || ' Service'
          ELSE page_record.page_name || ' Spec'
        END,
        CASE
          WHEN prompt_type = 'analyze' THEN 'Analyze the requirements for the ' || page_record.page_name || '. Identify key components, data needed, and user flows.'
          WHEN prompt_type = 'plan' THEN 'Create a development plan for the ' || page_record.page_name || '. Include component breakdown, state management, and API requirements.'
          WHEN prompt_type = 'code' THEN 'Implement the ' || page_record.page_name || ' according to the design specifications. Ensure responsive design and proper error handling.'
          WHEN prompt_type = 'review' THEN 'Review the code for the ' || page_record.page_name || '. Check for best practices, performance issues, and potential bugs.'
          ELSE 'Improve the existing implementation of the ' || page_record.page_name || '. Focus on performance, accessibility, and user experience.'
        END,
        'draft',
        'medium',
        page_record.page_name,
        prompt_type
      );
    END LOOP;
  END LOOP;
END $$;

-- Clean up
DROP TABLE temp_ubahcrypt_pages;

-- Add indices for the new page_route field if we want to query by route
ALTER TABLE IF EXISTS public.auto_prompts
ADD COLUMN IF NOT EXISTS page_route TEXT;

-- Update existing UbahCrypt prompts with routes
UPDATE public.auto_prompts
SET page_route = (
  CASE page_name
    WHEN 'Login/Signup Page' THEN '/auth'
    WHEN 'Onboarding/Tutorial Page' THEN '/onboarding'
    WHEN 'Dashboard' THEN '/dashboard'
    WHEN 'Markets Page' THEN '/markets'
    WHEN 'News Page' THEN '/news'
    WHEN 'Wallet Page' THEN '/wallet'
    WHEN 'Portfolio Page' THEN '/portfolio'
    WHEN 'Trading Page' THEN '/trade'
    WHEN 'Open Orders Page' THEN '/orders'
    WHEN 'Transaction History Page' THEN '/transactions'
    WHEN 'Transaction Fee Estimator Page' THEN '/fee-estimator'
    WHEN 'Staking Page' THEN '/stake'
    WHEN 'Staking Comparison Page' THEN '/stake-compare'
    WHEN 'Security Settings Page' THEN '/security-center'
    WHEN 'KYC Management Page' THEN '/kyc'
    WHEN 'Security Information Page' THEN '/security-info'
    WHEN 'Educational Content Page' THEN '/education'
    WHEN 'Educational Search/Categories Page' THEN '/education/search'
    WHEN 'Community Forum Page' THEN '/community'
    WHEN 'Affiliate Page' THEN '/affiliate'
    WHEN 'Referral Leaderboard Page' THEN '/leaderboard'
    WHEN 'Notifications Page' THEN '/notifications'
    WHEN 'API Management Page' THEN '/api-management'
    WHEN 'Settings Page' THEN '/settings'
    WHEN 'Support/Help Page' THEN '/support'
    ELSE NULL
  END
)
WHERE project = 'UbahCrypt';

-- Create index on page_route
CREATE INDEX IF NOT EXISTS auto_prompts_page_route_idx ON public.auto_prompts (page_route); 