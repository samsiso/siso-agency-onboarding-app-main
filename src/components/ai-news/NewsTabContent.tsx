
import { memo } from 'react';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import { NewsLoadingState } from './NewsLoadingState';
import { NewsEmptyState } from './NewsEmptyState';
import { NewsItem } from '@/types/blog';

interface NewsTabContentProps {
  items: NewsItem[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  loading?: boolean;
}

// [Analysis] Animation variants for staggered card appearance
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

export const NewsTabContent = memo(({
  items = [],
  summaries,
  loadingSummaries,
  onGenerateSummary,
  loading = false
}: NewsTabContentProps) => {
  if (loading) {
    return <NewsLoadingState />;
  }

  if (items.length === 0) {
    return <NewsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <NewsCard
            item={item}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={onGenerateSummary}
          />
        </motion.div>
      ))}
    </div>
  );
});

NewsTabContent.displayName = 'NewsTabContent';
