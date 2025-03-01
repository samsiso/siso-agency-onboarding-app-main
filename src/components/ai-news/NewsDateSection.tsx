
import { memo } from 'react';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import { NewsLoadingState } from './NewsLoadingState';
import { NewsEmptyState } from './NewsEmptyState';
import { NewsItem } from '@/types/blog';
import { format, isToday } from 'date-fns';

interface NewsDateSectionProps {
  date: Date;
  items: NewsItem[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  loading?: boolean;
}

// [Analysis] Animation variants for staggered card appearance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.08,
    }
  }
};

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

export const NewsDateSection = memo(({
  date,
  items = [],
  summaries,
  loadingSummaries,
  onGenerateSummary,
  loading = false
}: NewsDateSectionProps) => {
  const dateDisplay = isToday(date) 
    ? 'Today' 
    : format(date, 'MMMM d, yyyy');

  if (loading) {
    return <NewsLoadingState />;
  }

  if (items.length === 0) {
    return (
      <NewsEmptyState 
        message={`No articles found for ${dateDisplay}`}
        suggestion="Try selecting a different date or syncing new articles."
      />
    );
  }

  return (
    <motion.div
      key={date.toISOString()}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
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
      </motion.div>
    </motion.div>
  );
});

NewsDateSection.displayName = 'NewsDateSection';
