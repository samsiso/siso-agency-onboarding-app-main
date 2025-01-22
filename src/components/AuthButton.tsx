import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const AuthButton = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Only navigate to profile on initial sign in
      if (_event === 'SIGNED_IN' && location.pathname === '/') {
        navigate('/profile');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return 'Invalid credentials or request';
        case 401:
          return 'Unauthorized - please check your login details';
        case 403:
          return 'Access forbidden - please check your permissions';
        case 404:
          return 'User not found';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      const e = error as AuthError;
      console.error('Auth error:', e);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: getErrorMessage(e),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: getErrorMessage(e),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return user ? (
    <Button
      variant="outline"
      className="w-full sm:w-auto border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Logout'}
    </Button>
  ) : (
    <Button
      variant="outline"
      className="w-full sm:w-auto bg-white border-siso-red text-[#121212] hover:bg-siso-red hover:text-white transition-colors"
      onClick={handleLogin}
      disabled={isLoading}
    >
      <Mail className="mr-2 h-4 w-4" />
      {isLoading ? 'Processing...' : 'Login with Gmail'}
    </Button>
  );
};