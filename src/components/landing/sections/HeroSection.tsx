import { RainbowButton } from '@/components/ui/rainbow-button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
          Transform Your Agency with AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Unlock the power of AI automation, education, and networking to scale your agency efficiently.
        </p>
        <RainbowButton 
          onClick={handleGetStarted}
          className="text-lg px-10 py-6 font-semibold"
        >
          Start Onboarding
        </RainbowButton>
      </div>
    </section>
  );
};