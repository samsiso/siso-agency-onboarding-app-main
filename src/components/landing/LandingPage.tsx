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
import { Feature108 } from '@/components/blocks/shadcnblocks-com-feature108';
import { LogoCarousel } from '@/components/ui/logo-carousel';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { OpenAIIconBlack } from '@/components/ui/icons/OpenAIIcon';
import { ClaudeAIIcon } from '@/components/ui/icons/ClaudeAIIcon';
import { SupabaseIcon } from '@/components/ui/icons/SupabaseIcon';
import { VercelIcon } from '@/components/ui/icons/VercelIcon';
import { TypeScriptIcon } from '@/components/ui/icons/TypeScriptIcon';
import { TailwindCSSIcon } from '@/components/ui/icons/TailwindCSSIcon';
import { NextjsIcon } from '@/components/ui/icons/NextjsIcon';
import { UpstashIcon } from '@/components/ui/icons/UpstashIcon';
import { StripeIcon } from '@/components/ui/icons/StripeIcon';
import { Case } from '@/components/ui/cases-with-infinite-scroll';

const allLogos = [
  { name: "OpenAI", id: 1, img: OpenAIIconBlack },
  { name: "Claude AI", id: 2, img: ClaudeAIIcon },
  { name: "Supabase", id: 3, img: SupabaseIcon },
  { name: "Vercel", id: 4, img: VercelIcon },
  { name: "TypeScript", id: 5, img: TypeScriptIcon },
  { name: "TailwindCSS", id: 6, img: TailwindCSSIcon },
  { name: "Nextjs", id: 7, img: NextjsIcon },
  { name: "Upstash", id: 8, img: UpstashIcon },
  { name: "Stripe", id: 9, img: StripeIcon }
];

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

        {/* Infinite Scroll Case Section */}
        <section className="relative py-20">
          <Case />
        </section>

        {/* Logo Carousel Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <GradientHeading 
                variant="secondary" 
                size="lg"
                className="mb-4"
              >
                Powered by Industry Leaders
              </GradientHeading>
              <p className="text-siso-text-muted text-lg max-w-2xl mx-auto">
                Join thousands of agencies leveraging cutting-edge AI tools and resources
              </p>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="max-w-5xl w-full">
                <LogoCarousel columnCount={3} logos={allLogos} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen">
          <Feature108 />
        </section>

        {/* Features Section */}
        <section id="pricing" className="min-h-screen py-20">
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