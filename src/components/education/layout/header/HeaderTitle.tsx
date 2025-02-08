
import { motion } from 'framer-motion';

export const HeaderTitle = () => {
  return (
    <motion.div 
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* [Analysis] Larger title with enhanced gradient effect */}
      <h1 className="text-5xl font-bold text-white">
        SISO Education Hub
      </h1>
      {/* [Analysis] Improved subtitle visibility */}
      <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
        Discover expert educators, tutorials, and resources to master AI implementation
      </p>
    </motion.div>
  );
};
