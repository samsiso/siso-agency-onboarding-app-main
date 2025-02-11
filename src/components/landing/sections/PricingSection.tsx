
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
          {/* Main Pricing Card */}
          <PricingCard
            title="Complete Platform Access"
            description="Get instant access to our complete platform with all premium features. No credit card required."
            price={249}
            features={[
              {
                title: "Premium Features",
                items: [
                  "⚡ Enterprise-grade AI automation suite - Used by 500+ agencies",
                  "⭐ 24/7 Priority support & consulting - 4.9/5 customer rating",
                  "🛡️ Unlimited platform integrations - Enterprise-grade security",
                  "Regular feature updates and improvements",
                ],
              },
              {
                title: "Additional Benefits",
                items: [
                  "Standard Plan: £249/year",
                  "Enterprise Plan: £999/year",
                  "Access to all future updates",
                  "Trusted by 1000+ agencies worldwide",
                ],
              },
            ]}
            buttonText="Get Started Now"
            onButtonClick={handleGetStarted}
            trustMessage="Join 500+ agencies already using our platform. Start transforming your workflow today."
          />
        </motion.div>

        {/* Trust Banner */}
        <motion.div 
          className="mt-12 text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
