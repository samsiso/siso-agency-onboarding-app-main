import { Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface NewsCardContentProps {
  title: string;
  description: string;
  date: string;
  source: string;
  impact: string;
}

export const NewsCardContent = ({ 
  title, 
  description, 
  date, 
  source, 
  impact 
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4"
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold hover:text-siso-red transition-colors line-clamp-2">
          {title}
        </h2>
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
        
        <a 
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red transition-colors"
        >
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          Source
        </a>

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