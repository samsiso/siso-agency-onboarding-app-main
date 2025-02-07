
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';
import { Button } from '@/components/ui/button';

const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
  
  // [Analysis] Get all remaining articles for the grid, including other high-impact articles
  const gridItems = featuredItem 
    ? filteredNewsItems.filter(item => item.id !== featuredItem.id)
    : filteredNewsItems;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-8 animate-fade-in">
        {/* Featured News Hero */}
        {featuredItem && (
          <FeaturedNewsHero 
            item={featuredItem} 
            onGenerateSummary={onGenerateSummary}
          />
        )}

        {/* Regular News Grid */}
        {gridItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-4 sm:gap-6"
          >
            {gridItems.map((item) => (
              <motion.div
                key={item.id}
                className="group h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NewsCard
                  item={item}
                  summaries={summaries}
                  loadingSummaries={loadingSummaries}
                  onGenerateSummary={onGenerateSummary}
                  isCompact={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && gridItems.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="bg-siso-bg border-siso-border hover:bg-siso-red/10 hover:text-siso-red"
            >
              Load More Articles
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mt-8">
            <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
          </div>
        )}

        {filteredNewsItems.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-siso-text/60">No news items found matching your search criteria.</p>
          </motion.div>
        )}
      </div>
    </Suspense>
  );
};
