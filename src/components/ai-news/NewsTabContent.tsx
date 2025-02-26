
import { motion } from 'framer-motion';
import { lazy, memo } from 'react';

const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

export interface NewsTabContentProps {
  items: any[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

// [Analysis] Added stagger effect for smoother content transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3
    }
  }
};

// [Analysis] Individual item animations for consistent transitions
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// [Analysis] Memoized component to prevent unnecessary re-renders
export const NewsTabContent = memo(({
  items,
  summaries,
  loadingSummaries,
  onGenerateSummary
}: NewsTabContentProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="group h-full min-h-[300px] flex"
        >
          <NewsCard
            item={item}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={onGenerateSummary}
            isCompact={false}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

NewsTabContent.displayName = 'NewsTabContent';
