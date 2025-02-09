
import { lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { useInView } from 'react-intersection-observer';
import { NewsTabs } from './NewsTabs';
import { NewsLoadingState } from './NewsLoadingState';
import { NewsEmptyState } from './NewsEmptyState';

// [Analysis] Lazy load NewsCard for better initial load performance
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
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  // [Analysis] Implement infinite scroll
  useEffect(() => {
    if (inView && !loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, loading, hasMore, onLoadMore]);

  // [Analysis] Filter news items based on search query
  const filteredNewsItems = newsItems.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  // [Analysis] Get items for different tabs using the materialized view
  const trendingItems = [...filteredNewsItems]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);
  const latestItems = [...filteredNewsItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mostDiscussedItems = [...filteredNewsItems]
    .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
    .slice(0, 6);
  
  // [Analysis] Get the most recent high-impact article for the hero section
  const featuredItem = filteredNewsItems.find(item => item.impact?.toLowerCase() === 'high');

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery}
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={containerVariants}
          className="space-y-8"
        >
          {featuredItem && (
            <motion.div variants={itemVariants} className="w-full">
              <FeaturedNewsHero 
                item={featuredItem} 
                onGenerateSummary={onGenerateSummary}
              />
            </motion.div>
          )}

          <NewsTabs
            latestItems={latestItems}
            trendingItems={trendingItems}
            mostDiscussedItems={mostDiscussedItems}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={onGenerateSummary}
          />

          {/* Infinite Scroll Trigger */}
          {hasMore && !loading && filteredNewsItems.length > 0 && (
            <div ref={ref} className="h-10" />
          )}

          {/* Loading State */}
          {loading && <NewsLoadingState />}

          {/* No Results State */}
          {filteredNewsItems.length === 0 && !loading && <NewsEmptyState />}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};
