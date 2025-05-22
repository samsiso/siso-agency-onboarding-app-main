-- Function to populate user features and educational prompts for Ubahcrypt
CREATE OR REPLACE FUNCTION populate_ubahcrypt_user_prompts()
RETURNS void AS $$
BEGIN
  -- Authentication
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Auth', 'Frontend', 1, 'Analyze cryptocurrency exchange authentication requirements', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 2, 'Research secure authentication patterns for crypto platforms', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 3, 'Plan implementation of secure authentication system', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 4, 'Implement core authentication flows', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 5, 'Add 2FA and advanced security features', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 6, 'Implement KYC integration', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 7, 'Add session management and security alerts', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 8, 'Optimize authentication performance and UX', 0, false),
    ('Ubahcrypt', 'Auth', 'Frontend', 9, 'Review and enhance security measures', 0, false);

  -- Education Center
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Education', 'Frontend', 1, 'Analyze cryptocurrency education platform requirements', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 2, 'Research effective crypto education delivery methods', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 3, 'Plan implementation of educational content system', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 4, 'Implement basic course structure and content display', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 5, 'Add interactive learning tools and quizzes', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 6, 'Implement progress tracking and achievements', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 7, 'Add community learning features', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 8, 'Optimize content delivery and engagement', 0, false),
    ('Ubahcrypt', 'Education', 'Frontend', 9, 'Review and enhance educational experience', 0, false);

  -- Community Hub
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'Community', 'Frontend', 1, 'Analyze crypto community platform requirements', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 2, 'Research community engagement patterns for crypto platforms', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 3, 'Plan implementation of community features', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 4, 'Implement discussion forums and posts', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 5, 'Add user profiles and reputation system', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 6, 'Implement content moderation tools', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 7, 'Add community events and activities', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 8, 'Optimize community engagement features', 0, false),
    ('Ubahcrypt', 'Community', 'Frontend', 9, 'Review and enhance community experience', 0, false);

  -- News and Updates
  INSERT INTO project_prompts (project, page, domain, prompt_cycle_number, prompt, times_used, is_done)
  VALUES
    ('Ubahcrypt', 'News', 'Frontend', 1, 'Analyze crypto news aggregation requirements', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 2, 'Research crypto news presentation patterns', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 3, 'Plan implementation of news delivery system', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 4, 'Implement news feed and categories', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 5, 'Add personalized news preferences', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 6, 'Implement real-time news updates', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 7, 'Add news alerts and notifications', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 8, 'Optimize news delivery performance', 0, false),
    ('Ubahcrypt', 'News', 'Frontend', 9, 'Review and enhance news experience', 0, false);

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT populate_ubahcrypt_user_prompts();

-- Drop the function after execution
DROP FUNCTION populate_ubahcrypt_user_prompts(); 