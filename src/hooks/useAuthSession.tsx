
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Complete rewrite of auth session management to fix infinite redirects
// [Plan] Monitor auth state changes and session restoration separately
export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  // [Analysis] Track initialization vs auth events separately
  const isInitialized = useRef(false);
  const isAuthEvent = useRef(false);
  const profileCache = useRef<any>(null);

  // [Analysis] Memoized profile check to prevent unnecessary API calls
  const checkProfile = useCallback(async (userId: string) => {
    if (profileCache.current) {
      return profileCache.current;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error checking profile:', error);
        return null;
      }
      
      if (profile) {
        profileCache.current = profile;
      }
      
      return profile;
    } catch (error) {
      console.error('Error in checkProfile:', error);
      return null;
    }
  }, []);

  // [Analysis] Initialize session state without triggering navigation
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await checkProfile(session.user.id);
          if (profile) {
            setUser(session.user);
          } else {
            await supabase.auth.signOut();
            setUser(null);
          }
        }
        
        isInitialized.current = true;
        setLoading(false);
      } catch (error) {
        console.error('Error initializing session:', error);
        setLoading(false);
      }
    };

    initializeSession();
  }, [checkProfile]);

  // [Analysis] Handle auth state changes separately from initialization
  useEffect(() => {
    if (!isInitialized.current) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN') {
        isAuthEvent.current = true;
        if (session?.user) {
          const profile = await checkProfile(session.user.id);
          if (profile) {
            setUser(session.user);
            // [Fix] Only navigate on explicit sign in, not session restore
            if (!user) {
              navigate('/home', { replace: true });
              toast({
                title: "Successfully signed in",
                description: "Welcome to SISO Resource Hub!",
              });
            }
          } else {
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        isAuthEvent.current = true;
        setUser(null);
        profileCache.current = null;
        navigate('/', { replace: true });
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        // Just update the user without navigation
        if (session?.user) {
          setUser(session.user);
        }
      }
      
      isAuthEvent.current = false;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, checkProfile, toast, user]); // [Fix] Added user dependency to prevent unnecessary navigations

  const handleSignIn = async (session: any) => {
    try {
      console.log('Handling sign in for session:', session);
      isAuthEvent.current = true;
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        setUser(session.user);
        console.log('Profile verified, proceeding to home');
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
      profileCache.current = null;
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
