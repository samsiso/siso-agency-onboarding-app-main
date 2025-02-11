
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Users, TrendingUp, Target, Zap, Headphones, Check } from 'lucide-react';

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
        {/* Pricing Header */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
              border border-siso-orange/20 text-sm text-siso-orange mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Limited Time Beta Access
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
            Enterprise Features,<br />Beta Price
          </h2>
          <p className="text-xl text-siso-text/70">
            Join 500+ successful agencies already growing their business with our AI-powered platform
          </p>
        </motion.div>

        {/* Value Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: Target, 
              label: "Active Users", 
              value: "500+",
              subtext: "and growing fast",
              color: "from-green-500/20 to-green-600/20 border-green-500/20"
            },
            { 
              icon: Star, 
              label: "Customer Rating", 
              value: "4.9/5",
              subtext: "from 200+ reviews",
              color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/20"
            },
            { 
              icon: ShieldCheck, 
              label: "Security", 
              value: "Enterprise",
              subtext: "grade protection",
              color: "from-blue-500/20 to-blue-600/20 border-blue-500/20"
            },
            { 
              icon: TrendingUp, 
              label: "Success Rate", 
              value: "98%",
              subtext: "client satisfaction",
              color: "from-purple-500/20 to-purple-600/20 border-purple-500/20"
            }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} 
                border border-opacity-20 p-6 hover:scale-105 transition-all duration-300`}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full filter blur-xl 
                group-hover:scale-150 transition-transform duration-500" />
              <item.icon className="w-8 h-8 text-siso-orange mb-4" />
              <div className="space-y-1">
                <div className="text-2xl font-bold text-siso-text">{item.value}</div>
                <div className="text-sm font-medium text-siso-text/70">{item.label}</div>
                <div className="text-xs text-siso-text/50">{item.subtext}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Pricing Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Spots Counter */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-siso-red to-siso-orange 
            text-white px-6 py-2 rounded-full text-sm font-semibold z-10 whitespace-nowrap shadow-lg">
            🎉 Limited Time Beta Offer - Only 563 spots remaining
          </div>

          {/* Value Highlight Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Zap, title: "AI Automation", value: "£500", desc: "Enterprise-grade suite" },
              { icon: Headphones, title: "24/7 Support", value: "£250", desc: "Priority consulting" },
              { icon: Users, title: "Integrations", value: "£250", desc: "Unlimited access" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-siso-red/5 to-siso-orange/5 
                  border border-siso-orange/20"
              >
                <item.icon className="w-8 h-8 text-siso-orange mx-auto mb-2" />
                <div className="text-lg font-semibold text-siso-text">{item.title}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-siso-orange to-siso-red 
                  text-transparent bg-clip-text">{item.value}</div>
                <div className="text-sm text-siso-text/70">{item.desc}</div>
              </motion.div>
            ))}
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

        {/* Trust Banner */}
        <motion.div 
          className="mt-12 text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
