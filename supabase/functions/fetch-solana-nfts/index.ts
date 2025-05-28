import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Connection, PublicKey } from "npm:@solana/web3.js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Solana NFT fetch function starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { walletAddress } = await req.json()
    console.log("Fetching NFTs for wallet:", walletAddress)

    if (!walletAddress) {
      throw new Error("Wallet address is required")
    }

    // Connect to Solana
    const connection = new Connection("https://api.mainnet-beta.solana.com")
    const owner = new PublicKey(walletAddress)

    // For now, return mock data
    // In a production environment, you would use the Metaplex SDK to fetch real NFTs
    const mockNFTs = [
      {
        name: "Sample NFT #1",
        image: "https://via.placeholder.com/300",
        description: "This is a sample NFT"
      },
      {
        name: "Sample NFT #2",
        image: "https://via.placeholder.com/300",
        description: "Another sample NFT"
      }
    ]

    console.log("Returning mock NFTs for development")

    return new Response(
      JSON.stringify(mockNFTs),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error("Error in fetch-solana-nfts function:", error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})