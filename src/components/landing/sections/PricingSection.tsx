import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="pricing" className="py-16">
      <PricingCard
        title="Build Your Agency's Future - Completely Free"
        description="Access our full suite of AI-powered tools, integrations, and resources without any cost. No credit card required."
        price={0}
        features={[
          {
            title: "Core Platform Features",
            items: [
              "Full access to AI automation suite",
              "Unlimited integrations with top platforms",
              "Real-time support and community access",
              "Regular feature updates and improvements",
            ],
          },
          {
            title: "Enterprise Benefits",
            items: [
              "24/7 Priority Support",
              "Custom Development Support",
              "Strategic AI Consulting",
              "Trusted by 1000+ agencies worldwide",
            ],
          },
        ]}
        buttonText="Start Onboarding Today"
        onButtonClick={handleGetStarted}
        trustMessage="Trusted by agencies worldwide with $10M+ processed through our platform"
      />
    </section>
  );
};