import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { initiateGoogleSignIn, signOut } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';

export const AuthButton = () => {
  const {
    user,
    setUser,
    loading,
    setLoading,
    handleSignIn,
    handleSignOut
  } = useAuthSession();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Initial session check error:', sessionError);
          return;
        }

        if (session?.user) {
          console.log('Initial session found for user:', session.user.id);
          handleSignIn(session);
        }
      } catch (error) {
        console.error('Error in initial auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        await handleSignIn(session);
      } else if (event === 'SIGNED_OUT') {
        handleSignOut();
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [handleSignIn, handleSignOut, setLoading]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign in...');
      
      const { error } = await initiateGoogleSignIn();
      if (error) throw error;

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "There was a problem signing in with Google",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      setLoading(true);
      console.log('Initiating sign out...');
      
      const { error } = await signOut();
      if (error) throw error;
      
      console.log('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "There was a problem signing out",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {user ? (
        <Button
          onClick={handleSignOutClick}
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