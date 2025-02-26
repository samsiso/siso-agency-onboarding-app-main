
import { motion } from 'framer-motion';
import { lazy, memo, useState } from 'react';
import { Calendar, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

interface NewsTabContentProps {
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateGrouping, setDateGrouping] = useState<boolean>(false);

  // [Analysis] Group articles by date for better organization when date grouping is enabled
  const groupedByDate = dateGrouping ? items.reduce((groups, item) => {
    const date = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, any[]>) : {};

  // [Analysis] Determine the grid columns based on view mode
  const gridClass = viewMode === 'grid' 
    ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
    : "flex flex-col gap-4";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end mb-4 gap-2">
        <Button
          variant={dateGrouping ? "default" : "outline"}
          size="sm"
          onClick={() => setDateGrouping(!dateGrouping)}
          className="h-8"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Group by Date
        </Button>
        <Button
          variant={viewMode === 'grid' ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="h-8"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-8"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>

      {dateGrouping ? (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, dateItems]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2">
                {date}
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={gridClass}
              >
                {dateItems.map((item) => (
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
                      isCompact={viewMode === 'list'}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={gridClass}
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
                isCompact={viewMode === 'list'}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
});

NewsTabContent.displayName = 'NewsTabContent';
