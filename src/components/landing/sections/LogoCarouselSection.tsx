import { LogoCarousel } from '@/components/ui/logo-carousel';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { allLogos } from '../constants';

export const LogoCarouselSection = () => {
  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <GradientHeading 
            variant="secondary" 
            size="lg"
            className="mb-4"
          >
            Powered by Industry Leaders
          </GradientHeading>
          <p className="text-siso-text-muted text-lg max-w-2xl mx-auto">
            Join thousands of agencies leveraging cutting-edge AI tools and resources
          </p>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="max-w-5xl w-full">
            <LogoCarousel columnCount={5} logos={allLogos} />
          </div>
        </div>
      </div>
    </section>
  );
};