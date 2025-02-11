
import { lazy, Suspense, memo } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';  // Import our updated Footer

// [Analysis] Lazy load components for optimal performance
const HeroSection = lazy(() => 
  import('./sections/HeroSection').then(m => ({ 
    default: memo(m.HeroSection) 
  }))
);

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
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* Preload critical resources */}
      <link rel="preload" as="image" href="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fzuwsjxjymwcjsbpwfsl.supabase.co" />
      
      <Suspense fallback={<LoadingFallback />}>
        <ScrollNav />
      </Suspense>
      
      {/* Background elements with hardware acceleration */}
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

      {/* Main Content with progressive loading */}
      <div className="relative z-10 px-4 md:px-0">
        <section id="hero">
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
          </Suspense>
        </section>

        <section id="why-choose">
          <Suspense fallback={<LoadingFallback />}>
            <WhyChooseSection />
          </Suspense>
        </section>

        <section id="features">
          <Suspense fallback={<LoadingFallback />}>
            <FeaturesSection />
          </Suspense>
        </section>

        <section id="getting-started">
          <Suspense fallback={<LoadingFallback />}>
            <GettingStartedSection />
          </Suspense>
        </section>

        <section id="pricing">
          <Suspense fallback={<LoadingFallback />}>
            <PricingSection />
          </Suspense>
        </section>

        <div className="space-y-12 md:space-y-24">
          <section id="testimonials">
            <Suspense fallback={<LoadingFallback />}>
              <TestimonialsSection />
            </Suspense>
          </section>
        </div>

        <section id="cta">
          <Suspense fallback={<LoadingFallback />}>
            <CallToActionSection />
          </Suspense>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
