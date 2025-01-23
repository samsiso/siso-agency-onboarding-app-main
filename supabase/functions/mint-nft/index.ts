import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Connection, clusterApiUrl, PublicKey } from 'https://esm.sh/@solana/web3.js'
import { Metaplex } from 'https://esm.sh/@metaplex-foundation/js'

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
    const { userPublicKey, nftMetadata, userId } = await req.json()
    console.log("[Edge] Received request with:", { userPublicKey, userId })
    
    // Validate input
    if (!userPublicKey || !nftMetadata || !userId) {
      console.error("[Edge] Missing required fields")
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

    // Initialize Solana connection
    const connection = new Connection(clusterApiUrl('devnet'))
    const metaplex = Metaplex.make(connection)

    console.log("[Edge] Creating NFT with metadata:", nftMetadata)

    // Create NFT
    const { nft } = await metaplex.nfts().create({
      uri: nftMetadata.uri,
      name: nftMetadata.name,
      sellerFeeBasisPoints: 500, // 5% royalty
    })

    console.log("[Edge] NFT created:", nft.address.toString())

    // Store NFT in database
    const { error: insertError } = await supabaseClient
      .from('nfts')
      .insert({
        mint_address: nft.address.toString(),
        owner_id: userId,
        metadata: nftMetadata
      })

    if (insertError) {
      console.error('[Edge] Database error:', insertError)
      throw insertError
    }

    console.log("[Edge] NFT stored in database")

    return new Response(
      JSON.stringify({ 
        success: true,
        mintAddress: nft.address.toString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[Edge] Minting error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})