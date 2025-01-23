import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Wallet } from 'lucide-react';

export const ConnectWalletButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("[Wallet] Attempting to connect to Phantom");
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        throw new Error("Please install Phantom Wallet");
      }
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session) {
        throw new Error("Please sign in to connect your wallet");
      }

      // Connect to Phantom wallet
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      console.log("[Wallet] Connected to wallet:", publicKey);

      // Get a nonce
      const { data: nonce, error: nonceError } = await supabase
        .from('wallet_nonces')
        .insert({ public_key: publicKey })
        .select()
        .single();

      if (nonceError) throw nonceError;
      console.log("[Wallet] Generated nonce:", nonce);

      // Sign the nonce
      const encodedMessage = new TextEncoder().encode(nonce.nonce);
      const signedMessage = await solana.signMessage(encodedMessage, "utf8");
      console.log("[Wallet] Signed message:", signedMessage);

      // Verify the signature
      const { error: verifyError } = await supabase.functions.invoke(
        'verify-wallet-signature',
        {
          body: {
            publicKey,
            signature: signedMessage.signature,
            nonce: nonce.nonce,
            userId: session.user.id
          }
        }
      );

      if (verifyError) throw verifyError;

      // Update the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          solana_wallet_address: publicKey,
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Wallet connected successfully",
      });

      console.log("[Wallet] Connection process completed successfully");
    } catch (error: any) {
      console.error("[Wallet] Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
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
      className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-colors duration-300 hover:scale-105"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Phantom Wallet
        </>
      )}
    </Button>
  );
};