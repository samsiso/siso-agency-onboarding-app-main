import { Feature108 } from '@/components/blocks/shadcnblocks-com-feature108';
import { useNavigate } from 'react-router-dom';
import { RainbowButton } from '@/components/ui/rainbow-button';

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="features" className="py-20">
      <Feature108 />
      <div className="flex justify-center mt-12">
        <RainbowButton 
          onClick={handleGetStarted}
          className="text-lg px-8 py-4 font-semibold"
        >
          Start Onboarding
        </RainbowButton>
      </div>
    </section>
  );
};