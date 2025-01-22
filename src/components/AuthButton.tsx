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

  return (
    <div className="flex gap-2">
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
        Connect Wallet
      </Button>
    </div>
  );
};