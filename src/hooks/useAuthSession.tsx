
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  // Track initialization vs auth events separately
  const isInitialized = useRef(false);
  const profileCache = useRef<any>(null);

  // Memoized profile check to prevent unnecessary API calls
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

  // Initialize session state without triggering navigation
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('Initializing auth session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          setUser(session.user);
        } else {
          console.log('No active session found');
          setUser(null);
        }
        
        isInitialized.current = true;
        setLoading(false);
      } catch (error) {
        console.error('Error initializing session:', error);
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Handle auth state changes separately from initialization
  useEffect(() => {
    if (!isInitialized.current) return;

    console.log('Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          // Only navigate on explicit sign in, not session restore
          toast({
            title: "Successfully signed in",
            description: "Welcome to SISO Resource Hub!",
          });
        }
      } else if (event === 'SIGNED_OUT') {
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
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSignOut = async () => {
    console.log('Handling sign out');
    try {
      await supabase.auth.signOut();
      setUser(null);
      profileCache.current = null;
      toast({
        title: "Signed out",
        description: "Come back soon!",
      });
      navigate('/');
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
    loading,
    handleSignOut,
  };
};
