import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';

export const Hero = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        
        setUserName(profile?.full_name || session.user.email?.split('@')[0]);
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative mb-12 p-8 rounded-xl bg-gradient-to-br from-siso-bg/50 to-siso-bg/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-bold text-siso-text-bold mb-8 leading-tight">
          {userName ? (
            <>
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text animate-glow">
                {userName}
              </span>
            </>
          ) : (
            <>
              Welcome to
              <span className="block bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text animate-glow">
                SISO Agency Resources
              </span>
            </>
          )}
        </h1>
        <p className="text-xl text-siso-text mb-12 max-w-2xl">
          Discover the tools to build your own vision. Your gateway to innovation and success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <AuthButton />
          <Button 
            variant="outline" 
            className="border-2 border-siso-text/20 text-siso-text-bold hover:bg-siso-text/5 hover:border-siso-text/40 transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};