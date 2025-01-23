import { Calendar, ExternalLink, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';
import { NewsCardComments } from './NewsCardComments';

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
  comments = []
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
      className={`flex flex-col h-full ${isCompact ? 'pl-0' : 'px-4'}`}
    >
      <div className="space-y-2 sm:space-y-3">
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

        {!isCompact && (
          <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2 leading-relaxed max-w-[95%]">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-auto">
        <span className="text-siso-text/60">
          {source}
        </span>
        
        <span className="text-siso-text/40">•</span>
        
        <Badge 
          variant="outline" 
          className={`${getImpactColor(impact)} border text-xs font-medium px-2 py-0.5`}
        >
          {impact} Impact
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
            <Button 
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
              onClick={handleClick}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Read
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => !summary && onGenerateSummary?.()}
              className="h-8 px-2 text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
            >
              {loadingSummary ? (
                "Generating..."
              ) : (
                <Dialog>
                  <DialogTrigger className="flex items-center">
                    {summary ? "View AI Summary" : "Generate AI Summary"}
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
              )}
            </Button>

            {newsId && comments && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
                asChild
              >
                <DialogTrigger>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                    {comments.length}
                  </div>
                </DialogTrigger>
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};