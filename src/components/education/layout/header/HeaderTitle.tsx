
import { motion } from 'framer-motion';
import { GradientHeading } from '@/components/ui/gradient-heading';

export const HeaderTitle = () => {
  // [Analysis] Simplified header with focused content and better spacing
  return (
    <motion.div 
      className="flex-1 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <GradientHeading
          size="lg"
          className="!pb-2 tracking-tight text-4xl md:text-5xl"
          variant="sunset"
        >
          SISO Education Hub
        </GradientHeading>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-3 py-1.5 bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-full border border-siso-orange/30"
        >
          <span className="text-xs font-semibold text-siso-orange flex items-center gap-1.5">
            <span className="w-2 h-2 bg-siso-orange rounded-full animate-pulse" />
            Live Learning
          </span>
        </motion.div>
      </div>

      <motion.p
        className="text-xl text-siso-text/90 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Discover expert educators, tutorials, and resources
      </motion.p>
    </motion.div>
  );
};
