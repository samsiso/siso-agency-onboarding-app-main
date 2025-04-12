
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the current path is a plan path which should be publicly accessible
        const isPlanPath = location.pathname.startsWith('/plan/');
        
        if (isPlanPath) {
          console.log('Plan path detected, allowing public access');
          setIsLoading(false);
          return; // Allow access to plan paths without authentication
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found, redirecting to login');
          navigate('/auth', { replace: true });
        } else {
          console.log('Session found:', session.user.id);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!location.pathname.startsWith('/plan/')) {
          navigate('/auth', { replace: true });
        } else {
          // Even if there's an error checking auth, we should still allow access to plan paths
          setIsLoading(false);
        }
      } finally {
        // Make sure we set loading to false for plan paths
        if (location.pathname.startsWith('/plan/')) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      // Don't redirect if on plan path
      if ((event === 'SIGNED_OUT' || !session) && !location.pathname.startsWith('/plan/')) {
        navigate('/auth', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Always render children for plan paths immediately without loading state
  if (location.pathname.startsWith('/plan/')) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-siso-orange"></div>
    </div>;
  }

  return <>{children}</>;
};
