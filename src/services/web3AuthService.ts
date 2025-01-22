import Moralis from 'moralis';
import { supabase } from '@/integrations/supabase/client';

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

    // Convert the result to a JSON-safe object
    const metadataJson = {
      id: result.result.id,
      profileId: result.result.profileId,
      address: result.result.address.toLowerCase(), // Convert EvmAddress to string
      domain: result.result.domain,
      statement: result.result.statement,
      uri: result.result.uri,
      version: result.result.version,
      nonce: result.result.nonce,
      chainId: result.result.chain.hex,
      expirationTime: result.result.expirationTime.toISOString(),
      notBefore: result.result.notBefore.toISOString(),
      resources: result.result.resources
    };

    // Update user profile with Web3 credentials
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          wallet_address: address,
          moralis_provider_id: result.result.profileId,
          web3_metadata: metadataJson
        })
        .eq('id', user.id);

      if (error) throw error;
    }

    return { 
      address, 
      moralisId: result.result.profileId, 
      metadata: metadataJson 
    };
  } catch (error) {
    console.error('Web3 authentication error:', error);
    throw error;
  }
};