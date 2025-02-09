
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleActions } from './ArticleActions';

interface NewsCardContentProps {
  title: string;
  description: string;
  date: string;
  source: string;
  impact: string;
  onReadArticle?: () => void;
  isCompact?: boolean;
  summary?: string;
  loadingSummary?: boolean;
  onGenerateSummary?: () => void;
  newsId?: string;
  comments?: any[];
  readingTime?: number;
  views?: number;
  bookmarks?: number;
  sourceCredibility?: string;
  technicalComplexity?: string;
  articleType?: string;
}

export const NewsCardContent = ({ 
  title, 
  description, 
  date, 
  source, 
  impact,
  onReadArticle,
  isCompact = false,
  summary,
  loadingSummary,
  onGenerateSummary,
  newsId,
  comments = [],
  readingTime = 5,
  views = 0,
  bookmarks = 0,
  sourceCredibility = 'verified',
  technicalComplexity = 'intermediate',
  articleType = 'news'
}: NewsCardContentProps) => {
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
      className={`flex flex-col h-full ${isCompact ? 'pl-0' : 'px-4'}`}
    >
      <div className="space-y-2 sm:space-y-3 mb-4">
        {/* Article Type & Credibility */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 capitalize">
            {articleType}
          </Badge>
          {sourceCredibility === 'verified' && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <Shield className="h-3 w-3 mr-1" />
              Verified Source
            </Badge>
          )}
        </div>

        {/* Title */}
        <button 
          onClick={handleClick}
          className="group block w-full text-left"
        >
          <h2 className={`
            font-bold text-siso-text-bold group-hover:text-siso-red transition-colors
            leading-snug tracking-tight
            ${isCompact 
              ? 'text-base sm:text-lg line-clamp-2' 
              : 'text-xl sm:text-2xl md:text-[28px] line-clamp-3'
            }
          `}>
            {title}
          </h2>
        </button>

        {/* Description */}
        {!isCompact && (
          <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2 leading-relaxed max-w-[95%]">
            {description}
          </p>
        )}
      </div>
      
      <div className="mt-auto">
        <ArticleMetadata
          date={date}
          source={source}
          impact={impact}
          views={views}
          bookmarks={bookmarks}
          readingTime={readingTime}
          sourceCredibility={sourceCredibility}
          technicalComplexity={technicalComplexity}
          articleType={articleType}
          isCompact={isCompact}
        />

        {!isCompact && (
          <ArticleActions
            onReadArticle={handleClick}
            summary={summary}
            loadingSummary={loadingSummary}
            onGenerateSummary={onGenerateSummary}
            newsId={newsId}
            comments={comments}
            title={title}
          />
        )}
      </div>
    </motion.div>
  );
};
