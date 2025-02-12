
import { lazy, Suspense, memo, useEffect, useState, useCallback } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { useViewportLoading } from '@/hooks/useViewportLoading';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { ErrorBoundary } from 'react-error-boundary';

// [Analysis] Optimized lazy loading with prefetch hints and error handling
const HeroSection = lazy(() => {
  // Preload critical assets
  const preloadAssets = [
    { as: 'image', href: '/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png' },
    // Add other critical assets here
  ];

  preloadAssets.forEach(({ as, href }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    document.head.appendChild(link);
  });
  
  return import('./sections/HeroSection').then(m => ({ 
    default: memo(m.HeroSection) 
  }));
});

// [Analysis] Other sections with error handling and retry logic
const createLazySection = (importPath: string) => {
  return lazy(() => 
    import(importPath).then(m => ({ 
      default: memo(m.default || m[importPath.split('/').pop()?.split('.')[0] || '']) 
    }))
  );
};

const WhyChooseSection = createLazySection('./sections/WhyChooseSection');
const FeaturesSection = createLazySection('./sections/FeaturesSection');
const GettingStartedSection = createLazySection('./sections/GettingStartedSection');
const PricingSection = createLazySection('./sections/PricingSection');
const TestimonialsSection = createLazySection('./sections/TestimonialsSection');
const CallToActionSection = createLazySection('./sections/CallToActionSection');

// [Analysis] Fixed ScrollNav import to use absolute path and handle default export
const ScrollNav = lazy(() => import('@/components/ui/scroll-nav').then(module => ({
  default: memo(module.default)
})));

const LandingPage = () => {
  // Initialize performance monitoring
  usePerformanceMetrics();
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  // Setup viewport loading for each section
  const hero = useViewportLoading({ threshold: 0.1 });
  const whyChoose = useViewportLoading({ threshold: 0.1 });
  const features = useViewportLoading({ threshold: 0.1 });
  const gettingStarted = useViewportLoading({ threshold: 0.1 });
  const pricing = useViewportLoading({ threshold: 0.1 });
  const testimonials = useViewportLoading({ threshold: 0.1 });
  const cta = useViewportLoading({ threshold: 0.1 });

  // Enhanced error handling with retry mechanism
  const handleError = useCallback((error: Error, sectionId: string) => {
    console.error(`Error loading section ${sectionId}:`, error);
    setRetryCount(prev => ({ ...prev, [sectionId]: (prev[sectionId] || 0) + 1 }));
  }, []);

  const handleRetry = useCallback((sectionId: string) => {
    setRetryCount(prev => ({ ...prev, [sectionId]: 0 }));
  }, []);

  // Preload next sections with enhanced error handling
  useEffect(() => {
    const preloadNextSections = () => {
      const sections = [
        { path: '/why-choose', priority: 'high' },
        { path: '/features', priority: 'high' },
        { path: '/getting-started', priority: 'medium' },
        { path: '/pricing', priority: 'low' },
      ];

      sections.forEach(({ path, priority }) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        link.setAttribute('fetchpriority', priority);
        document.head.appendChild(link);
      });
    };

    requestIdleCallback(() => preloadNextSections());
  }, []);

  const renderSection = (
    id: string,
    Component: React.LazyExoticComponent<any>,
    ref: React.RefObject<HTMLDivElement>,
    isVisible: boolean,
    isLoaded: boolean
  ) => (
    <ErrorBoundary
      fallback={<LoadingFallback error={new Error()} onRetry={() => handleRetry(id)} />}
      onError={(error) => handleError(error, id)}
      key={`${id}-${retryCount[id] || 0}`}
    >
      <section id={id} ref={ref} className="transition-opacity duration-500">
        <Suspense fallback={<LoadingFallback />}>
          {(isVisible || isLoaded) && <Component />}
        </Suspense>
      </section>
    </ErrorBoundary>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* DNS prefetch and preconnect optimizations */}
      <link rel="dns-prefetch" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" />
      <link rel="preconnect" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" crossOrigin="anonymous" />
      
      <ErrorBoundary 
        fallback={<LoadingFallback error={new Error()} />}
        onError={(error) => console.error('ScrollNav Error:', error)}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ScrollNav />
        </Suspense>
      </ErrorBoundary>
      
      {/* Optimized background elements with reduced repaints */}
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

      {/* Progressive section loading with error boundaries */}
      <div className="relative z-10 px-4 md:px-0 space-y-12 md:space-y-24">
        {renderSection('hero', HeroSection, hero.elementRef, hero.isVisible, hero.isLoaded)}
        {renderSection('why-choose', WhyChooseSection, whyChoose.elementRef, whyChoose.isVisible, whyChoose.isLoaded)}
        {renderSection('features', FeaturesSection, features.elementRef, features.isVisible, features.isLoaded)}
        {renderSection('getting-started', GettingStartedSection, gettingStarted.elementRef, gettingStarted.isVisible, gettingStarted.isLoaded)}
        {renderSection('pricing', PricingSection, pricing.elementRef, pricing.isVisible, pricing.isLoaded)}
        {renderSection('testimonials', TestimonialsSection, testimonials.elementRef, testimonials.isVisible, testimonials.isLoaded)}
        {renderSection('cta', CallToActionSection, cta.elementRef, cta.isVisible, cta.isLoaded)}

        <Footer />
      </div>
    </div>
  );
};

export default memo(LandingPage);
