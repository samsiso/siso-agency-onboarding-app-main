
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
