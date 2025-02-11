
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { initiateGoogleSignIn, signOut } from '@/utils/authUtils';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign in...');
      
      const { error, data } = await initiateGoogleSignIn();
      
      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }

      // If we have data.session, it means the user was already signed in
      if (data?.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_step')
          .eq('id', data.session.user.id)
          .single();

        // Redirect based on onboarding status
        if (!profile?.onboarding_completed) {
          navigate('/onboarding/social');
        } else {
          navigate('/profile');
        }
      }

      // If no session, the auth flow will continue in the browser
      return data;

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "There was a problem signing in with Google",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log('Initiating sign out...');
      
      const { error } = await signOut();
      if (error) throw error;
      
      navigate('/');
      toast({
        title: "Signed out",
        description: "Come back soon!",
      });
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

  return {
    loading,
    handleGoogleSignIn,
    handleSignOut
  };
};
