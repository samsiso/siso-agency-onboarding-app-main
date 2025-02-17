
import { lazy, Suspense, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { useInView } from 'react-intersection-observer';
import NewsTabs from './NewsTabs';
import { NewsLoadingState } from './NewsLoadingState';
import { NewsEmptyState } from './NewsEmptyState';

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

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  const filteredNewsItems = useMemo(() => {
    if (!searchQuery) return newsItems;
    const searchLower = searchQuery.toLowerCase();
    return newsItems.filter(item => 
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  }, [newsItems, searchQuery]);

  const { trendingItems, latestItems, mostDiscussedItems, featuredItem } = useMemo(() => {
    const trending = [...filteredNewsItems]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
    
    const latest = [...filteredNewsItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const mostDiscussed = [...filteredNewsItems]
      .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
      .slice(0, 6);

    const featured = filteredNewsItems.find(item => item.impact?.toLowerCase() === 'high');

    return { trendingItems: trending, latestItems: latest, mostDiscussedItems: mostDiscussed, featuredItem: featured };
  }, [filteredNewsItems]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore]);

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
            <motion.div 
              variants={containerVariants} 
              className="w-full rounded-xl overflow-hidden shadow-lg"
            >
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
