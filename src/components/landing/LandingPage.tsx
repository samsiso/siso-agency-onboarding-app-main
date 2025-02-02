import { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { StackedCircularFooter } from '@/components/ui/stacked-circular-footer';
import { ScrollNav } from '@/components/ui/scroll-nav';

// Lazy load sections
const HeroSection = lazy(() => import('./sections/HeroSection').then(m => ({ default: m.HeroSection })));
const FeaturesSection = lazy(() => import('./sections/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const PricingSection = lazy(() => import('./sections/PricingSection').then(m => ({ default: m.PricingSection })));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const LogoCarouselSection = lazy(() => import('./sections/LogoCarouselSection').then(m => ({ default: m.LogoCarouselSection })));
const CallToActionSection = lazy(() => import('./sections/CallToActionSection').then(m => ({ default: m.CallToActionSection })));

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center">
    <div className="animate-pulse bg-siso-bg-alt rounded-lg w-full max-w-3xl h-64" />
  </div>
);

export const LandingPage = () => {
  const { user } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LandingPage mounted');
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-[#0A0A0A]">
      <ScrollNav />
      
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-siso-red/10 rounded-full filter blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-siso-orange/10 rounded-full filter blur-[100px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-siso-red/5 rounded-full filter blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LogoCarouselSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CallToActionSection />
        </Suspense>

        <StackedCircularFooter />
      </div>
    </div>
  );
};