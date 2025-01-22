import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AuthButton = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
        navigate('/profile');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
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

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {user ? (
        <Button
          onClick={handleSignOut}
          disabled={loading}
          variant="destructive"
        >
          Sign Out
        </Button>
      ) : (
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="bg-white text-black hover:bg-gray-100"
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
};