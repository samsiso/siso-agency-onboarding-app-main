import { Calendar, ExternalLink, MessageSquare, BookmarkPlus, Share2, Eye, Clock, ChevronRight, Shield, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';
import { NewsCardComments } from './NewsCardComments';
import { cn } from '@/lib/utils';
import { AIAnalysisDialog } from './AIAnalysisDialog';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

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
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);

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

  const getTechComplexityColor = (complexity: string) => {
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

        {/* Technical Info */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-siso-text/60">
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
      </div>
      
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-auto">
        {/* Source & Date */}
        <span className="text-siso-text/60">
          {source}
        </span>
        
        <span className="text-siso-text/40">•</span>
        
        {/* Impact Badge */}
        <Badge 
          variant="outline" 
          className={`${getImpactColor(impact)} border text-xs font-medium px-2 py-0.5`}
        >
          {impact} Impact
        </Badge>

        {/* Technical Complexity */}
        <Badge 
          variant="outline" 
          className={`${getTechComplexityColor(technicalComplexity)} border text-xs font-medium px-2 py-0.5`}
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
          <div className="flex items-center gap-2 ml-auto">
            {/* Read Button */}
            <Button 
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
              onClick={handleClick}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Read Article
            </Button>

            {/* AI Analysis Button */}
            <Dialog open={aiAnalysisOpen} onOpenChange={setAiAnalysisOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  AI Analysis
                </Button>
              </DialogTrigger>
            </Dialog>
            <AIAnalysisDialog 
              open={aiAnalysisOpen} 
              onOpenChange={setAiAnalysisOpen}
              newsId={newsId || ''}
            />

            {/* AI Summary Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => !summary && onGenerateSummary?.()}
                  className="h-8 px-2 text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                >
                  {loadingSummary ? "Generating..." : summary ? "View AI Summary" : "Generate AI Summary"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>AI Summary & Share Options</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6 py-4">
                  {summary ? (
                    <div className="bg-card p-3 sm:p-4 rounded-lg border border-siso-red/20">
                      <p className="text-sm sm:text-base">{summary}</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      {loadingSummary ? "Generating summary..." : "Click the button to generate a summary"}
                    </div>
                  )}
                  
                  <ShareButtons summary={summary || ''} title={title} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Comments Dialog */}
            {newsId && comments && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      {comments.length}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                  </DialogHeader>
                  <NewsCardComments newsId={newsId} comments={comments} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
