import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { TestimonialSection } from './TestimonialSection';
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
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { PricingCard } from '@/components/ui/pricing-card';

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

  useEffect(() => {
    console.log('LandingPage mounted');
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
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
        <section id="features" className="py-20">
          <Feature108 />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16">
          <PricingCard
            title="Enterprise AI Suite"
            description="Complete AI transformation toolkit for established agencies"
            price={999}
            originalPrice={1999}
            features={[
              {
                title: "AI Integration Features",
                items: [
                  "Custom AI Model Development",
                  "Advanced Automation Workflows",
                  "Real-time AI Analytics",
                  "Multi-platform Integration",
                ],
              },
              {
                title: "Business Benefits",
                items: [
                  "24/7 Priority Support",
                  "Dedicated Success Manager",
                  "Custom Development Support",
                  "Strategic AI Consulting",
                ],
              },
            ]}
            buttonText="Start Enterprise Trial"
            onButtonClick={handleGetStarted}
          />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16">
          <TestimonialSection />
        </section>

        {/* Logo Carousel Section */}
        <section className="py-16 overflow-hidden">
          <div className="container mx-auto">
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
                <LogoCarousel columnCount={5} logos={allLogos} />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight">
                Ready to transform your business with AI?
              </h3>
              <p className="text-gray-300 text-lg mb-10 font-light">
                Connect with our experts today and discover how our innovative solutions can drive your success.
              </p>
              <RainbowButton 
                className="text-lg px-10 py-6 font-semibold"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </RainbowButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <StackedCircularFooter />
      </div>
    </div>
  );
};
