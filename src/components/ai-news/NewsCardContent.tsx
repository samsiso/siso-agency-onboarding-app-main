import { Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface NewsCardContentProps {
  title: string;
  description: string;
  date: string;
  source: string;
  impact: string;
  onReadArticle?: () => void;
}

export const NewsCardContent = ({ 
  title, 
  description, 
  date, 
  source, 
  impact,
  onReadArticle 
}: NewsCardContentProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-siso-red/10 text-siso-red';
    }
  };

  const handleClick = () => {
    if (onReadArticle) {
      onReadArticle();
    }
    window.open(source, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4"
    >
      <div>
        <button 
          onClick={handleClick}
          className="group block w-full text-left"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold group-hover:text-siso-red transition-colors line-clamp-2">
            {title}
          </h2>
        </button>
        <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">
          {description}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1 text-xs sm:text-sm text-siso-text/60">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        
        <Button 
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
          onClick={handleClick}
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Read Article
        </Button>

        <Badge 
          variant="outline" 
          className={`${getImpactColor(impact)} border-none text-xs`}
        >
          {impact} Impact
        </Badge>
      </div>
    </motion.div>
  );
};