
import { Calendar, Eye, BookmarkPlus, Clock, Cpu, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticleMetadataProps {
  date: string;
  source: string;
  impact?: string;
  views?: number;
  bookmarks?: number;
  readingTime?: number;
  sourceCredibility?: string;
  technicalComplexity?: string;
  articleType?: string;
  isCompact?: boolean;
}

export const ArticleMetadata = ({
  date,
  source,
  impact = 'medium', // Provide default value
  views = 0,
  bookmarks = 0,
  readingTime = 5,
  sourceCredibility = 'verified',
  technicalComplexity = 'intermediate',
  articleType = 'news',
  isCompact = false,
}: ArticleMetadataProps) => {
  const getImpactColor = (impactLevel: string = 'medium') => {
    switch (impactLevel.toLowerCase()) {
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

  const getTechComplexityColor = (complexity: string = 'intermediate') => {
    switch (complexity.toLowerCase()) {
      case 'advanced':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
      <span className="text-siso-text/60">
        {source}
      </span>
      
      <span className="text-siso-text/40">•</span>
      
      <Badge 
        variant="outline" 
        className={cn(getImpactColor(impact), 'border text-xs font-medium px-2 py-0.5')}
      >
        {impact} Impact
      </Badge>

      <Badge 
        variant="outline" 
        className={cn(getTechComplexityColor(technicalComplexity), 'border text-xs font-medium px-2 py-0.5')}
      >
        <Cpu className="h-3 w-3 mr-1" />
        {technicalComplexity}
      </Badge>

      <span className="text-siso-text/40">•</span>

      <span className="flex items-center gap-1 text-siso-text/60">
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </span>

      {!isCompact && (
        <div className="flex items-center gap-3 text-xs sm:text-sm text-siso-text/60 ml-auto">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            {views} views
          </span>
          <span className="flex items-center gap-1">
            <BookmarkPlus className="h-3 w-3 sm:h-4 sm:w-4" />
            {bookmarks}
          </span>
        </div>
      )}
    </div>
  );
};
