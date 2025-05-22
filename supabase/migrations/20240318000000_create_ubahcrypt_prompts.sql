-- Function to populate core trading and market prompts for Ubahcrypt
CREATE OR REPLACE FUNCTION populate_ubahcrypt_core_prompts()
RETURNS void AS $$
BEGIN
  -- Markets Overview
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Markets', 'Frontend', 1, 'Analyze current cryptocurrency market overview interface and data visualization needs', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 2, 'Research modern crypto market data presentation patterns and real-time updates', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 3, 'Plan implementation of comprehensive market data display', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 4, 'Implement core market list with essential price data', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 5, 'Add advanced filtering and market pair categorization', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 6, 'Implement real-time price updates and websocket integration', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 7, 'Add market statistics and trend indicators', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 8, 'Optimize performance for large market datasets', 0, false),
    ('Ubahcrypt', 'Markets', 'Frontend', 9, 'Review and enhance market data visualization', 0, false);

  -- Trading Interface
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Trade', 'Frontend', 1, 'Analyze trading interface requirements and order types needed', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 2, 'Research professional trading platform UX patterns', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 3, 'Plan implementation of comprehensive trading interface', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 4, 'Implement basic order entry form and order book', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 5, 'Add advanced order types and trading tools', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 6, 'Implement real-time order updates and execution', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 7, 'Add trading history and position management', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 8, 'Optimize order execution and confirmation flow', 0, false),
    ('Ubahcrypt', 'Trade', 'Frontend', 9, 'Review and enhance trading experience', 0, false);

  -- Portfolio Management
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Portfolio', 'Frontend', 1, 'Analyze portfolio tracking and management requirements', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 2, 'Research portfolio analytics and visualization best practices', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 3, 'Plan implementation of comprehensive portfolio system', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 4, 'Implement basic portfolio overview and holdings', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 5, 'Add performance tracking and analytics', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 6, 'Implement portfolio diversification tools', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 7, 'Add tax reporting and transaction history', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 8, 'Optimize portfolio calculations and updates', 0, false),
    ('Ubahcrypt', 'Portfolio', 'Frontend', 9, 'Review and enhance portfolio management', 0, false);

  -- Derivatives Trading
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Derivatives', 'Frontend', 1, 'Analyze derivatives trading interface requirements', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 2, 'Research futures and options trading platform patterns', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 3, 'Plan implementation of derivatives trading system', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 4, 'Implement futures contract trading interface', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 5, 'Add leverage and margin trading features', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 6, 'Implement risk management tools', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 7, 'Add advanced derivatives analytics', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 8, 'Optimize derivatives trading performance', 0, false),
    ('Ubahcrypt', 'Derivatives', 'Frontend', 9, 'Review and enhance derivatives trading', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_ubahcrypt_core_prompts();

-- Drop the function after execution
DROP FUNCTION populate_ubahcrypt_core_prompts(); 