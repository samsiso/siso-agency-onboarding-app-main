
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // [Analysis] Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setUser(session?.user || null);
      setLoading(false);
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      // Wait for profile creation
      console.log('Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        console.log('Profile verified, proceeding');
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
        // [Analysis] Let user stay on current page after login
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

  const handleSignOut = () => {
    console.log('Handling sign out');
    setUser(null);
    toast({
      title: "Signed out",
      description: "Come back soon!",
    });
    navigate('/');
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
