import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Enable REPLICA IDENTITY FULL for the ai_news table
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  await supabaseAdmin.rpc('alter_table_replica_identity', {
    table_name: 'ai_news',
    replica_identity: 'FULL'
  });

  return new Response(
    JSON.stringify({ message: 'Realtime enabled successfully' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});