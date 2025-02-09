
import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { Button } from '@/components/ui/button';

const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
  </div>
);

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

interface NewsContentProps {
  newsItems: any[];
  searchQuery: string;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const NewsContent = ({
  newsItems,
  searchQuery,
  summaries,
  loadingSummaries,
  onGenerateSummary,
  loading = false,
  hasMore = false,
  onLoadMore
}: NewsContentProps) => {
  // [Analysis] Filter news items based on search query
  const filteredNewsItems = newsItems.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  // [Analysis] Get the most recent high-impact article for the hero section
  const featuredItem = filteredNewsItems.find(item => item.impact?.toLowerCase() === 'high');
  
  // [Analysis] Get all remaining articles for the grid
  const gridItems = featuredItem 
    ? filteredNewsItems.filter(item => item.id !== featuredItem.id)
    : filteredNewsItems;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery} // Force re-render on search change
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Featured News Hero with improved transitions */}
          {featuredItem && (
            <motion.div
              variants={itemVariants}
              className="w-full"
            >
              <FeaturedNewsHero 
                item={featuredItem} 
                onGenerateSummary={onGenerateSummary}
              />
            </motion.div>
          )}

          {/* Regular News Grid - Updated with consistent sizing */}
          {gridItems.length > 0 && (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
            >
              {gridItems.map((item) => (
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
          )}

          {/* Load More Button with consistent positioning */}
          {hasMore && !loading && gridItems.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mt-8"
            >
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="bg-siso-bg border-siso-border hover:bg-siso-red/10 hover:text-siso-red min-w-[200px]"
              >
                Load More Articles
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mt-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
            </motion.div>
          )}

          {/* No Results State */}
          {filteredNewsItems.length === 0 && !loading && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <p className="text-siso-text/60">No news items found matching your search criteria.</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};
