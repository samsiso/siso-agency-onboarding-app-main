-- Portfolio Items Test Data Migration
-- Add sample portfolio data to demonstrate the partnership dashboard functionality
--
-- This script inserts 3 test records into the portfolio_items table:
-- 1. Gritness (Gym niche) - not_contacted status
-- 2. NM Construction (Construction niche) - contacted status  
-- 3. UbahCryp (Web3 Trading niche) - feedback_app status
--
-- To run this migration:
-- 1. Via Supabase Dashboard: Copy and paste into SQL Editor
-- 2. Via CLI: supabase db reset --db-url "your-db-url"
-- 3. Via Migration: Add to supabase/migrations/ folder

-- Temporarily disable RLS for data insertion (re-enable after)
ALTER TABLE portfolio_items DISABLE ROW LEVEL SECURITY;

-- Insert test portfolio data
INSERT INTO portfolio_items (
  title,
  client_name, 
  live_url,
  client_source,
  project_status,
  user_id,
  description,
  technologies,
  created_at,
  updated_at
) VALUES 
(
  'Gritness',
  'Gritness Gym',
  'https://gritnessgym.vercel.app',
  'Personal Network',
  'not_contacted',
  '00000000-0000-0000-0000-000000000001',
  'Gym niche website for fitness enthusiasts',
  ARRAY['React', 'Next.js', 'Tailwind CSS'],
  NOW(),
  NOW()
),
(
  'NM Construction',
  'NM Construction',
  'https://nm-construction.vercel.app',
  'Personal Network',
  'contacted',
  '00000000-0000-0000-0000-000000000002',
  'Construction company website showcasing projects and services',
  ARRAY['React', 'Next.js', 'Tailwind CSS'],
  NOW(),
  NOW()
),
(
  'UbahCryp', 
  'UbahCryp',
  'https://ubahcrypcom.vercel.app',
  'Snapchat',
  'feedback_app',
  '00000000-0000-0000-0000-000000000003',
  'Web3 trading platform for cryptocurrency enthusiasts',
  ARRAY['React', 'Web3.js', 'Tailwind CSS'],
  NOW(),
  NOW()
)
ON CONFLICT (title) DO NOTHING;

-- Re-enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Verify the insertion
SELECT 
  title,
  client_name,
  live_url,
  client_source,
  project_status,
  created_at
FROM portfolio_items 
WHERE title IN ('Gritness', 'NM Construction', 'UbahCryp')
ORDER BY created_at DESC;