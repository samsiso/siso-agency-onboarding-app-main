import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthError } from '@supabase/supabase-js';

export const AuthButton = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: e.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: e.message,
      });
    }
  };

  return user ? (
    <Button
      variant="outline"
      className="border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors"
      onClick={handleLogout}
    >
      Logout
    </Button>
  ) : (
    <Button
      variant="outline"
      className="bg-white border-siso-red text-[#121212] hover:bg-siso-red hover:text-white transition-colors"
      onClick={handleLogin}
    >
      <Mail className="mr-2 h-4 w-4" />
      Login with Gmail
    </Button>
  );
};