
import { memo } from 'react';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Check, Code, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturesSection = memo(() => {
  const features = [
    {
      icon: Code,
      title: "AI-Powered Development",
      description: "Leverage our cutting-edge AI solutions to streamline your agency's development workflow."
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Experience optimal performance with our optimized platforms and frameworks."
    },
    {
      icon: Check,
      title: "Ready-to-Use Solutions",
      description: "Access our library of pre-built solutions to accelerate your client projects."
    },
    {
      icon: Star,
      title: "Premium Resources",
      description: "Gain exclusive access to premium resources curated for agency success."
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <GradientHeading className="text-4xl md:text-5xl font-bold mb-6">
            Platform Features
          </GradientHeading>
          
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Discover how our platform can transform your agency's capabilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-siso-text/10 rounded-xl p-6 hover:border-siso-orange/20 transition-all duration-300"
            >
              <div className="h-12 w-12 mb-4 p-3 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
                <feature.icon className="w-full h-full text-siso-orange" />
              </div>
              
              <h3 className="text-xl font-semibold text-siso-text-bold mb-2">
                {feature.title}
              </h3>
              
              <p className="text-siso-text/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
