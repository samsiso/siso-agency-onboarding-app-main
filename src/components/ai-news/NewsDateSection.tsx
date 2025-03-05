
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsItem } from '@/types/blog';
import { CalendarDays, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// [Analysis] Updated interface to include summaries and loading states for AI generation
interface NewsDateSectionProps {
  date: string;
  newsItems: NewsItem[];
  onViewAll?: () => void;
  summaries?: Record<string, string>;
  loadingSummaries?: Record<string, boolean>;
  onGenerateSummary?: (id: string) => Promise<void>;
  loading?: boolean;
}

// [Analysis] List of fallback images for articles without images
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
];

export const NewsDateSection = ({
  date,
  newsItems,
  onViewAll,
  summaries = {},
  loadingSummaries = {},
  onGenerateSummary,
  loading = false
}: NewsDateSectionProps) => {
  const navigate = useNavigate();
  const parsedDate = parseISO(date);
  const isToday = new Date().toDateString() === parsedDate.toDateString();
  
  // [Analysis] Limit to 5 items for a preview section
  const displayItems = newsItems.slice(0, 5);
  
  const handleArticleClick = (id: string) => {
    navigate(`/ai-news/${id}`);
  };
  
  // [Analysis] Get a deterministic fallback image based on article title
  const getFallbackImage = (title: string) => {
    // Simple hash function for the title to pick a consistent image
    const hashCode = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return FALLBACK_IMAGES[hashCode % FALLBACK_IMAGES.length];
  };
  
  // [Framework] Use motion.div for smooth animations when date changes
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold">
            {isToday ? 'Today' : format(parsedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <span className="text-sm text-gray-400">
            ({displayItems.length} articles)
          </span>
        </div>
        
        {onViewAll && newsItems.length > 5 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewAll}
          >
            View all {newsItems.length} articles
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 hover:bg-gray-900/50 transition-colors cursor-pointer flex gap-4"
            onClick={() => handleArticleClick(item.id)}
          >
            {/* Article image */}
            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-800 relative">
              <img 
                src={item.image_url || getFallbackImage(item.title)} 
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, use fallback
                  const target = e.target as HTMLImageElement;
                  if (target.src !== getFallbackImage(item.title)) {
                    target.src = getFallbackImage(item.title);
                  }
                }}
              />
              {/* Media type indicator */}
              <div className="absolute bottom-1 right-1 bg-black/70 p-1 rounded-full">
                {item.article_type === 'video' ? (
                  <Video className="h-3 w-3 text-red-400" />
                ) : (
                  <Image className="h-3 w-3 text-blue-400" />
                )}
              </div>
            </div>
            
            {/* Article content */}
            <div className="flex-1">
              <h3 className="font-medium mb-1 line-clamp-2">{item.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{item.source}</span>
                <span>{format(new Date(item.date), 'h:mm a')}</span>
              </div>
              
              {/* Show summary if available */}
              {summaries[item.id] && (
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {summaries[item.id]}
                </p>
              )}
              
              {/* Generate summary button - only if onGenerateSummary is provided and no summary exists */}
              {onGenerateSummary && !summaries[item.id] && !loadingSummaries[item.id] && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs text-blue-400 mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateSummary(item.id);
                  }}
                >
                  Generate summary
                </Button>
              )}
              
              {/* Loading state for summary generation */}
              {loadingSummaries[item.id] && (
                <p className="text-xs text-gray-400 mt-1 italic">
                  Generating summary...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
