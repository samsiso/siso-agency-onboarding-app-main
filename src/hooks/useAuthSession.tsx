import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthSession = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error checking profile:', error);
      return null;
    }
    return profile;
  };

  const handleSignIn = async (session: any) => {
    try {
      setUser(session.user);
      
      // Wait for profile creation
      console.log('Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile = await checkProfile(session.user.id);
      
      if (profile) {
        console.log('Profile verified, proceeding with redirect');
        toast({
          title: "Successfully signed in",
          description: "Welcome to SISO Resource Hub!",
        });
        navigate('/profile');
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
    }
  };

  const handleSignOut = () => {
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