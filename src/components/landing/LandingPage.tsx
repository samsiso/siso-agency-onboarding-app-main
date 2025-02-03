import { useEffect, lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { LoadingFallback } from './sections/LoadingFallback';

// [Analysis] Optimized lazy imports with loading boundaries for better mobile performance
const HeroSection = lazy(() => 
  import('./sections/HeroSection').then(m => ({ default: memo(m.HeroSection) }))
);

const FeaturesSection = lazy(() => 
  import('./sections/FeaturesSection').then(m => ({ default: memo(m.FeaturesSection) }))
);

const PricingSection = lazy(() => 
  import('./sections/PricingSection').then(m => ({ default: memo(m.PricingSection) }))
);

const TestimonialsSection = lazy(() => 
  import('./sections/TestimonialsSection').then(m => ({ default: memo(m.TestimonialsSection) }))
);

const LogoCarouselSection = lazy(() => 
  import('./sections/LogoCarouselSection').then(m => ({ default: memo(m.LogoCarouselSection) }))
);

const CallToActionSection = lazy(() => 
  import('./sections/CallToActionSection').then(m => ({ default: memo(m.CallToActionSection) }))
);

const StackedCircularFooter = lazy(() => 
  import('@/components/ui/stacked-circular-footer').then(m => ({ default: memo(m.StackedCircularFooter) }))
);

const ScrollNav = lazy(() => 
  import('@/components/ui/scroll-nav').then(m => ({ default: memo(m.ScrollNav) }))
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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-[#0A0A0A] overflow-x-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <ScrollNav />
      </Suspense>
      
      {/* Background elements - Enhanced wave visibility */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-siso-red/10 rounded-full filter blur-[60px] md:blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-siso-orange/10 rounded-full filter blur-[60px] md:blur-[100px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[1000px] h-[400px] md:h-[1000px] bg-siso-red/5 rounded-full filter blur-[80px] md:blur-[120px]"></div>
      </div>

      {/* Main Content with Intersection Observer based loading */}
      <div className="relative z-10 px-4 md:px-0">
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <LogoCarouselSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <CallToActionSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <StackedCircularFooter />
        </Suspense>
      </div>
    </div>
  );
};