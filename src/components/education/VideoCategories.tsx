
import { motion } from 'framer-motion';
import { useVideoCategories } from '@/hooks/education/use-video-categories';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface VideoCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const VideoCategories = ({
  selectedCategory,
  onCategorySelect
}: VideoCategoriesProps) => {
  const { data: categories, isLoading } = useVideoCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategorySelect('all')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
          selectedCategory === 'all'
            ? "bg-gradient-to-r from-siso-red to-siso-orange text-white"
            : "bg-siso-bg-alt hover:bg-siso-text/10 text-siso-text"
        )}
      >
        All Videos
      </motion.button>
      
      {categories?.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategorySelect(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            selectedCategory === category.slug
              ? "bg-gradient-to-r from-siso-red to-siso-orange text-white"
              : "bg-siso-bg-alt hover:bg-siso-text/10 text-siso-text"
          )}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};
