
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Centralized auth state management with debounced profile check
export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // [Analysis] Initialize auth state on mount with debounced check
  useEffect(() => {
    let isSubscribed = true;
    let profileCheckTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isSubscribed) {
          if (session?.user) {
            setUser(session.user);
            // [Analysis] Check profile immediately on session restore
            const profile = await checkProfile(session.user.id);
            if (!profile) {
              console.error('No profile found on session restore');
              await supabase.auth.signOut();
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    // [Analysis] Set up auth state listener with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (isSubscribed) {
        if (session?.user) {
          setUser(session.user);
          // [Analysis] Check profile on auth state change
          if (event === 'SIGNED_IN') {
            const profile = await checkProfile(session.user.id);
            if (!profile) {
              console.error('No profile found after sign in');
              await supabase.auth.signOut();
              setUser(null);
            } else {
              // [Analysis] Navigate to home on successful sign in
              navigate('/home', { replace: true });
            }
          }
        } else {
          setUser(null);
          // [Analysis] Navigate to welcome page on sign out
          navigate('/', { replace: true });
        }
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      isSubscribed = false;
      if (profileCheckTimeout) {
        clearTimeout(profileCheckTimeout);
      }
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkProfile = async (userId: string) => {
    try {
      console.log('Checking profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error checking profile:', error);
        return null;
      }
      console.log('Profile found:', profile);
      return profile;
    } catch (error) {
      console.error('Error in checkProfile:', error);
      return null;
    }
  };

  const handleSignIn = async (session: any) => {
    try {
      console.log('Handling sign in for session:', session);
      setUser(session.user);
      
      // [Analysis] Wait for profile creation with proper timeout
      console.log('Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        console.log('Profile verified, proceeding');
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
        navigate('/home', { replace: true });
        return true;
      } else {
        console.error('Profile not found after waiting');
        throw new Error('Profile creation failed');
      }
    } catch (error) {
      console.error('Error in sign in handler:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: "There was a problem signing you in. Please try again.",
      });
      return false;
    }
  };

  const handleSignOut = async () => {
    console.log('Handling sign out');
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "Come back soon!",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    handleSignIn,
    handleSignOut,
  };
};
