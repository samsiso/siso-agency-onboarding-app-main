
import { motion } from 'framer-motion';
import { memo } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsEmptyStateProps {
  searchQuery?: string;
  onClear?: () => void;
}

export const NewsEmptyState = memo(({ searchQuery, onClear }: NewsEmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 flex flex-col items-center space-y-4"
  >
    <div className="bg-muted rounded-full p-6">
      <SearchX className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-medium mt-4">No news items found</h3>
    <p className="text-muted-foreground max-w-md">
      {searchQuery 
        ? `No news items found matching "${searchQuery}".` 
        : "No news items found matching your search criteria."}
    </p>
    {searchQuery && onClear && (
      <Button onClick={onClear} variant="outline" className="mt-4">
        Clear Search
      </Button>
    )}
  </motion.div>
));

NewsEmptyState.displayName = 'NewsEmptyState';
