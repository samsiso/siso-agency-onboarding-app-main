
-- First ensure we have the project
INSERT INTO projects (id, name, description, status)
VALUES (
  'ubahcryp-project-id',
  'UbahCryp',
  'A decentralized platform for crypto trading, staking, and community engagement',
  'in_progress'
) ON CONFLICT (id) DO NOTHING;

-- Insert Trading & Transactions features
INSERT INTO project_features (project_id, title, description, priority, status, difficulty, estimated_cost)
VALUES
  ('ubahcryp-project-id', 'Web3 Wallet Integration', 'Seamless connection with MetaMask, Trust Wallet, and Coinbase Wallet for blockchain interactions', 'high', 'pending', 'high', 2000),
  ('ubahcryp-project-id', 'P2P Trading System', 'A secure, escrow-protected peer-to-peer trading system to facilitate safe crypto transactions', 'high', 'pending', 'high', 3000),
  ('ubahcryp-project-id', 'Transaction History Dashboard', 'Users can monitor past trades, earnings, and staking performance in a dedicated dashboard section', 'medium', 'pending', 'medium', 1500),
  ('ubahcryp-project-id', 'Live Market Data Integration', 'Real-time price feeds integrated for informed trading decisions', 'high', 'pending', 'medium', 1000);

-- Insert Security features
INSERT INTO project_features (project_id, title, description, priority, status, difficulty, estimated_cost)
VALUES
  ('ubahcryp-project-id', 'Smart Contract Implementation', 'Ensures transparency and trust by executing trades via audited smart contracts', 'high', 'pending', 'high', 4000),
  ('ubahcryp-project-id', '2FA and KYC Integration', 'Two-factor authentication and Know Your Customer verification for large transactions', 'high', 'pending', 'medium', 2500),
  ('ubahcryp-project-id', 'Security Infrastructure Setup', 'DDoS Protection & SSL Encryption implementation', 'high', 'pending', 'medium', 1500);

-- Insert Staking features
INSERT INTO project_features (project_id, title, description, priority, status, difficulty, estimated_cost)
VALUES
  ('ubahcryp-project-id', 'Token Locking Mechanism', 'Users can stake tokens for fixed periods (3, 6, 12 months) to earn competitive rewards', 'high', 'pending', 'high', 3000),
  ('ubahcryp-project-id', 'Auto-Compounding System', 'Automatically reinvests earnings to maximize returns', 'medium', 'pending', 'high', 2500),
  ('ubahcryp-project-id', 'Dynamic Interest Rates', 'Flexible Annual Percentage Yield (APY) based on staking duration and market conditions', 'medium', 'pending', 'medium', 2000);

-- Insert Community features
INSERT INTO project_features (project_id, title, description, priority, status, difficulty, estimated_cost)
VALUES
  ('ubahcryp-project-id', 'Referral System', 'Incentivizes organic growth by rewarding users for inviting others with token rewards', 'medium', 'pending', 'medium', 2000),
  ('ubahcryp-project-id', 'Educational Content Platform', 'Provides resources like articles and videos to educate users on crypto investing', 'medium', 'pending', 'low', 1500),
  ('ubahcryp-project-id', 'Community Forum', 'A social trading platform for users to share trading insights and engage in discussions', 'low', 'pending', 'medium', 2000);
