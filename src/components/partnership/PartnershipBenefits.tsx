import { memo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Shield, Zap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ValueProp {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  stat: string;
}

const valueProps: ValueProp[] = [
  {
    icon: DollarSign,
    title: "High Commissions",
    description: "Earn 20% on every successful project",
    stat: "Up to £498 per deal"
  },
  {
    icon: Shield,
    title: "Zero Client Risk",
    description: "We build MVP first, payment only after approval",
    stat: "100% risk-free"
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "MVPs delivered in 48-72 hours",
    stat: "48hr delivery"
  },
  {
    icon: Users,
    title: "Full Support",
    description: "We handle all technical aspects and client communication",
    stat: "Complete support"
  }
];

export const PartnershipBenefits = memo(() => {
  return (
    <section id="benefits" className="relative min-h-[80vh] flex items-center px-4 overflow-hidden">
      {/* Section background with dynamic elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Partner with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              SISO
            </span>?
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join the most rewarding partnership program in web development
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => {
            const IconComponent = prop.icon;
            
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="relative h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 
                  border border-gray-700/50 hover:border-orange-500/60 backdrop-blur-sm
                  transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20
                  group-hover:bg-gradient-to-br group-hover:from-gray-800/90 group-hover:via-gray-700/70 group-hover:to-gray-900/90">
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 
                    group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 
                    transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="relative p-8 text-center space-y-6">
                    {/* Enhanced Icon */}
                    <motion.div 
                      className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-red-500/20 
                        rounded-2xl flex items-center justify-center group-hover:from-orange-500/40 
                        group-hover:via-orange-600/50 group-hover:to-red-500/40 transition-all duration-500
                        shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40
                        border border-orange-500/20 group-hover:border-orange-500/40"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <IconComponent className="w-8 h-8 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300">
                      {prop.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                      {prop.description}
                    </p>

                    {/* Stat Badge */}
                    <div className="mx-auto">
                      <motion.div 
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 
                          rounded-full border border-orange-500/30 group-hover:from-orange-500/30 group-hover:to-red-500/30 
                          group-hover:border-orange-500/50 transition-all duration-300
                          shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-sm font-bold text-orange-300 group-hover:text-orange-200 transition-colors duration-300">
                          {prop.stat}
                        </span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}); 