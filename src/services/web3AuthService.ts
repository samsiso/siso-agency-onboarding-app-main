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
    const { message } = await Moralis.Auth.requestMessage({
      address,
      chain: 1, // ETH mainnet
      network: 'evm',
      domain: window.location.host,
      statement: 'Please sign this message to authenticate with SISO Resource Hub.',
    });

    // Request signature
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    // Verify the signature
    const { id: moralisId, profileId, metadata } = await Moralis.Auth.verify({
      message,
      signature,
      networkType: 'evm',
    });

    // Update user profile with Web3 credentials
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          wallet_address: address,
          moralis_provider_id: moralisId,
          web3_metadata: metadata
        })
        .eq('id', user.id);

      if (error) throw error;
    }

    return { address, moralisId, metadata };
  } catch (error) {
    console.error('Web3 authentication error:', error);
    throw error;
  }
};