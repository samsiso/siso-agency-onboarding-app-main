import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TierSection } from './TierSection';
import { TestimonialSection } from './TestimonialSection';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/animated-hero';

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
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-siso-red/10 rounded-full filter blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-siso-orange/10 rounded-full filter blur-[100px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-siso-red/5 rounded-full filter blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Tier Section */}
        <TierSection />

        {/* Testimonials Section */}
        <TestimonialSection />

        {/* Final CTA Section */}
        <section className="text-center py-24">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-400 mb-8">Join thousands of successful agencies already using our platform</p>
          <button
            onClick={handleSignInClick}
            className="px-8 py-3 bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-lg font-medium
              transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-siso-red/20"
          >
            Get Started Now
          </button>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};