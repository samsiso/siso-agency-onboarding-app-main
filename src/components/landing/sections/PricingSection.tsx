
import { PricingCard } from '@/components/ui/pricing-card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TestimonialCard } from '../TestimonialCard';

// [Analysis] Selected testimonials focused on pricing value and ROI
const pricingTestimonials = [
  {
    name: "Sarah K.",
    role: "Digital Marketing Director",
    company: "Growth Co",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The £1,000+ value is real - we've seen 300% efficiency increase since joining the beta.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  },
  {
    name: "Michael R.",
    role: "Agency Owner",
    company: "Digital Spark",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Securing lifetime access during beta was the best decision. The ROI has been incredible for our agency.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  }
];

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
                  "⚡ Enterprise-grade AI automation suite (£500 value) - Used by 500+ agencies",
                  "⭐ 24/7 Priority support & consulting (£250 value) - 4.9/5 customer rating",
                  "🛡️ Unlimited platform integrations (£250 value) - Enterprise-grade security",
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

        {/* Video Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-center text-2xl font-semibold text-siso-text-bold mb-8">
            Hear from Our Early Adopters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {pricingTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
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
