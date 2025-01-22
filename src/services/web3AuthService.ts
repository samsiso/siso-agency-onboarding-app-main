import Moralis from 'moralis';
import { supabase } from '@/integrations/supabase/client';

interface AuthResult {
  id: string;
  profileId: string;
  address: {
    lowercase: () => string;
  };
  domain: string;
  statement: string;
  uri: string;
  version: string;
  nonce: string;
  chain: {
    id: number;
    hex: string;
  };
  expirationTime: Date;
  notBefore: Date;
  resources: string[];
}

export const initializeMoralis = async () => {
  if (!process.env.MORALIS_API_KEY) {
    throw new Error('Moralis API key not configured');
  }
  
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
};

export const authenticateWithMetamask = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];

    // Get the message to sign
    const response = await Moralis.Auth.requestMessage({
      address,
      chain: 1, // ETH mainnet
      networkType: 'evm',
      domain: window.location.host,
      statement: 'Please sign this message to authenticate with SISO Resource Hub.',
      uri: window.location.origin,
      timeout: 60,
    });

    // Request signature
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [response.raw.message, address],
    });

    // Verify the signature
    const result = await Moralis.Auth.verify({
      networkType: 'evm',
      message: response.raw.message,
      signature,
    });

    const authResult = result.result as AuthResult;

    // Convert the result to a JSON-safe object
    const metadataJson = {
      id: authResult.id,
      profileId: authResult.profileId,
      address: authResult.address.lowercase(),
      domain: authResult.domain,
      statement: authResult.statement,
      uri: authResult.uri,
      version: authResult.version,
      nonce: authResult.nonce,
      chainId: authResult.chain.hex,
      expirationTime: authResult.expirationTime.toISOString(),
      notBefore: authResult.notBefore.toISOString(),
      resources: authResult.resources
    };

    // Update user profile with Web3 credentials
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // First, create or update web3_users entry
      const { error: web3Error } = await supabase
        .from('web3_users')
        .upsert({
          id: user.id,
          moralis_provider_id: authResult.profileId,
          wallet_address: address,
          metadata: metadataJson
        }, {
          onConflict: 'id'
        });

      if (web3Error) throw web3Error;

      // Then, update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          wallet_address: address,
          moralis_provider_id: authResult.profileId,
          web3_metadata: metadataJson
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
    }

    return { 
      address, 
      moralisId: authResult.profileId, 
      metadata: metadataJson 
    };
  } catch (error) {
    console.error('Web3 authentication error:', error);
    throw error;
  }
};