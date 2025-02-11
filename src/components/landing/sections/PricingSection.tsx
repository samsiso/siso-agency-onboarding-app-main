
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';

export const PricingSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="pricing" className="py-16">
      <PricingCard
        title="£1,000+ Value - Completely Free for Early Adopters"
        description="Get instant access to our complete platform worth over £1,000/year. Limited to first 1,000 users only - no credit card required. Lock in lifetime free access today."
        price={0}
        features={[
          {
            title: "Premium Features (£1,000+ Annual Value)",
            items: [
              "Enterprise-grade AI automation suite (£500 value)",
              "Unlimited platform integrations (£250 value)",
              "24/7 Priority support & consulting (£250 value)",
              "Regular feature updates and improvements",
            ],
          },
          {
            title: "Future Pricing Plans",
            items: [
              "Standard Plan: £249/year after beta",
              "Enterprise Plan: £999/year",
              "Early adopters keep lifetime free access",
              "Trusted by 1000+ agencies worldwide",
            ],
          },
        ]}
        buttonText="Secure Your Free Account Now"
        onButtonClick={handleGetStarted}
        trustMessage="Join 500+ agencies already saving £1,000+ annually. Limited spots remaining for lifetime free access."
      />
    </section>
  );
};
