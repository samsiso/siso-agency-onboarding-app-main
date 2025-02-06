import { motion } from 'framer-motion';

export const HeaderTitle = () => {
  return (
    <motion.div 
      className="text-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
        SISO Education Hub
      </h1>
      <p className="text-siso-text/80 max-w-2xl mx-auto">
        Discover expert educators, tutorials, and resources to master AI implementation
      </p>
    </motion.div>
  );
};