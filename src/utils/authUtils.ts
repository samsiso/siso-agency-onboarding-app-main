
import { supabase } from '@/integrations/supabase/client';

export const signOut = async () => {
  // Clear session data on sign out
  localStorage.removeItem('siso-auth-token');
  return await supabase.auth.signOut();
};

// Enhanced auth callback handler with onboarding flow
export const handleAuthCallback = async () => {
  console.log('Handling auth callback...');
  try {
    const params = new URLSearchParams(window.location.hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      console.log('Access token found in URL');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        throw error;
      }
      
      if (session) {
        console.log('Valid session found, checking onboarding status');
        
        // Check onboarding status using safe property checks
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Using safer access pattern with direct property check
        const hasCompletedOnboarding = profile && profile.onboarding_completed === true;
          
        if (!hasCompletedOnboarding) {
          console.log('Redirecting to social onboarding...');
          window.location.replace('/onboarding/social');
        } else {
          console.log('Onboarding completed, redirecting to profile');
          window.location.replace('/profile');
        }
      } else {
        console.log('No session found after callback');
        window.location.replace('/?error=no_session');
      }
    }
  } catch (error) {
    console.error('Error in auth callback:', error);
    window.location.replace('/?error=auth_callback_failed');
  }
};
