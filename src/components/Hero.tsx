import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

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
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-24">
        <div className="text-center">
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-siso-text-bold mb-4 sm:mb-6 leading-tight">
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
                  <div className="relative mt-2 p-2 sm:p-4 rounded-lg bg-black/50">
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
          <p className="text-lg sm:text-xl text-siso-text mb-8 sm:mb-12 max-w-2xl mx-auto opacity-90 px-4">
            Your gateway to tools, education, networking, and AI-powered innovation—crafted to help your agency thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-12">
            <AuthButton />
            <Button 
              variant="outline" 
              className="w-full sm:w-auto min-w-[150px] border border-siso-text/20 text-siso-text-bold hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 hover:border-siso-text/40 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="glow-card">
              <h2 className="text-2xl font-bold text-siso-text-bold mb-6 bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                Resource Hub Guide
              </h2>
              <ScrollArea className="h-[400px] rounded-md">
                <div className="space-y-8 text-left px-4">
                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">🔧 Core Tools & Platforms</h3>
                    <p className="text-sm text-siso-text/90">Access our curated list of daily tools, complete with how-to videos and integration guides.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">📚 SISO Education Hub</h3>
                    <p className="text-sm text-siso-text/90">Learn from top educators and creators, with access to valuable templates and workflows.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">🌐 SISO Networking</h3>
                    <p className="text-sm text-siso-text/90">Connect with professional communities and experts to accelerate your growth.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">🤖 SISO Automations</h3>
                    <p className="text-sm text-siso-text/90">Leverage our custom-built automations for client management, lead generation, and workflows.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">💬 ChatGPT Assistants</h3>
                    <p className="text-sm text-siso-text/90">Get AI-powered guidance tailored to your specific needs and challenges.</p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">🧠 SISO AI</h3>
                    <p className="text-sm text-siso-text/90">Receive personalized recommendations from your AI consultant based on your business context.</p>
                  </section>

                  <section className="border-t border-siso-text/10 pt-6">
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">Why Choose SISO Resource Hub?</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-siso-text/90">
                      <li>Built and tested by industry experts</li>
                      <li>Regularly updated with latest tools and insights</li>
                      <li>Free access to valuable automations and content</li>
                    </ul>
                  </section>

                  <section className="border-t border-siso-text/10 pt-6">
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">Get Started Today</h3>
                    <p className="text-sm text-siso-text/90">Begin with Core Tools & Platforms, explore the Education Hub, and leverage our Networking and Automations sections to scale your agency effectively.</p>
                  </section>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};