
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Centralized auth state management with optimized profile checks and caching
export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // [Analysis] Initialize auth state on mount with cached profile check
  useEffect(() => {
    let isSubscribed = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isSubscribed) {
          if (session?.user) {
            setUser(session.user);
            // [Analysis] Only check profile on initial load
            const profile = await checkProfile(session.user.id);
            if (!profile) {
              console.error('No profile found on session restore');
              await supabase.auth.signOut();
              setUser(null);
              navigate('/', { replace: true });
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

    // [Analysis] Set up auth state listener with optimized navigation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!isSubscribed) return;

      if (session?.user) {
        setUser(session.user);
        // [Analysis] Only check profile and navigate on explicit sign in
        if (event === 'SIGNED_IN') {
          const profile = await checkProfile(session.user.id);
          if (!profile) {
            console.error('No profile found after sign in');
            await supabase.auth.signOut();
            setUser(null);
            navigate('/', { replace: true });
          }
        }
      } else {
        setUser(null);
        // [Analysis] Only navigate on explicit sign out
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
