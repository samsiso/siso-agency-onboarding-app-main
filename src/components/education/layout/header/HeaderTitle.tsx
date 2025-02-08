
import { motion } from 'framer-motion';
import { GradientHeading } from '@/components/ui/gradient-heading';

export const HeaderTitle = () => {
  return (
    <motion.div 
      className="flex-1 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* [Analysis] Using GradientHeading for consistent styling */}
      <GradientHeading
        size="lg"
        variant="sunset"
        className="!pb-2 tracking-tight"
      >
        SISO Education Hub
      </GradientHeading>
      <p className="text-lg text-siso-text/80 max-w-2xl font-medium">
        Discover expert educators, tutorials, and resources to master AI implementation
      </p>
    </motion.div>
  );
};
