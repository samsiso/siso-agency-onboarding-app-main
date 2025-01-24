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
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          return;
        }

        console.log('Session check result:', session);
        
        if (session?.user) {
          console.log('Active session found for user:', session.user.id);
          setUser(session.user);
          
          // Check if user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Profile check error:', profileError);
            return;
          }

          console.log('Profile found:', profile);
          navigate('/profile');
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log('Sign in detected, checking profile...');
          
          // Check for existing profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error checking profile after sign in:', profileError);
            return;
          }

          console.log('Profile after sign in:', profile);
          setUser(session.user);
          
          toast({
            title: "Successfully signed in",
            description: "Welcome to SISO Resource Hub!",
          });
          
          // Ensure we're using window.location.origin for the current domain
          const redirectUrl = `${window.location.origin}/profile`;
          console.log('Redirecting to:', redirectUrl);
          navigate('/profile');
        } catch (error) {
          console.error('Error in auth state change handler:', error);
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

      console.log('Google sign in response:', data);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
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