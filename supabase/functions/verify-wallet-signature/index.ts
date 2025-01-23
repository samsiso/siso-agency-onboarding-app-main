import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import * as ed from 'https://deno.land/x/ed25519@1.6.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { publicKey, signature, nonce } = await req.json()
    
    // Validate input
    if (!publicKey || !signature || !nonce) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify nonce exists and hasn't expired
    const { data: storedNonce, error: nonceError } = await supabaseClient
      .from('wallet_nonces')
      .select('*')
      .eq('public_key', publicKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (nonceError || !storedNonce) {
      console.error('Nonce verification failed:', nonceError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired nonce' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify signature
    const message = new TextEncoder().encode(storedNonce.nonce)
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'hex'))
    const publicKeyBytes = new Uint8Array(Buffer.from(publicKey, 'hex'))

    const isValid = ed.verify(signatureBytes, message, publicKeyBytes)

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user profile with wallet address
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ solana_wallet_address: publicKey })
      .eq('id', req.headers.get('x-user-id'))

    if (updateError) {
      console.error('Profile update failed:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete used nonce
    await supabaseClient
      .from('wallet_nonces')
      .delete()
      .eq('id', storedNonce.id)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})