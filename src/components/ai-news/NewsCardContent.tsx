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
  isCompact?: boolean;
}

export const NewsCardContent = ({ 
  title, 
  description, 
  date, 
  source, 
  impact,
  onReadArticle,
  isCompact = false
}: NewsCardContentProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-siso-red/10 text-siso-red border-siso-red/20';
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
      className="space-y-2 sm:space-y-3"
    >
      <div className="space-y-2">
        <button 
          onClick={handleClick}
          className="group block w-full text-left"
        >
          <h2 className={`${isCompact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-siso-text-bold group-hover:text-siso-red transition-colors line-clamp-2`}>
            {title}
          </h2>
        </button>
        {!isCompact && (
          <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs sm:text-sm text-siso-text/60">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        
        <Badge 
          variant="outline" 
          className={`${getImpactColor(impact)} border text-xs`}
        >
          {impact} Impact
        </Badge>

        {!isCompact && (
          <Button 
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors ml-auto"
            onClick={handleClick}
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Read Article
          </Button>
        )}
      </div>
    </motion.div>
  );
};