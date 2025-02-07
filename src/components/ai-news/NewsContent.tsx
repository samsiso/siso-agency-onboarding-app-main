
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FeaturedNewsHero } from './FeaturedNewsHero';

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
}

export const NewsContent = ({
  newsItems,
  searchQuery,
  summaries,
  loadingSummaries,
  onGenerateSummary
}: NewsContentProps) => {
  const filteredNewsItems = newsItems.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  // [Analysis] Separate featured and regular news items for different layouts
  const featuredItems = filteredNewsItems.filter(item => item.impact?.toLowerCase() === 'high');
  const regularItems = filteredNewsItems.filter(item => item.impact?.toLowerCase() !== 'high');

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-8 animate-fade-in">
        {/* Featured News Hero */}
        {featuredItems.length > 0 && (
          <FeaturedNewsHero 
            item={featuredItems[0]} 
            onGenerateSummary={onGenerateSummary}
          />
        )}

        {/* Regular News Grid */}
        {regularItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4 sm:gap-6"
          >
            {regularItems.map((item) => (
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

        {filteredNewsItems.length === 0 && (
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
