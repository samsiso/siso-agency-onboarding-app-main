
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Users, Star, ShieldCheck } from 'lucide-react';

export const PricingSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-siso-orange via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-siso-red via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Pricing Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Spots Counter */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-siso-red to-siso-orange 
            text-white px-6 py-2 rounded-full text-sm font-semibold z-10 whitespace-nowrap shadow-lg">
            🎉 Limited Time Beta Offer - Only 563 spots remaining
          </div>

          {/* Main Pricing Card */}
          <PricingCard
            title="£1,000+ Value - Completely Free for Early Adopters"
            description="Get instant access to our complete platform worth over £1,000/year. Limited to first 1,000 users only - no credit card required. Lock in lifetime free access today."
            price={0}
            features={[
              {
                title: "Premium Features (£1,000+ Annual Value)",
                items: [
                  <div key="1" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-siso-orange" />
                    <span>Enterprise-grade AI automation suite (£500 value) - Used by 500+ agencies</span>
                  </div>,
                  <div key="2" className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>24/7 Priority support & consulting (£250 value) - 4.9/5 customer rating</span>
                  </div>,
                  <div key="3" className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Unlimited platform integrations (£250 value) - Enterprise-grade security</span>
                  </div>,
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
        </motion.div>

        {/* Trust Banner */}
        <motion.div 
          className="mt-12 text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-siso-text/70">30-day money-back guarantee</span>
            <span className="mx-2 text-siso-text/30">•</span>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-siso-text/70">No credit card required</span>
            <span className="mx-2 text-siso-text/30">•</span>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-siso-text/70">Cancel anytime</span>
          </div>
          <p className="text-sm text-siso-text/60">
            Trusted by agencies worldwide with £10M+ processed through our platform
          </p>
        </motion.div>
      </div>
    </section>
  );
};
