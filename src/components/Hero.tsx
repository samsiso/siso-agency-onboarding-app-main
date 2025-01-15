import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';
import { supabase } from '@/integrations/supabase/client';

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
    <div className="relative mb-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-siso-text-bold mb-6">
          {userName ? (
            <>
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                {userName}
              </span>
            </>
          ) : (
            <>
              Welcome to
              <span className="block bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                SISO Agency Resources
              </span>
            </>
          )}
        </h1>
        <p className="text-xl text-siso-text mb-8">
          Discover the tools to build your own vision. Your gateway to innovation and success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <AuthButton />
          <button className="px-8 py-3 border border-siso-text/20 text-siso-text-bold rounded-lg font-medium hover:bg-siso-text/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};