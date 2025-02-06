import { motion } from 'framer-motion';

export const HeaderTitle = () => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
          SISO Education Hub
        </h1>
        <p className="text-lg text-siso-text/80 max-w-2xl mx-auto">
          Discover expert educators, tutorials, and resources to master AI implementation
        </p>
      </div>
    </motion.div>
  );
};