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
    <div className="relative mb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-siso-bg via-siso-bg/95 to-siso-bg/90" />
      <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center">
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-6xl font-bold text-siso-text-bold mb-6 leading-tight">
              {userName ? (
                <>
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                    {userName}
                  </span>
                </>
              ) : (
                <>
                  Welcome to{' '}
                  <div className="relative mt-2 p-4 rounded-lg bg-black/50">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-siso-orange to-siso-red opacity-10" />
                    <div className="relative bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                      SISO Agency Resources
                    </div>
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-siso-orange to-siso-red opacity-20 blur-lg" />
                  </div>
                </>
              )}
            </h1>
          </div>
          <p className="text-xl text-siso-text mb-12 max-w-2xl mx-auto opacity-90">
            Discover the tools to build your own vision. Your gateway to innovation and success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AuthButton />
            <Button 
              variant="outline" 
              className="min-w-[150px] border border-siso-text/20 text-siso-text-bold hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 hover:border-siso-text/40 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};