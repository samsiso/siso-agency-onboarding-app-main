
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsItem } from '@/types/blog';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NewsDateSectionProps {
  date: string;
  newsItems: NewsItem[];
  onViewAll?: () => void;
}

export const NewsDateSection = ({
  date,
  newsItems,
  onViewAll
}: NewsDateSectionProps) => {
  const navigate = useNavigate();
  const parsedDate = parseISO(date);
  const isToday = new Date().toDateString() === parsedDate.toDateString();
  
  // [Analysis] Limit to 5 items for a preview section
  const displayItems = newsItems.slice(0, 5);
  
  const handleArticleClick = (id: string) => {
    navigate(`/ai-news/${id}`);
  };
  
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
            className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 hover:bg-gray-900/50 transition-colors cursor-pointer"
            onClick={() => handleArticleClick(item.id)}
          >
            <h3 className="font-medium mb-1 line-clamp-2">{item.title}</h3>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>{item.source}</span>
              <span>{format(new Date(item.date), 'h:mm a')}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
