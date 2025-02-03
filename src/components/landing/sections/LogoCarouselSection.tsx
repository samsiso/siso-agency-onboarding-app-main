import { LogoCarousel } from '@/components/ui/logo-carousel';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { allLogos } from '../constants';
import { useIsMobile } from '@/hooks/use-mobile';

export const LogoCarouselSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-8 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <GradientHeading 
            variant="secondary" 
            size="lg"
            className="mb-3 md:mb-4 text-2xl md:text-3xl"
          >
            Powered by Industry Leaders
          </GradientHeading>
          <p className="text-siso-text-muted text-sm md:text-base max-w-2xl mx-auto">
            Join thousands of agencies leveraging cutting-edge AI tools and resources
          </p>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="max-w-5xl w-full">
            <LogoCarousel 
              columnCount={isMobile ? 3 : 5} 
              logos={allLogos}
              speed={isMobile ? 20 : 30}
            />
          </div>
        </div>
      </div>
    </section>
  );
};