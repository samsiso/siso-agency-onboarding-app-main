
import { motion } from 'framer-motion';
import { memo } from 'react';

export const NewsEmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <p className="text-siso-text/60">No news items found matching your search criteria.</p>
  </motion.div>
));

NewsEmptyState.displayName = 'NewsEmptyState';

