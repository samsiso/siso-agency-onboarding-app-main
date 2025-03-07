
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/blog';
import { NewsEmptyState } from './NewsEmptyState';
import { NewsLoadingState } from './NewsLoadingState';
import { EnhancedNewsCard } from './EnhancedNewsCard';
import { GradientSectionTitle } from './GradientSectionTitle';
import { BookOpen } from 'lucide-react';

interface NewsContentProps {
  newsItems: NewsItem[];
  searchQuery: string;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  onAnalyzeArticle?: (id: string) => Promise<void>;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

// [Analysis] Updated to use enhanced cards with animations
export function NewsContent({
  newsItems,
  searchQuery,
  summaries,
  loadingSummaries,
  onGenerateSummary,
  onAnalyzeArticle,
  loading,
  hasMore,
  onLoadMore
}: NewsContentProps) {
  // Filter news items by search query if provided
  const filteredItems = searchQuery 
    ? newsItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())))
    : newsItems;
    
  // Show loading state when fetching news
  if (loading && filteredItems.length === 0) {
    return <NewsLoadingState />;
  }
  
  // Show empty state when no news items match search
  if (filteredItems.length === 0) {
    return <NewsEmptyState searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-8">
      <GradientSectionTitle 
        title="Latest AI News" 
        subtitle={`Showing ${filteredItems.length} articles${searchQuery ? ` matching "${searchQuery}"` : ''}`}
        icon={<BookOpen className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <EnhancedNewsCard 
              item={item} 
              onAnalyzeArticle={onAnalyzeArticle} 
            />
          </motion.div>
        ))}
      </div>
      
      {/* Load more button with enhanced styling */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            className="border-blue-800 hover:border-blue-700 hover:bg-blue-950/30 bg-blue-950/10"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
};
