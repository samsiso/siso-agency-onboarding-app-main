import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { Connection, clusterApiUrl, PublicKey } from "https://esm.sh/@solana/web3.js"
import { Metaplex } from "https://esm.sh/@metaplex-foundation/js"

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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get pending welcome NFT mints
    const { data: pendingMints, error: fetchError } = await supabaseClient
      .from('welcome_nft_mints')
      .select(`
        id,
        user_id,
        profiles:profiles(solana_wallet_address)
      `)
      .eq('status', 'pending')
      .is('completed_at', null)
      .limit(10)

    if (fetchError) throw fetchError

    if (!pendingMints?.length) {
      return new Response(
        JSON.stringify({ message: "No pending mints found" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Solana connection
    const connection = new Connection(clusterApiUrl('devnet'))
    const metaplex = Metaplex.make(connection)

    const results = []
    
    for (const mint of pendingMints) {
      try {
        // Skip if no wallet address
        if (!mint.profiles?.solana_wallet_address) {
          await supabaseClient
            .from('welcome_nft_mints')
            .update({
              status: 'pending',
              error_message: 'No wallet address found'
            })
            .eq('id', mint.id)
          continue
        }

        console.log(`Processing mint for user ${mint.user_id}`)

        // Prepare NFT metadata
        const metadata = {
          name: "SISO Welcome NFT",
          description: "Welcome to SISO Resource Hub!",
          image: "https://your-nft-image-url.com/welcome.png", // Replace with actual image URL
          attributes: [
            {
              trait_type: "Type",
              value: "Welcome"
            },
            {
              trait_type: "Tier",
              value: "Bronze"
            }
          ]
        }

        // Create NFT
        const { nft } = await metaplex.nfts().create({
          uri: JSON.stringify(metadata),
          name: metadata.name,
          sellerFeeBasisPoints: 500, // 5% royalty
        })

        // Update mint status
        await supabaseClient
          .from('welcome_nft_mints')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            metadata: {
              ...metadata,
              mint_address: nft.address.toString()
            }
          })
          .eq('id', mint.id)

        results.push({
          mint_id: mint.id,
          status: 'completed',
          mint_address: nft.address.toString()
        })

      } catch (error) {
        console.error(`Error processing mint ${mint.id}:`, error)
        
        await supabaseClient
          .from('welcome_nft_mints')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', mint.id)

        results.push({
          mint_id: mint.id,
          status: 'failed',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-welcome-nfts:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})