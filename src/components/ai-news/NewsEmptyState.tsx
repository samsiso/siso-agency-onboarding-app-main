
import { motion } from 'framer-motion';

export const NewsEmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <p className="text-siso-text/60">No news items found matching your search criteria.</p>
  </motion.div>
);
