import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authenticateWithMetamask } from '@/services/web3AuthService';

export const AuthButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/thank-you`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMetamaskSignIn = async () => {
    try {
      setLoading(true);
      await authenticateWithMetamask();
      navigate('/thank-you');
      toast({
        title: "Success",
        description: "Successfully connected with MetaMask",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect with MetaMask",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhantomSignIn = async () => {
    try {
      setLoading(true);
      // Check if Phantom is installed
      const provider = window?.phantom?.solana;
      
      if (!provider?.isPhantom) {
        throw new Error("Phantom wallet is not installed!");
      }

      // Connect to Phantom
      const { publicKey } = await provider.connect();
      const address = publicKey.toString();

      // Update the user's profile with their Phantom wallet address
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          wallet_address: address,
          moralis_provider_id: 'phantom'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      navigate('/thank-you');
      toast({
        title: "Success",
        description: "Successfully connected with Phantom wallet",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect with Phantom wallet",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="bg-white text-black hover:bg-gray-100"
      >
        Sign in with Google
      </Button>
      <Button
        onClick={handleMetamaskSignIn}
        disabled={loading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect MetaMask
      </Button>
      <Button
        onClick={handlePhantomSignIn}
        disabled={loading}
        variant="outline"
        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white border-none"
      >
        <Wallet className="w-4 h-4" />
        Connect Phantom
      </Button>
    </div>
  );
};