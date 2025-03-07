
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Share2, Bookmark, Facebook, Twitter, Linkedin, X, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';

// [Analysis] Dialog-based AI analysis component for better UX and screen space utilization
interface AIAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
  isLoading: boolean;
  articleTitle?: string;
  articleDescription?: string;
  articleId?: string;
}

export const AIAnalysisDialog = ({ 
  isOpen, 
  onClose, 
  analysis, 
  isLoading,
  articleTitle,
  articleDescription,
  articleId
}: AIAnalysisDialogProps) => {
  const { handleShare, handleBookmark } = useBlogPostActions();
  
  // [Plan] Centralize sharing functionality to reduce code duplication
  const handleShareClick = (platform?: string) => {
    const shareText = `${articleTitle} - AI Analysis`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    } else {
      // Use the generic sharing function
      handleShare(articleTitle, articleDescription);
    }
  };
  
  const handleBookmarkClick = () => {
    if (articleId) {
      handleBookmark(articleId);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Analysis
              </span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-900 border-gray-700"
                onClick={handleBookmarkClick}
              >
                <Bookmark className="h-4 w-4 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-900 border-gray-700"
                onClick={() => handleShareClick()}
              >
                <Share2 className="h-4 w-4 text-blue-400" />
              </Button>
            </div>
          </div>
          <DialogDescription className="text-gray-400">
            {articleTitle || 'AI-powered insights for this article'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCcw className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : analysis ? (
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Key Insights</h4>
              <ul className="space-y-2">
                {analysis.key_insights?.map((insight: string, i: number) => (
                  <li key={i} className="text-sm text-white/70 flex items-start gap-2 bg-white/5 p-3 rounded-lg">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Market Impact</h4>
              <p className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">{analysis.market_impact}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Technology Predictions</h4>
              <ul className="space-y-2">
                {analysis.tech_predictions?.map((prediction: string, i: number) => (
                  <li key={i} className="text-sm text-white/70 flex items-start gap-2 bg-white/5 p-3 rounded-lg">
                    <span className="text-emerald-400 mt-1">→</span>
                    <span>{prediction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80">Related Technologies</h4>
              <div className="flex flex-wrap gap-2 bg-white/5 p-3 rounded-lg">
                {analysis.related_technologies?.map((tech: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-white/10 border-blue-900/50">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-white/60">Analysis Confidence</span>
              <Badge variant="outline" className={cn(
                "bg-white/5",
                analysis.confidence_score >= 0.8 ? "text-green-400" :
                analysis.confidence_score >= 0.6 ? "text-yellow-400" :
                "text-red-400"
              )}>
                {Math.round((analysis.confidence_score || 0.7) * 100)}%
              </Badge>
            </div>
            
            <div className="flex flex-col pt-4 space-y-2">
              <h4 className="text-sm font-medium text-white/80">Share Analysis</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-blue-900/20 border-blue-800 hover:bg-blue-800/30"
                  onClick={() => handleShareClick('twitter')}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-blue-900/20 border-blue-800 hover:bg-blue-800/30"
                  onClick={() => handleShareClick('facebook')}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-blue-900/20 border-blue-800 hover:bg-blue-800/30"
                  onClick={() => handleShareClick('linkedin')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-sm text-white/60 text-center">
            No analysis available for this article
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
