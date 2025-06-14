import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PartnerAuthGuardProps {
  children: React.ReactNode;
}

export const PartnerAuthGuard = ({ children }: PartnerAuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkPartnerAuth = async () => {
      try {
        console.log('PartnerAuthGuard - Checking partner auth session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('PartnerAuthGuard - Session error:', sessionError);
          navigate('/auth/login', { 
            replace: true,
            state: { from: location.pathname }
          });
          return;
        }
        
        if (!session) {
          console.log('PartnerAuthGuard - No active session found, redirecting to partner login');
          toast({
            title: "Authentication Required",
            description: "Please log in to access the partner dashboard."
          });
          navigate('/auth/login', { 
            replace: true,
            state: { from: location.pathname }
          });
          return;
        } 
        
        console.log('PartnerAuthGuard - Partner session found:', session.user.id, session.user.email);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Partner auth check error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem verifying your authentication."
        });
        navigate('/auth/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkPartnerAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('PartnerAuthGuard - Auth state change:', event);
      if (event === 'SIGNED_OUT' || !session) {
        toast({
          title: "Session Ended",
          description: "You have been logged out."
        });
        navigate('/auth/login', { replace: true });
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}; 