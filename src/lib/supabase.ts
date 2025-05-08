import { createClient } from '@supabase/supabase-js'

// Use environment variables or fallback to hardcoded values for demo
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUxODcxNjEsImV4cCI6MjAwMDc2MzE2MX0.o_S5XvxL7WLjzfO4e_ld_FKhWZGjbJGfCqQULPFjH20'; // Demo key for example only

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
