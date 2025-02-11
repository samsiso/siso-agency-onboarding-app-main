
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Users, TrendingUp } from 'lucide-react';

export const PricingSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section id="pricing" className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-siso-red/20 to-siso-orange/20 rounded-full filter blur-3xl opacity-30 animate-float" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-siso-orange/20 to-siso-red/20 rounded-full filter blur-3xl opacity-30 animate-float-delayed" />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
            Enterprise Features, Beta Price
          </h2>
          <p className="text-lg text-siso-text/70 max-w-2xl mx-auto">
            Join 500+ successful agencies already growing their business with our AI-powered platform
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: "500+ Active Users", value: "Growing Fast" },
            { icon: Star, label: "Customer Rating", value: "4.9/5" },
            { icon: ShieldCheck, label: "Secure Platform", value: "Enterprise Grade" },
            { icon: TrendingUp, label: "Success Rate", value: "98%" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-siso-red/5 to-siso-orange/5 
                border border-siso-orange/20 hover:border-siso-orange/40 transition-all duration-300"
            >
              <item.icon className="w-6 h-6 text-siso-orange mb-2" />
              <div className="text-sm text-siso-text/70">{item.label}</div>
              <div className="font-semibold text-siso-text">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Special Offer Banner */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-siso-red to-siso-orange 
            text-white px-6 py-2 rounded-full text-sm font-semibold z-10 whitespace-nowrap shadow-lg">
            🎉 Limited Time Beta Offer - 563 spots remaining
          </div>

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
        </motion.div>

        {/* Bottom Trust Banner */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-siso-text/60">
            Trusted by agencies worldwide with £10M+ processed through our platform. 
            30-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
