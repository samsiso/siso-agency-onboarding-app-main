import { supabase } from '@/integrations/supabase/client';

export const initiateGoogleSignIn = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/profile`,
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