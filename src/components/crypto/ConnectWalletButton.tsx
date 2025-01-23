import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const ConnectWalletButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const connectPhantom = async () => {
    console.log("[Wallet] Attempting to connect to Phantom");
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      throw new Error("Please install Phantom Wallet");
    }
    
    const response = await solana.connect();
    console.log("[Wallet] Connected to Phantom:", response.publicKey.toString());
    return response.publicKey.toString();
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      console.log("[Wallet] Starting connection process");
      
      // First check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to connect your wallet",
        });
        return;
      }
      
      // Step 1: Connect to Phantom Wallet
      const publicKey = await connectPhantom();
      
      // Step 2: Generate nonce client-side
      const nonce = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      console.log("[Wallet] Generated nonce, inserting into Supabase");
      
      // Step 3: Insert nonce into Supabase
      const { data: nonceData, error: nonceError } = await supabase
        .from('wallet_nonces')
        .insert({
          public_key: publicKey,
          nonce: nonce
        })
        .select()
        .maybeSingle();
      
      if (nonceError || !nonceData) {
        console.error("[Wallet] Nonce error:", nonceError);
        throw new Error("Failed to generate nonce");
      }

      console.log("[Wallet] Nonce stored, requesting signature");

      // Step 4: Sign nonce with Phantom
      const message = new TextEncoder().encode(nonceData.nonce);
      const { signature } = await (window as any).solana.signMessage(message, 'utf8');
      
      console.log("[Wallet] Got signature, verifying via edge function");

      // Step 5: Verify signature via Edge Function
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-wallet-signature', {
        body: { 
          publicKey, 
          signature, 
          nonce: nonceData.nonce 
        },
        headers: {
          'x-user-id': session.user.id
        }
      });
      
      if (verifyError) {
        console.error("[Wallet] Verification error:", verifyError);
        throw verifyError;
      }

      console.log("[Wallet] Connection successful!");

      toast({
        title: "Wallet Connected",
        description: "Your Phantom wallet has been successfully connected!",
      });

    } catch (error: any) {
      console.error("[Wallet] Connection failed:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect} 
      disabled={loading}
      className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Phantom Wallet'
      )}
    </Button>
  );
};