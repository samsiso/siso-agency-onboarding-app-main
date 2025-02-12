
import { lazy, Suspense, memo, useEffect } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { useViewportLoading } from '@/hooks/useViewportLoading';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';

// [Analysis] Optimized lazy loading with prefetch hints
const HeroSection = lazy(() => {
  // Add preload hint for critical hero image
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png';
  document.head.appendChild(link);
  
  return import('./sections/HeroSection').then(m => ({ 
    default: memo(m.HeroSection) 
  }));
});

// [Analysis] Other sections can be loaded when needed
const WhyChooseSection = lazy(() => 
  import('./sections/WhyChooseSection').then(m => ({ 
    default: memo(m.WhyChooseSection) 
  }))
);

const FeaturesSection = lazy(() => 
  import('./sections/FeaturesSection').then(m => ({ 
    default: memo(m.FeaturesSection) 
  }))
);

const GettingStartedSection = lazy(() => 
  import('./sections/GettingStartedSection').then(m => ({ 
    default: memo(m.GettingStartedSection) 
  }))
);

const PricingSection = lazy(() => 
  import('./sections/PricingSection').then(m => ({ 
    default: memo(m.PricingSection) 
  }))
);

const TestimonialsSection = lazy(() => 
  import('./sections/TestimonialsSection').then(m => ({ 
    default: memo(m.TestimonialsSection) 
  }))
);

const CallToActionSection = lazy(() => 
  import('./sections/CallToActionSection').then(m => ({ 
    default: memo(m.CallToActionSection) 
  }))
);

const ScrollNav = lazy(() => 
  import('@/components/ui/scroll-nav').then(m => ({ 
    default: memo(m.ScrollNav) 
  }))
);

const LandingPage = () => {
  // Initialize performance monitoring
  usePerformanceMetrics();

  // Setup viewport loading for each section
  const hero = useViewportLoading({ threshold: 0.1 });
  const whyChoose = useViewportLoading({ threshold: 0.1 });
  const features = useViewportLoading({ threshold: 0.1 });
  const gettingStarted = useViewportLoading({ threshold: 0.1 });
  const pricing = useViewportLoading({ threshold: 0.1 });
  const testimonials = useViewportLoading({ threshold: 0.1 });
  const cta = useViewportLoading({ threshold: 0.1 });

  // Preload next sections
  useEffect(() => {
    const preloadNextSections = () => {
      const links = [
        { rel: 'preload', href: '/why-choose', as: 'fetch' },
        { rel: 'preload', href: '/features', as: 'fetch' },
        { rel: 'preload', href: '/getting-started', as: 'fetch' }
      ];

      links.forEach(({ rel, href, as }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
      });
    };

    // Start preloading after initial render
    requestIdleCallback(() => preloadNextSections());
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* DNS prefetch and preconnect optimizations */}
      <link rel="dns-prefetch" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" />
      <link rel="preconnect" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" crossOrigin="anonymous" />
      
      <Suspense fallback={<LoadingFallback />}>
        <ScrollNav />
      </Suspense>
      
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
      <div className="relative z-10 px-4 md:px-0">
        <section id="hero" ref={hero.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(hero.isVisible || hero.isLoaded) && <HeroSection />}
          </Suspense>
        </section>

        <section id="why-choose" ref={whyChoose.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(whyChoose.isVisible || whyChoose.isLoaded) && <WhyChooseSection />}
          </Suspense>
        </section>

        <section id="features" ref={features.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(features.isVisible || features.isLoaded) && <FeaturesSection />}
          </Suspense>
        </section>

        <section id="getting-started" ref={gettingStarted.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(gettingStarted.isVisible || gettingStarted.isLoaded) && <GettingStartedSection />}
          </Suspense>
        </section>

        <section id="pricing" ref={pricing.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(pricing.isVisible || pricing.isLoaded) && <PricingSection />}
          </Suspense>
        </section>

        <div className="space-y-12 md:space-y-24">
          <section id="testimonials" ref={testimonials.elementRef}>
            <Suspense fallback={<LoadingFallback />}>
              {(testimonials.isVisible || testimonials.isLoaded) && <TestimonialsSection />}
            </Suspense>
          </section>
        </div>

        <section id="cta" ref={cta.elementRef}>
          <Suspense fallback={<LoadingFallback />}>
            {(cta.isVisible || cta.isLoaded) && <CallToActionSection />}
          </Suspense>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default memo(LandingPage);
