
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';

export const PortfolioHero = () => {
  return (
    <div className="relative py-16 px-4">
      <Spotlight className="-top-40 left-0 md:left-60" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
          Our Portfolio
        </h1>
        <p className="text-lg text-siso-text/80 max-w-2xl mx-auto">
          Explore our showcase of innovative projects and successful collaborations
        </p>
      </motion.div>
    </div>
  );
};
