import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import { SocialMediaModal } from './auth/SocialMediaModal';
import { GoogleSignInButton } from './auth/GoogleSignInButton';
import { SignOutButton } from './auth/SignOutButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export const AuthButton = () => {
  const { user, setUser, loading, setLoading, handleSignIn } = useAuthSession();
  const { handleGoogleSignIn, handleSignOut } = useGoogleAuth();
  const [showSocialModal, setShowSocialModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          await handleSignIn(session);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_completed_social_info')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile && !profile.has_completed_social_info) {
            setShowSocialModal(true);
          }
        }
      } catch (error) {
        console.error('Error in initial auth check:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your session. Please try logging in again.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          setLoading(true);
          await handleSignIn(session);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('has_completed_social_info')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile && !profile.has_completed_social_info) {
            setShowSocialModal(true);
          } else {
            navigate('/profile');
          }
        } catch (error) {
          console.error('Error handling sign in:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem completing your sign in.",
          });
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSignIn, setLoading, toast, navigate]);

  return (
    <>
      <div className="relative z-50">
        {user ? (
          <SignOutButton onClick={handleSignOut} disabled={loading} />
        ) : (
          <GoogleSignInButton onClick={handleGoogleSignIn} disabled={loading} />
        )}
      </div>
      
      {user && showSocialModal && (
        <SocialMediaModal
          isOpen={showSocialModal}
          onClose={() => {
            setShowSocialModal(false);
            navigate('/profile');
          }}
          userId={user.id}
        />
      )}
    </>
  );
};