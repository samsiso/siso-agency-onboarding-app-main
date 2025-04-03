
import { motion } from 'framer-motion';

export const HeaderTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        Education Hub
      </h1>
      <p className="text-sm md:text-base text-white/70 max-w-lg">
        Discover AI learning resources, courses, and educators
      </p>
    </motion.div>
  );
};

export default HeaderTitle;
