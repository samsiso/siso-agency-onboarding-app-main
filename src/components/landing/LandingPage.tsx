
import { lazy, Suspense, memo } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { ErrorBoundary } from 'react-error-boundary';
import { HeroSection } from './sections/HeroSection';

// Only lazy load non-critical sections
const WhyChooseSection = lazy(() => import('./sections/WhyChooseSection').then(m => ({
  default: memo(m.WhyChooseSection)
})));
const CallToActionSection = lazy(() => import('./sections/CallToActionSection').then(m => ({
  default: memo(m.CallToActionSection)
})));
const ScrollNav = lazy(() => import('@/components/ui/scroll-nav').then(m => ({
  default: memo(m.ScrollNav)
})));

const LandingPage = () => {
  console.log('[LandingPage] Rendering landing page');

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* DNS prefetch and preconnect optimizations */}
      <link rel="dns-prefetch" href="https://avdgyrepwrvsvwgxrccr.supabase.co" />
      <link rel="preconnect" href="https://avdgyrepwrvsvwgxrccr.supabase.co" crossOrigin="anonymous" />
      
      <ErrorBoundary 
        fallback={<LoadingFallback error={new Error()} />}
        onError={(error) => console.error('[LandingPage] Error in ScrollNav:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ScrollNav />
        </Suspense>
      </ErrorBoundary>
      
      {/* Optimized background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-red/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slow transform-gpu will-change-transform"
        />
        <div className="absolute bottom-1/4 -right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-orange/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slower transform-gpu will-change-transform"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[350px] md:w-[1000px] h-[350px] md:h-[1000px] 
          bg-siso-red/8 rounded-full filter blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
        />
      </div>

      {/* Progressive section loading */}
      <div className="relative z-10 px-4 md:px-0 space-y-12 md:space-y-24">
        <ErrorBoundary
          fallback={<LoadingFallback error={new Error()} />}
          onError={(error) => console.error('[LandingPage] Error in HeroSection:', error)}
        >
          <HeroSection />
        </ErrorBoundary>

        <ErrorBoundary
          fallback={<LoadingFallback error={new Error()} />}
          onError={(error) => console.error('[LandingPage] Error in other sections:', error)}
        >
          <Suspense fallback={<LoadingFallback />}>
            <WhyChooseSection />
          </Suspense>
          
          <Suspense fallback={<LoadingFallback />}>
            <CallToActionSection />
          </Suspense>
        </ErrorBoundary>

        <Footer />
      </div>
    </div>
  );
};

export default memo(LandingPage);
