import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    console.log("[Edge] Received request with:", { publicKey, nonce, signatureLength: signature?.length })
    
    // Validate input
    if (!publicKey || !signature || !nonce) {
      console.error("[Edge] Missing required fields:", { publicKey, signature, nonce })
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

    console.log("[Edge] Verifying nonce existence")

    // Verify nonce exists and hasn't expired
    const { data: storedNonce, error: nonceError } = await supabaseClient
      .from('wallet_nonces')
      .select('*')
      .eq('public_key', publicKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (nonceError) {
      console.error('[Edge] Database error when fetching nonce:', nonceError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!storedNonce) {
      console.error('[Edge] No valid nonce found for:', publicKey)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired nonce' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("[Edge] Verifying signature")

    // Verify signature using native crypto
    try {
      const signatureBytes = new Uint8Array(Buffer.from(signature, 'hex'))
      const messageBytes = new TextEncoder().encode(storedNonce.nonce)
      const publicKeyBytes = new Uint8Array(Buffer.from(publicKey, 'hex'))

      const key = await crypto.subtle.importKey(
        'raw',
        publicKeyBytes,
        {
          name: 'Ed25519',
          namedCurve: 'Ed25519'
        },
        false,
        ['verify']
      )

      const isValid = await crypto.subtle.verify(
        'Ed25519',
        key,
        signatureBytes,
        messageBytes
      )

      if (!isValid) {
        console.error('[Edge] Invalid signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (verifyError) {
      console.error('[Edge] Signature verification failed:', verifyError)
      return new Response(
        JSON.stringify({ error: 'Signature verification failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("[Edge] Updating user profile")

    // Update user profile with wallet address
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ solana_wallet_address: publicKey })
      .eq('id', req.headers.get('x-user-id'))

    if (updateError) {
      console.error('[Edge] Profile update failed:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("[Edge] Deleting used nonce")

    // Delete used nonce
    await supabaseClient
      .from('wallet_nonces')
      .delete()
      .eq('id', storedNonce.id)

    console.log("[Edge] Success!")

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[Edge] Verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})