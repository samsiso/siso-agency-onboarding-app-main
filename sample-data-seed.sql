-- Sample data for testing the AirtablePartnersTable component
-- Insert sample portfolio items based on the HTML data provided

INSERT INTO portfolio_items (
  title,
  client_name,
  live_url,
  client_source,
  project_status,
  user_id,
  created_at,
  updated_at
) VALUES 
  (
    'Gritness',
    'Gym',
    'https://gritnessgym.vercel.app',
    'Personal Network',
    'not_contacted',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'NM Construction',
    'Construction',
    'https://nm-construction.vercel.app',
    'Personal Network',
    'contacted',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'OPTIMAL CONSTRUCTION',
    'Construction',
    'https://optimal-building-co.vercel.app',
    'Personal Network',
    'waiting_client',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'UbahCryp',
    'Web3 Trading',
    'https://ubahcrypcom.vercel.app',
    'Snapchat',
    'feedback_app',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'Elementree',
    'Restaurant',
    'https://elementree.vercel.app',
    'Personal Network',
    'not_contacted',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'Trojan MMA',
    'MMA GYM',
    'https://trojan-mma.vercel.app',
    'Personal Network',
    'not_contacted',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'Lets go',
    'App',
    'https://lets-go-u7hh.vercel.app',
    'Personal Network',
    'feedback_app',
    'placeholder-user-id',
    now(),
    now()
  ),
  (
    'Mu Shin',
    'Self Defense Course',
    'https://siso-mu-shin.vercel.app',
    'Personal Network',
    'declined',
    'placeholder-user-id',
    now(),
    now()
  );