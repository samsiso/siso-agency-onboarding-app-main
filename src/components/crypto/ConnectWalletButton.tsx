
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Connection, Ed25519Keypair, PublicKey } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';

interface ConnectWalletButtonProps {
  className?: string;
}

export const ConnectWalletButton = ({ className }: ConnectWalletButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check if user has already connected a wallet
  const checkExistingWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('solana_wallet_address')
        .eq('id', user.id)
        .single();
        
      if (data && data.solana_wallet_address) {
        setWalletAddress(data.solana_wallet_address);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
    }
  };

  // Call checkExistingWallet on component mount
  useState(() => {
    checkExistingWallet();
  });

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to connect your wallet.",
        });
        return;
      }

      // Generate a random nonce for the user to sign
      const nonce = crypto.randomUUID();
      
      // Store the nonce in the database
      await supabase
        .from('wallet_nonces')
        .insert({
          user_id: session.user.id,
          public_key: 'pending', // Will be updated after wallet connection
          nonce: nonce,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        });

      // Request wallet signature (mock implementation for now)
      const mockSignature = "mock-signature";
      const mockPublicKey = "mock-public-key";
      
      // Verify the signature using Supabase edge function
      const { data, error } = await supabase.functions.invoke('verify-wallet-signature', {
        body: {
          publicKey: mockPublicKey,
          signature: mockSignature,
          nonce: nonce,
        },
        headers: {
          'x-user-id': session.user.id,
        },
      });

      if (error) throw error;
      
      // Update wallet address in state
      setWalletAddress(mockPublicKey);
      
      // Update profile with wallet address
      await supabase
        .from('profiles')
        .update({ 
          solana_wallet_address: mockPublicKey 
        })
        .eq('id', session.user.id);

      toast({
        title: "Wallet Connected",
        description: `Your wallet has been successfully connected.`,
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update profile to remove wallet address
      await supabase
        .from('profiles')
        .update({ solana_wallet_address: null })
        .eq('id', session.user.id);

      setWalletAddress(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      toast({
        variant: "destructive",
        title: "Disconnect Error",
        description: error.message || "Failed to disconnect wallet.",
      });
    }
  };

  return (
    <>
      {walletAddress ? (
        <Button
          variant="outline"
          className={className}
          onClick={disconnectWallet}
        >
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)} (Disconnect)
        </Button>
      ) : (
        <Button
          variant="default"
          className={className}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </>
  );
};
