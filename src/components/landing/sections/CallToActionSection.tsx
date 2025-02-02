import { RainbowButton } from '@/components/ui/rainbow-button';
import { useNavigate } from 'react-router-dom';

export const CallToActionSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight">
            Ready to transform your business with AI?
          </h3>
          <p className="text-gray-300 text-lg mb-10 font-light">
            Connect with our experts today and discover how our innovative solutions can drive your success.
          </p>
          <RainbowButton 
            className="text-lg px-10 py-6 font-semibold"
            onClick={handleGetStarted}
          >
            Start Free Trial
          </RainbowButton>
        </div>
      </div>
    </section>
  );
};