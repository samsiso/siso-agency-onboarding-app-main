
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOnboardingAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status for onboarding flow...");
        const { data: { session } } = await supabase.auth.getSession();
        
        // Allow both authenticated users and guests
        if (session?.user) {
          console.log("User is authenticated:", session.user.id);
          setUserId(session.user.id);
        } else {
          // For guest users, set userId to null but don't redirect
          console.log("Guest user accessing onboarding flow");
          setUserId(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't redirect on error, just set userId to null
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { userId, isLoading };
};
