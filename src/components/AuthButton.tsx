import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { initiateGoogleSignIn, signOut } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from './auth/SocialMediaModal';

export const AuthButton = () => {
  const {
    user,
    setUser,
    loading,
    setLoading,
    handleSignIn,
    handleSignOut
  } = useAuthSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSocialModal, setShowSocialModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log('Checking initial auth session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Initial session check error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          console.log('Initial session found for user:', session.user.id);
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
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          console.log('User signed in, handling sign in...');
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
          
          toast({
            title: "Successfully signed in",
            description: "Welcome to SISO Resource Hub!",
          });
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
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, handling sign out...');
        handleSignOut();
        navigate('/');
        toast({
          title: "Signed out",
          description: "Come back soon!",
        });
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [handleSignIn, handleSignOut, setLoading, toast, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign in...');
      
      const { error } = await initiateGoogleSignIn();
      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "There was a problem signing in with Google",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      setLoading(true);
      console.log('Initiating sign out...');
      
      const { error } = await signOut();
      if (error) throw error;
      
      console.log('Successfully signed out');
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

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100]">
        {user ? (
          <Button
            onClick={handleSignOutClick}
            disabled={loading}
            variant="destructive"
            className="cursor-pointer transition-all duration-200 hover:bg-red-600 hover:scale-105 shadow-lg"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-white text-black hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
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