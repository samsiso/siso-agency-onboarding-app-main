
import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Clock, Eye, MessageSquare } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  // [Analysis] Get items for different tabs
  const trendingItems = [...filteredNewsItems].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
  const latestItems = [...filteredNewsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mostDiscussedItems = [...filteredNewsItems].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 6);
  
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

          {/* Load More Button with consistent positioning */}
          {hasMore && !loading && filteredNewsItems.length > 0 && (
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
