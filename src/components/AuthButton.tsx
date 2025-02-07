
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import { SocialMediaModal } from './auth/SocialMediaModal';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

const AuthButton = () => {
  const { user, setUser, loading, setLoading, handleSignIn } = useAuthSession();
  const { handleSignOut } = useGoogleAuth();
  const [showSocialModal, setShowSocialModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthButton mounted');
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

  const handleAuthClick = () => {
    console.log('Auth button clicked');
    navigate('/auth');
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      {user ? (
        <Button
          onClick={handleSignOut}
          disabled={loading}
          variant="outline"
          className="bg-white/10 text-white hover:bg-white/20 active:bg-white/30 backdrop-blur-sm 
            border border-white/20 shadow-lg shadow-black/5 transition-all duration-300
            hover:scale-105 hover:shadow-xl hover:border-white/30"
        >
          Sign Out
        </Button>
      ) : (
        <Button 
          onClick={handleAuthClick}
          disabled={loading}
          className="bg-white/90 text-black hover:bg-white active:bg-white/80 backdrop-blur-sm
            border border-white/20 shadow-lg shadow-black/5 transition-all duration-300
            hover:scale-105 hover:shadow-xl hover:border-white/30 font-medium
            animate-fade-in"
        >
          Sign In
        </Button>
      )}
      
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
    </div>
  );
};

export default AuthButton;
