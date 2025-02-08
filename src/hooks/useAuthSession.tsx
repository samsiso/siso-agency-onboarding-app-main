
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Optimized auth state management with profile caching and preventing redirect loops
export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileChecked = useRef(false);

  // [Analysis] Memoized profile check to prevent unnecessary API calls
  const checkProfile = useCallback(async (userId: string) => {
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
  }, []);

  // [Analysis] Initialize auth state on mount with optimized profile check
  useEffect(() => {
    let isSubscribed = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isSubscribed) return;

        if (session?.user) {
          setUser(session.user);
          // [Analysis] Only check profile once on initial load
          if (!profileChecked.current) {
            profileChecked.current = true;
            const profile = await checkProfile(session.user.id);
            if (!profile) {
              console.error('No profile found during initialization');
              await supabase.auth.signOut();
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    // [Analysis] Set up auth state listener with minimal redirects
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!isSubscribed) return;

      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        // [Analysis] Only redirect on explicit sign out
        if (event === 'SIGNED_OUT') {
          navigate('/', { replace: true });
        }
      }
      setLoading(false);
    });

    initializeAuth();

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate, checkProfile]);

  const handleSignIn = async (session: any) => {
    try {
      console.log('Handling sign in for session:', session);
      setUser(session.user);
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        console.log('Profile verified, proceeding to home');
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
        // [Analysis] Only navigate on successful sign in
        navigate('/home', { replace: true });
        return true;
      } else {
        console.error('Profile not found after sign in');
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
      // [Analysis] Only navigate on explicit sign out
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
