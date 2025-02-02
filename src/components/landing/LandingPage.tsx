import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TierSection } from './TierSection';
import { TestimonialSection } from './TestimonialSection';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';
import { ScrollNav } from '@/components/ui/scroll-nav';

export const LandingPage = () => {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('LandingPage mounted');
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSignInClick = () => {
    console.log('Sign in button clicked');
    navigate('/auth');
    toast({
      title: "Navigating to sign in",
      description: "Opening authentication page...",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-[#0A0A0A]">
      <ScrollNav />
      
      {/* Background elements with waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-siso-red/10 rounded-full filter blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-siso-orange/10 rounded-full filter blur-[100px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-siso-red/5 rounded-full filter blur-[120px]"></div>
        <Waves 
          lineColor="rgba(255, 87, 34, 0.1)"
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.01}
          waveAmpX={50}
          waveAmpY={25}
          friction={0.9}
          tension={0.01}
          maxCursorMove={150}
          xGap={15}
          yGap={40}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen">
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen py-20">
          <TierSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="min-h-screen py-20">
          <TestimonialSection />
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="min-h-screen py-20">
          <div className="text-center py-24">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-gray-400 mb-8">Join thousands of successful agencies already using our platform</p>
            <button
              onClick={handleSignInClick}
              className="px-8 py-3 bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-lg font-medium
                transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-siso-red/20"
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};