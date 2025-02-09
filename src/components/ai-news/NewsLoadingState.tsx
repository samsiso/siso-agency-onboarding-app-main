
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsLoadingState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center mt-8"
  >
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
  </motion.div>
);
