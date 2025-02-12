import { lazy, Suspense, memo, useEffect, useState, useCallback } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { useViewportLoading } from '@/hooks/useViewportLoading';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useIsMobile } from '@/hooks/use-mobile';
import { ErrorBoundary } from 'react-error-boundary';

// [Analysis] Optimized lazy loading with mobile-first approach
const HeroSection = lazy(() => {
  // Preload critical assets with responsive images
  const preloadAssets = [
    { 
      as: 'image',
      href: '/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png',
      media: '(min-width: 768px)'
    },
    // Mobile version
    {
      as: 'image',
      href: '/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png',
      media: '(max-width: 767px)'
    }
  ];

  preloadAssets.forEach(({ as, href, media }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    if (media) link.media = media;
    document.head.appendChild(link);
  });
  
  return import('./sections/HeroSection').then(m => ({ 
    default: memo(m.HeroSection) 
  }));
});

// [Analysis] Optimized section loading for mobile
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
const ScrollNav = lazy(() => import('../ui/scroll-nav'));

const LandingPage = () => {
  const isMobile = useIsMobile();
  usePerformanceMetrics();
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  // Optimized viewport loading thresholds for mobile
  const threshold = isMobile ? 0.05 : 0.1;
  const rootMargin = isMobile ? '150px' : '300px';

  // Setup viewport loading for each section with mobile optimization
  const hero = useViewportLoading({ threshold, rootMargin });
  const whyChoose = useViewportLoading({ threshold, rootMargin });
  const features = useViewportLoading({ threshold, rootMargin });
  const gettingStarted = useViewportLoading({ threshold, rootMargin });
  const pricing = useViewportLoading({ threshold, rootMargin });
  const testimonials = useViewportLoading({ threshold, rootMargin });
  const cta = useViewportLoading({ threshold, rootMargin });

  const handleError = useCallback((error: Error, sectionId: string) => {
    console.error(`Error loading section ${sectionId}:`, error);
    setRetryCount(prev => ({ ...prev, [sectionId]: (prev[sectionId] || 0) + 1 }));
  }, []);

  const handleRetry = useCallback((sectionId: string) => {
    setRetryCount(prev => ({ ...prev, [sectionId]: 0 }));
  }, []);

  // Mobile-optimized preloading strategy
  useEffect(() => {
    const preloadNextSections = () => {
      const sections = [
        { path: '/why-choose', priority: isMobile ? 'medium' : 'high' },
        { path: '/features', priority: isMobile ? 'medium' : 'high' },
        { path: '/getting-started', priority: 'low' },
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

    // Delay preloading on mobile to prioritize initial render
    const delay = isMobile ? 2000 : 0;
    setTimeout(() => {
      requestIdleCallback(() => preloadNextSections());
    }, delay);
  }, [isMobile]);

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
      <section 
        id={id} 
        ref={ref} 
        className="transition-opacity duration-500"
        style={{ contentVisibility: 'auto' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {(isVisible || isLoaded) && <Component />}
        </Suspense>
      </section>
    </ErrorBoundary>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* Mobile-optimized meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#000000" />
      
      {/* DNS prefetch and preconnect optimizations */}
      <link rel="dns-prefetch" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" />
      <link rel="preconnect" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" crossOrigin="anonymous" />
      
      <ErrorBoundary fallback={<LoadingFallback error={new Error()} />}>
        <Suspense fallback={<LoadingFallback />}>
          <ScrollNav />
        </Suspense>
      </ErrorBoundary>
      
      {/* Mobile-optimized background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-1/4 w-[150px] sm:w-[250px] md:w-[600px] h-[150px] sm:h-[250px] md:h-[600px] 
            bg-siso-red/15 rounded-full filter blur-[40px] sm:blur-[80px] md:blur-[120px] 
            animate-float-slow transform-gpu will-change-transform"
          style={{ 
            animationDuration: isMobile ? '8s' : '6s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[150px] sm:w-[250px] md:w-[600px] h-[150px] sm:h-[250px] md:h-[600px] 
            bg-siso-orange/15 rounded-full filter blur-[40px] sm:blur-[80px] md:blur-[120px] 
            animate-float-slower transform-gpu will-change-transform"
          style={{ 
            animationDuration: isMobile ? '10s' : '8s',
            animationTimingFunction: 'ease-in-out'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[250px] sm:w-[350px] md:w-[1000px] h-[250px] sm:h-[350px] md:h-[1000px] 
            bg-siso-red/8 rounded-full filter blur-[50px] sm:blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
        />
      </div>

      {/* Mobile-optimized section layout */}
      <div className="relative z-10 px-4 md:px-0 space-y-8 sm:space-y-12 md:space-y-24">
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
