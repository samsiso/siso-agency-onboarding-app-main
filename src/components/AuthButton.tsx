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
          setUser(session.user);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Profile check error:', profileError);
            return;
          }

          if (profile) {
            console.log('Profile exists, redirecting to profile page');
            navigate('/profile');
          }
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
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          setUser(session.user);
          
          // Wait for profile to be created by trigger
          console.log('Waiting for profile creation...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verify profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error checking profile after sign in:', profileError);
            return;
          }

          if (profile) {
            console.log('Profile verified, proceeding with redirect');
            toast({
              title: "Successfully signed in",
              description: "Welcome to SISO Resource Hub!",
            });
            navigate('/profile');
          } else {
            console.error('Profile not found after waiting');
          }
        } catch (error) {
          console.error('Error in sign in handler:', error);
          toast({
            variant: "destructive",
            title: "Error signing in",
            description: "There was a problem signing you in. Please try again.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Sign out detected');
        setUser(null);
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
        navigate('/');
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }

      console.log('Google sign in initiated:', data);
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

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log('Initiating sign out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Successfully signed out');
      navigate('/');
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