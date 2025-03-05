
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsItem } from '@/types/blog';
import { CalendarDays, Image, Video, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item) => (
          <motion.div 
            key={item.id}
            className="overflow-hidden rounded-lg border border-gray-800 bg-gray-950/50 hover:bg-gray-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-gray-700 h-full flex flex-col cursor-pointer"
            whileHover={{ y: -5 }}
            onClick={() => handleArticleClick(item.id)}
          >
            {/* Article image with media type indicator */}
            <div className="relative h-48 overflow-hidden bg-gray-900">
              <img 
                src={item.image_url || getFallbackImage(item.title)} 
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                onError={(e) => {
                  // If image fails to load, use fallback
                  const target = e.target as HTMLImageElement;
                  if (target.src !== getFallbackImage(item.title)) {
                    target.src = getFallbackImage(item.title);
                  }
                }}
              />
              
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Media type indicator */}
              <div className="absolute bottom-3 right-3 bg-black/70 p-1.5 rounded-full">
                {item.article_type === 'video' ? (
                  <Video className="h-4 w-4 text-red-400" />
                ) : (
                  <Image className="h-4 w-4 text-blue-400" />
                )}
              </div>
              
              {/* Source badge */}
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300 text-xs">
                  {item.source}
                </Badge>
              </div>
              
              {/* Date indicator */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                <CalendarDays className="h-3 w-3" />
                <span>{format(new Date(item.date), 'MMM d')}</span>
              </div>
            </div>
            
            {/* Article content */}
            <div className="flex-1 p-4 flex flex-col">
              <h3 className="font-medium text-lg mb-2 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              
              <div className="mt-2 mb-3">
                <p className="text-sm text-gray-300 line-clamp-2">
                  {item.description || "No description available"}
                </p>
              </div>
              
              <div className="mt-auto pt-3 border-t border-gray-800">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <span>{format(new Date(item.date), 'h:mm a')}</span>
                  </div>
                  
                  {/* Impact indicator */}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs border px-2 py-0.5",
                      item.impact === 'high' 
                        ? "bg-red-500/10 text-red-400 border-red-500/30" 
                        : item.impact === 'medium'
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-green-500/10 text-green-400 border-green-500/30"
                    )}
                  >
                    {item.impact || 'medium'} impact
                  </Badge>
                </div>
              </div>
              
              {/* Show summary if available */}
              {summaries[item.id] && (
                <div className="mt-3 p-2 bg-purple-500/5 border border-purple-500/10 rounded text-xs text-gray-300">
                  <p className="line-clamp-2">{summaries[item.id]}</p>
                </div>
              )}
              
              {/* Generate summary button - only if onGenerateSummary is provided and no summary exists */}
              {onGenerateSummary && !summaries[item.id] && !loadingSummaries[item.id] && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 p-0 h-auto text-xs text-blue-400 w-full justify-start hover:text-blue-300 hover:bg-blue-900/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateSummary(item.id);
                  }}
                >
                  Generate AI summary
                </Button>
              )}
              
              {/* Loading state for summary generation */}
              {loadingSummaries[item.id] && (
                <p className="text-xs text-gray-400 mt-2 italic">
                  Generating summary...
                </p>
              )}
              
              {/* External link indicator if URL exists */}
              {item.url && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <ExternalLink className="h-3 w-3" />
                  <span>External source</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Loading state */}
      {loading && displayItems.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse border border-gray-800 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-800/50"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-800/50 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800/30 rounded w-full"></div>
                <div className="h-4 bg-gray-800/30 rounded w-5/6"></div>
                <div className="h-10 mt-4 pt-2 border-t border-gray-800/30">
                  <div className="h-4 bg-gray-800/30 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {!loading && displayItems.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg bg-gray-900/30">
          <Image className="h-12 w-12 mx-auto text-gray-600 mb-3" />
          <h3 className="text-xl font-medium text-gray-400">No articles found</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            There are no articles published on this date or matching your search criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};
