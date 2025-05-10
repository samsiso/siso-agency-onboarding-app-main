import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with custom settings for better error reporting
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: { 'x-application-name': 'siso-agency' },
  },
};

// Create the client and export
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

console.log('Supabase client initialized with URL:', supabaseUrl);
