import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Connection, PublicKey } from "npm:@solana/web3.js"

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
    const { walletAddress } = await req.json()
    
    if (!walletAddress) {
      throw new Error('Wallet address is required')
    }

    // Connect to Solana devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    const owner = new PublicKey(walletAddress)

    // Fetch token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    })

    // Filter for NFTs (tokens with decimals = 0 and amount = 1)
    const nfts = tokenAccounts.value
      .filter(account => {
        const parsedInfo = account.account.data.parsed.info
        return parsedInfo.tokenAmount.decimals === 0 && 
               parsedInfo.tokenAmount.amount === '1'
      })
      .map(account => ({
        mint: account.account.data.parsed.info.mint,
        name: 'NFT', // You would typically fetch metadata for the real name
        symbol: 'NFT',
        uri: 'https://placeholder.com/nft.png' // You would typically fetch metadata for the real URI
      }))

    return new Response(
      JSON.stringify(nfts),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})