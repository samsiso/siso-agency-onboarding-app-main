import { supabase } from '@/integrations/supabase/client';

export const initiateGoogleSignIn = async () => {
  const currentUrl = window.location.origin;
  console.log('Current origin:', currentUrl);
  
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${currentUrl}/api/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};