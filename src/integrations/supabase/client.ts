
import { createClient } from '@supabase/supabase-js';

// These are public keys that are safe to expose in client-side code
const SUPABASE_URL = "https://avdgyrepwrvsvwgxrccr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU";

// Create a Supabase client with minimal setup for the landing page
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
