import { useEffect, lazy, Suspense, memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { LoadingFallback } from './sections/LoadingFallback';
import { ArrowUpIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

// Lazy load components
const HeroSection = lazy(() => 
  import('./sections/HeroSection').then(m => ({ default: memo(m.HeroSection) }))
);

const FeaturesSection = lazy(() => 
  import('./sections/FeaturesSection').then(m => ({ default: memo(m.FeaturesSection) }))
);

const PricingSection = lazy(() => 
  import('./sections/PricingSection').then(m => ({ default: memo(m.PricingSection) }))
);

const WhyChooseSection = lazy(() => 
  import('./sections/WhyChooseSection').then(m => ({ default: memo(m.WhyChooseSection) }))
);

const GettingStartedSection = lazy(() => 
  import('./sections/GettingStartedSection').then(m => ({ default: memo(m.GettingStartedSection) }))
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Intersection observer for sections
  const { observerRef } = useIntersectionObserver({
    threshold: 0.1,
    onIntersect: (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }
  });

  useEffect(() => {
    console.log('LandingPage mounted');
    if (user) {
      navigate('/app');
    }

    // Handle scroll progress
    const handleScroll = () => {
      if (progressRef.current) {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = `${(scrolled / maxHeight) * 100}%`;
        progressRef.current.style.transform = `scaleX(${scrolled / maxHeight})`;
      }

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500);

      // Show/hide floating search
      setShowSearch(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, navigate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-[#0A0A0A] overflow-x-hidden">
      {/* Progress bar */}
      <div ref={progressRef} className="scroll-progress" />

      {/* Floating search bar */}
      <div ref={searchRef} className={`floating-search ${showSearch ? 'visible' : ''}`}>
        <input 
          type="search"
          placeholder="Search resources..."
          className="w-full px-4 py-2 rounded-lg bg-siso-bg-alt border border-siso-border 
            focus:border-siso-red focus:outline-none focus:ring-1 focus:ring-siso-red"
        />
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <ScrollNav />
      </Suspense>
      
      {/* Background elements with content containment */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none contain-paint">
        <div className="absolute top-1/4 -left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-red/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slow transform-gpu"
        />
        <div className="absolute bottom-1/4 -right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-orange/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slower transform-gpu"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[350px] md:w-[1000px] h-[350px] md:h-[1000px] 
          bg-siso-red/8 rounded-full filter blur-[100px] md:blur-[150px] transform-gpu"
        />
      </div>

      {/* Main Content with intersection observer */}
      <div ref={observerRef} className="relative z-10 px-4 md:px-0 space-y-12 md:space-y-24">
        <Suspense fallback={<LoadingFallback />}>
          <div className="section-fade-in">
            <HeroSection />
          </div>
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <WhyChooseSection />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <GettingStartedSection />
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

      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-6 h-6 text-siso-text" />
      </button>
    </div>
  );
};
