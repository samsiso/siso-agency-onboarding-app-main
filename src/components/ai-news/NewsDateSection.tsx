
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsLoadingState } from './NewsLoadingState';
import NewsCard from './NewsCard';
import { NewsItem } from '@/types/blog';
import { AlertTriangle } from 'lucide-react';

interface NewsDateSectionProps {
  date: Date;
  items: NewsItem[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  loading?: boolean;
}

// [Analysis] Enhanced component to display news items for a specific date
export const NewsDateSection = ({
  date,
  items,
  summaries,
  loadingSummaries,
  onGenerateSummary,
  loading = false
}: NewsDateSectionProps) => {
  // If loading, show loading state
  if (loading) {
    return <NewsLoadingState />;
  }

  // If no items for this date, show empty state
  if (items.length === 0) {
    return (
      <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-900/20 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Articles Available</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          We couldn't find any articles published on {format(date, 'MMMM d, yyyy')}.
        </p>
        <p className="text-sm text-gray-500">
          Try selecting another date or use the search to find specific topics.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={onGenerateSummary}
          />
        ))}
      </div>
    </motion.div>
  );
};

// [Analysis] A separate component for showing empty results message
export const EmptyResultsMessage = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-800/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
      <p className="text-gray-400 max-w-md mx-auto">
        We couldn't find any articles matching your criteria. Try adjusting your filters or search terms.
      </p>
    </div>
  );
};
