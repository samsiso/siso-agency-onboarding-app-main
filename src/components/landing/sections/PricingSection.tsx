import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="pricing" className="py-16">
      <PricingCard
        title="Enterprise AI Suite"
        description="Complete AI transformation toolkit for established agencies"
        price={999}
        originalPrice={1999}
        features={[
          {
            title: "AI Integration Features",
            items: [
              "Custom AI Model Development",
              "Advanced Automation Workflows",
              "Real-time AI Analytics",
              "Multi-platform Integration",
            ],
          },
          {
            title: "Business Benefits",
            items: [
              "24/7 Priority Support",
              "Dedicated Success Manager",
              "Custom Development Support",
              "Strategic AI Consulting",
            ],
          },
        ]}
        buttonText="Start Enterprise Trial"
        onButtonClick={handleGetStarted}
      />
    </section>
  );
};