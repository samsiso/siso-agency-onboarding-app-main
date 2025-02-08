
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
  // [Analysis] Add ref to track if this is an actual auth event vs just a check
  const isAuthEvent = useRef(false);
  // [Analysis] Cache profile to prevent repeated checks
  const profileCache = useRef<any>(null);

  // [Analysis] Memoized profile check to prevent unnecessary API calls
  const checkProfile = useCallback(async (userId: string) => {
    // [Analysis] Return cached profile if available
    if (profileCache.current) {
      return profileCache.current;
    }

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
      
      // [Analysis] Cache successful profile checks
      if (profile) {
        profileCache.current = profile;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!isSubscribed) return;

      // [Analysis] Only handle navigation on explicit auth events
      if (event === 'SIGNED_IN') {
        isAuthEvent.current = true;
      }

      if (session?.user) {
        setUser(session.user);
        // [Analysis] Only navigate on explicit sign in
        if (isAuthEvent.current) {
          const profile = await checkProfile(session.user.id);
          if (profile) {
            navigate('/home', { replace: true });
          }
        }
      } else {
        setUser(null);
        // [Analysis] Only redirect on explicit sign out
        if (event === 'SIGNED_OUT') {
          navigate('/', { replace: true });
        }
      }

      // [Analysis] Reset auth event flag after handling
      isAuthEvent.current = false;
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
      isAuthEvent.current = true;
      setUser(session.user);
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        console.log('Profile verified, proceeding to home');
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
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
    } finally {
      isAuthEvent.current = false;
    }
  };

  const handleSignOut = async () => {
    console.log('Handling sign out');
    try {
      isAuthEvent.current = true;
      await supabase.auth.signOut();
      setUser(null);
      profileCache.current = null; // Clear profile cache
      toast({
        title: "Signed out",
        description: "Come back soon!",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });
    } finally {
      isAuthEvent.current = false;
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
