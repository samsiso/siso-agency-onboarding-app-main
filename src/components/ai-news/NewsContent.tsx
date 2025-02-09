
import { lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Clock, Eye, MessageSquare } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInView } from 'react-intersection-observer';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Lazy load NewsCard for better initial load performance
const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

// [Analysis] Improved error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-red-500 mb-4">Something went wrong:</p>
    <pre className="text-sm mb-4">{error.message}</pre>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

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
  const { toast } = useToast();
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

  // [Analysis] Filter news items based on search query with memoization
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
          {/* Featured News Hero with improved transitions */}
          {featuredItem && (
            <motion.div variants={itemVariants} className="w-full">
              <FeaturedNewsHero 
                item={featuredItem} 
                onGenerateSummary={onGenerateSummary}
              />
            </motion.div>
          )}

          {/* Tabs for content organization */}
          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="latest" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="discussed" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Most Discussed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="mt-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
              >
                {latestItems.map((item) => (
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
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
              >
                {trendingItems.map((item) => (
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
            </TabsContent>

            <TabsContent value="discussed" className="mt-6">
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
              >
                {mostDiscussedItems.map((item) => (
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
            </TabsContent>
          </Tabs>

          {/* Infinite Scroll Trigger */}
          {hasMore && !loading && filteredNewsItems.length > 0 && (
            <div ref={ref} className="h-10" />
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
