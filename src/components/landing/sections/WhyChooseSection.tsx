
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Bot, Users, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyChooseSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Custom AI Agency Agent",
      description: "Experience our AI agent that learns your agency's unique needs, analyzes our resource bank, and delivers personalized recommendations for tools and growth strategies."
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Learn from over 1,000 successful agency owners. See exactly which solutions are driving results for agencies like yours and implement proven strategies in your business."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay ahead with a platform that updates multiple times daily. Get instant access to new technologies and implementation guides as soon as they become available."
    },
    {
      icon: Globe,
      title: "Integrated Resource Hub",
      description: "Access a comprehensive suite of agency tools, step-by-step implementation guides, and educational resources - all designed to help you scale efficiently."
    }
  ];

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-full filter blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-siso-orange/10 to-siso-red/10 rounded-full filter blur-[100px] animate-float-slower" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          {/* Decorative ring behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-full filter blur-[50px]" />
          
          <GradientHeading variant="secondary" className="text-4xl md:text-5xl font-bold mb-6 relative">
            Supercharge Your Agency Growth
          </GradientHeading>

          {/* Separator */}
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-siso-red to-siso-orange rounded-full" />
          
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto relative">
            Transform your business with AI-powered tools and proven strategies from successful agency owners
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300 blur-xl" />
              
              <div className="relative bg-black/20 backdrop-blur-sm border border-siso-text/10 rounded-xl p-6 hover:border-siso-orange/20 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {/* Icon background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-siso-red to-siso-orange opacity-20 rounded-lg blur-md transform group-hover:scale-110 transition-transform duration-300" />
                    
                    <div className="relative p-3 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 group-hover:from-siso-red/20 group-hover:to-siso-orange/20 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-siso-orange animate-float-subtle" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-siso-text-bold bg-gradient-to-r from-white to-white/90 bg-clip-text">
                      {feature.title}
                    </h3>
                    <p className="text-siso-text/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
