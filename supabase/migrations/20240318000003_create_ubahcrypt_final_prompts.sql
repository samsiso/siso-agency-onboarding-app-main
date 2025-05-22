-- Function to populate final features prompts for Ubahcrypt
CREATE OR REPLACE FUNCTION populate_ubahcrypt_final_prompts()
RETURNS void AS $$
BEGIN
  -- Staking Platform
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Stake', 'Frontend', 1, 'Analyze crypto staking platform requirements', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 2, 'Research staking mechanisms and reward systems', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 3, 'Plan implementation of staking platform', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 4, 'Implement basic staking interface', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 5, 'Add stake management and rewards tracking', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 6, 'Implement automated rewards distribution', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 7, 'Add staking analytics and projections', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 8, 'Optimize staking performance and UX', 0, false),
    ('Ubahcrypt', 'Stake', 'Frontend', 9, 'Review and enhance staking features', 0, false);

  -- Rewards Hub
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 1, 'Analyze rewards program requirements', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 2, 'Research engagement reward systems', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 3, 'Plan implementation of rewards system', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 4, 'Implement rewards tracking interface', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 5, 'Add achievement and milestone system', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 6, 'Implement rewards redemption', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 7, 'Add leaderboards and competitions', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 8, 'Optimize rewards distribution', 0, false),
    ('Ubahcrypt', 'RewardsHub', 'Frontend', 9, 'Review and enhance rewards program', 0, false);

  -- Launchpad
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Launchpad', 'Frontend', 1, 'Analyze token launchpad requirements', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 2, 'Research token launch platforms and features', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 3, 'Plan implementation of launchpad platform', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 4, 'Implement project listing interface', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 5, 'Add token sale management', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 6, 'Implement KYC and verification', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 7, 'Add allocation and distribution', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 8, 'Optimize launchpad performance', 0, false),
    ('Ubahcrypt', 'Launchpad', 'Frontend', 9, 'Review and enhance launchpad features', 0, false);

  -- VIP Program
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'VIP', 'Frontend', 1, 'Analyze VIP program requirements', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 2, 'Research VIP service features and benefits', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 3, 'Plan implementation of VIP system', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 4, 'Implement VIP level management', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 5, 'Add exclusive features and benefits', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 6, 'Implement VIP support integration', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 7, 'Add VIP analytics and reporting', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 8, 'Optimize VIP experience', 0, false),
    ('Ubahcrypt', 'VIP', 'Frontend', 9, 'Review and enhance VIP program', 0, false);

  -- Market Analysis
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 1, 'Analyze market analysis tool requirements', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 2, 'Research technical analysis features', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 3, 'Plan implementation of analysis tools', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 4, 'Implement basic chart analysis', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 5, 'Add technical indicators', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 6, 'Implement drawing tools', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 7, 'Add advanced analysis features', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 8, 'Optimize analysis performance', 0, false),
    ('Ubahcrypt', 'MarketAnalysis', 'Frontend', 9, 'Review and enhance analysis tools', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_ubahcrypt_final_prompts();

-- Drop the function after execution
DROP FUNCTION populate_ubahcrypt_final_prompts(); 