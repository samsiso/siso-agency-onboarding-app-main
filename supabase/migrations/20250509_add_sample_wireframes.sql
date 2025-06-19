-- Add sample wireframe data for ubahcrypt project
DO $$
DECLARE
  ubahcrypt_id UUID;
BEGIN
  -- Get or create the ubahcrypt project ID
  SELECT id INTO ubahcrypt_id FROM projects WHERE name = 'ubahcrypt' LIMIT 1;
  
  -- If ubahcrypt project doesn't exist, create it
  IF ubahcrypt_id IS NULL THEN
    INSERT INTO projects (name, description, status) 
    VALUES ('ubahcrypt', 'Cryptocurrency exchange and wallet app', 'active')
    RETURNING id INTO ubahcrypt_id;
  END IF;

  -- Add sample wireframes only if none exist for this project
  IF NOT EXISTS (SELECT 1 FROM project_wireframes WHERE project_id = ubahcrypt_id) THEN
    -- Login/Signup Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Login/Signup Page',
      'User authentication and account creation interface',
      'page',
      'complete',
      'approved',
      'pending',
      'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Login/Signup'
    );

    -- Onboarding/Tutorial Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Onboarding/Tutorial Page',
      'First-time user experience with step-by-step tutorials',
      'page',
      'complete',
      'approved',
      'pending',
      'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Onboarding'
    );

    -- Dashboard
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Dashboard',
      'Main dashboard with key metrics and user information',
      'page',
      'complete',
      'approved',
      'pending',
      'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Dashboard'
    );

    -- Markets Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Markets Page',
      'Cryptocurrency market listings with real-time price data',
      'page',
      'complete',
      'in-review',
      'pending',
      'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Markets'
    );

    -- News Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'News Page',
      'Latest cryptocurrency and blockchain news',
      'page',
      'in-progress',
      'pending',
      'pending',
      'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=News'
    );

    -- Insert 20 more wireframes to have all 25
    -- Wallet Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Wallet Page',
      'Crypto wallet management and asset storage',
      'page',
      'complete',
      'approved',
      'pending',
      'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Wallet'
    );

    -- Portfolio Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Portfolio Page',
      'User asset portfolio with performance metrics',
      'page',
      'complete',
      'approved',
      'in-progress',
      'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Portfolio'
    );

    -- Trading Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Trading Page',
      'Advanced trading interface with charts and order books',
      'page',
      'complete',
      'approved',
      'in-progress',
      'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Trading'
    );

    -- Open Orders Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Open Orders Page',
      'View and manage active trading orders',
      'page',
      'complete',
      'pending',
      'pending',
      'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Orders'
    );

    -- Transaction History Page
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES (
      ubahcrypt_id,
      'Transaction History Page',
      'Complete history of user transactions with filtering options',
      'page',
      'complete',
      'pending',
      'pending',
      'https://via.placeholder.com/300x200/10B981/FFFFFF?text=History'
    );

    -- Add the remaining 15 wireframes to reach 25 total
    INSERT INTO project_wireframes (project_id, title, description, category, wireframe_status, specs_status, dev_status, image_url)
    VALUES 
    (ubahcrypt_id, 'Transaction Fee Estimator Page', 'Calculate and estimate transaction fees before confirming', 'page', 'in-progress', 'pending', 'pending', 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Fees'),
    (ubahcrypt_id, 'Staking Page', 'Cryptocurrency staking options and rewards', 'page', 'complete', 'pending', 'pending', 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Staking'),
    (ubahcrypt_id, 'Earn/Interest Page', 'Earn interest on crypto holdings and investment options', 'page', 'complete', 'approved', 'pending', 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Earn'),
    (ubahcrypt_id, 'NFT Marketplace', 'Browse, buy, and sell non-fungible tokens', 'page', 'in-progress', 'in-review', 'pending', 'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=NFTs'),
    (ubahcrypt_id, 'Security Settings', 'User security preferences and two-factor authentication', 'page', 'complete', 'approved', 'in-progress', 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Security'),
    (ubahcrypt_id, 'Account Profile', 'User profile management and personal settings', 'page', 'complete', 'approved', 'complete', 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Profile'),
    (ubahcrypt_id, 'Notification Center', 'User alerts, price notifications, and activity updates', 'page', 'complete', 'in-review', 'pending', 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Notifications'),
    (ubahcrypt_id, 'Help Center', 'Knowledge base, FAQs, and support resources', 'page', 'complete', 'approved', 'complete', 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Help'),
    (ubahcrypt_id, 'Referral Program', 'User referrals and reward tracking', 'page', 'in-progress', 'pending', 'pending', 'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Referrals'),
    (ubahcrypt_id, 'Deposit/Withdrawal Page', 'Fund account and withdraw cryptocurrencies', 'page', 'complete', 'approved', 'in-progress', 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Deposit'),
    (ubahcrypt_id, 'Payment Methods', 'Manage linked bank accounts and payment options', 'page', 'complete', 'approved', 'pending', 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Payments'),
    (ubahcrypt_id, 'Analytics Dashboard', 'Advanced portfolio analytics and performance metrics', 'page', 'in-progress', 'pending', 'pending', 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Analytics'),
    (ubahcrypt_id, 'Settings Page', 'App preferences and user settings', 'page', 'complete', 'approved', 'complete', 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Settings'),
    (ubahcrypt_id, 'Cross-Chain Bridge', 'Transfer assets between different blockchain networks', 'page', 'in-progress', 'in-review', 'pending', 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Bridge'),
    (ubahcrypt_id, 'DeFi Dashboard', 'Decentralized finance opportunities and tracking', 'page', 'in-progress', 'pending', 'pending', 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=DeFi');
  END IF;
END $$; 