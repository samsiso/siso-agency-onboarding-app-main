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
import { Zap, BookOpen, Users } from 'lucide-react';
import { RainbowButton } from '@/components/ui/rainbow-button';

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

  const featureData = {
    badge: "SISO Agency",
    heading: "Empowering Agencies with AI-Driven Solutions",
    description: "Access curated tools, education, and networking resources to scale your agency.",
    tabs: [
      {
        value: "tab-1",
        icon: <Zap className="h-auto w-4 shrink-0" />,
        label: "AI Tools",
        content: {
          badge: "Modern Solutions",
          title: "Supercharge Your Agency Growth",
          description:
            "Access our curated collection of AI tools and platforms designed specifically for agency needs, helping you automate tasks and scale operations efficiently.",
          buttonText: "Explore Tools",
          imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
          imageAlt: "AI Tools for Agencies",
        },
      },
      {
        value: "tab-2",
        icon: <BookOpen className="h-auto w-4 shrink-0" />,
        label: "Education Hub",
        content: {
          badge: "Expert Knowledge",
          title: "Learn from Industry Leaders",
          description:
            "Get access to exclusive educational content, tutorials, and best practices from successful agency owners and digital marketing experts.",
          buttonText: "Start Learning",
          imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978",
          imageAlt: "Education Resources",
        },
      },
      {
        value: "tab-3",
        icon: <Users className="h-auto w-4 shrink-0" />,
        label: "Network & Grow",
        content: {
          badge: "Community Power",
          title: "Connect with Agency Leaders",
          description:
            "Join our thriving community of agency owners, share experiences, and build valuable partnerships that drive growth and innovation.",
          buttonText: "Join Network",
          imageSrc: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
          imageAlt: "Networking",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-[#0A0A0A]">
      <ScrollNav />
      
      {/* Background elements with waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-siso-red/10 rounded-full filter blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-siso-orange/10 rounded-full filter blur-[120px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-siso-red/5 rounded-full filter blur-[150px]"></div>
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
        <section id="hero" className="min-h-screen flex items-center justify-center">
          <div className="container px-4 py-32 mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text animate-gradient">
              Empowering Agencies with AI-Driven Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Access curated tools, education, and networking resources to scale your agency.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <RainbowButton
                onClick={() => navigate('/tools')}
                className="text-lg px-8 py-4 font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                AI Tools
              </RainbowButton>
              <RainbowButton
                onClick={() => navigate('/education')}
                variant="outline"
                className="text-lg px-8 py-4 font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Education Hub
              </RainbowButton>
              <RainbowButton
                onClick={() => navigate('/network')}
                variant="outline"
                className="text-lg px-8 py-4 font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Network & Grow
              </RainbowButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen">
          <Feature108 {...featureData} />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="min-h-screen py-20">
          <TierSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="min-h-screen py-20">
          <TestimonialSection />
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-siso-red/10 via-transparent to-transparent opacity-30" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of successful agencies already using our platform to scale their operations with AI.
            </p>
            <RainbowButton
              onClick={handleSignInClick}
              className="text-lg px-10 py-6 font-semibold"
            >
              Get Started Now
            </RainbowButton>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};