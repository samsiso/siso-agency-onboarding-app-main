-- Function to populate advanced features and settings prompts for Ubahcrypt
CREATE OR REPLACE FUNCTION populate_ubahcrypt_advanced_prompts()
RETURNS void AS $$
BEGIN
  -- Grid Trading Bot
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'GridBot', 'Frontend', 1, 'Analyze grid trading bot requirements and strategies', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 2, 'Research automated trading patterns and best practices', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 3, 'Plan implementation of grid trading system', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 4, 'Implement basic grid setup interface', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 5, 'Add strategy configuration and testing', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 6, 'Implement real-time monitoring and controls', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 7, 'Add performance analytics and reporting', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 8, 'Optimize bot execution and reliability', 0, false),
    ('Ubahcrypt', 'GridBot', 'Frontend', 9, 'Review and enhance grid trading features', 0, false);

  -- Copy Trading
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 1, 'Analyze copy trading platform requirements', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 2, 'Research social trading patterns and features', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 3, 'Plan implementation of copy trading system', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 4, 'Implement trader discovery and profiles', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 5, 'Add copy trading setup and management', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 6, 'Implement real-time trade copying', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 7, 'Add performance tracking and analytics', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 8, 'Optimize copy trading reliability', 0, false),
    ('Ubahcrypt', 'CopyTrading', 'Frontend', 9, 'Review and enhance copy trading features', 0, false);

  -- NFT Marketplace
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'NFT', 'Frontend', 1, 'Analyze NFT marketplace requirements', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 2, 'Research NFT trading platform patterns', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 3, 'Plan implementation of NFT marketplace', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 4, 'Implement NFT browsing and details', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 5, 'Add NFT trading functionality', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 6, 'Implement NFT creation and minting', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 7, 'Add collection management features', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 8, 'Optimize NFT loading and display', 0, false),
    ('Ubahcrypt', 'NFT', 'Frontend', 9, 'Review and enhance NFT marketplace', 0, false);

  -- Settings and Security
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Settings', 'Frontend', 1, 'Analyze exchange settings and security requirements', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 2, 'Research crypto platform security best practices', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 3, 'Plan implementation of settings and security features', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 4, 'Implement basic account settings', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 5, 'Add security preferences and controls', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 6, 'Implement API key management', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 7, 'Add notification preferences', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 8, 'Optimize settings organization and UX', 0, false),
    ('Ubahcrypt', 'Settings', 'Frontend', 9, 'Review and enhance settings system', 0, false);

  -- Wallet Management
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Wallet', 'Frontend', 1, 'Analyze crypto wallet integration requirements', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 2, 'Research wallet security and management patterns', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 3, 'Plan implementation of wallet system', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 4, 'Implement basic wallet functionality', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 5, 'Add multi-currency support', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 6, 'Implement transaction management', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 7, 'Add backup and recovery features', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 8, 'Optimize wallet performance and security', 0, false),
    ('Ubahcrypt', 'Wallet', 'Frontend', 9, 'Review and enhance wallet features', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_ubahcrypt_advanced_prompts();

-- Drop the function after execution
DROP FUNCTION populate_ubahcrypt_advanced_prompts(); 