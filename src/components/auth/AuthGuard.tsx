
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkIsAdmin } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const AuthGuard = ({ children, adminOnly = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthGuard - Checking auth session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthGuard - Session error:', sessionError);
          navigate('/auth', { replace: true });
          return;
        }
        
        if (!session) {
          console.log('AuthGuard - No active session found, redirecting to login');
          navigate('/auth', { replace: true });
          return;
        } 
        
        console.log('AuthGuard - Session found:', session.user.id, session.user.email);
        setIsAuthenticated(true);
        
        // If adminOnly is true, check if the user is an admin
        if (adminOnly) {
          console.log('AuthGuard - Checking admin status for protected route');
          try {
            const adminStatus = await checkIsAdmin();
            console.log('AuthGuard - Admin check result:', adminStatus);
            
            setIsAdmin(adminStatus);
            
            if (!adminStatus) {
              console.log('AuthGuard - Not an admin, redirecting to home');
              toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have admin privileges to access this page."
              });
              navigate('/home', { replace: true });
              return;
            }
          } catch (error) {
            console.error('Error in admin check:', error);
            toast({
              variant: "destructive",
              title: "Access Check Failed",
              description: "There was a problem verifying your access permissions."
            });
            navigate('/home', { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/auth', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthGuard - Auth state change:', event);
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth', { replace: true });
      } else if (event === 'SIGNED_IN' && adminOnly) {
        // Re-check admin status when user signs in
        checkIsAdmin().then(status => {
          setIsAdmin(status);
          if (!status && adminOnly) {
            navigate('/home', { replace: true });
          }
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, adminOnly, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-siso-orange"></div>
    </div>;
  }

  if (adminOnly && !isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
};
