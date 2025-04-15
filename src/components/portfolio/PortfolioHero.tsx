
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { ArrowRight } from 'lucide-react';

export const PortfolioHero = () => {
  return (
    <div className="relative py-20 px-4">
      <Spotlight className="-top-40 left-0 md:left-60" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-6"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-lg px-4 py-2 text-sm font-medium text-siso-orange mb-4"
        >
          Our Work
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
          Featured Projects
        </h1>
        <p className="text-lg md:text-xl text-siso-text/80 max-w-2xl mx-auto">
          Explore our showcase of innovative solutions and successful collaborations that have helped businesses transform their digital presence
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <a 
            href="#portfolio-grid" 
            className="inline-flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors"
          >
            See our work <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
