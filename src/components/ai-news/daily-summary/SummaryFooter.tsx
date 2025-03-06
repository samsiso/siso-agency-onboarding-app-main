
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus, Calendar } from 'lucide-react';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface SummaryFooterProps {
  summaryData: DailySummaryData;
}

// [Analysis] Enhanced footer component with metadata and actions
export function SummaryFooter({ summaryData }: SummaryFooterProps) {
  // Function to handle sharing summary
  const handleShare = () => {
    const formattedDate = format(new Date(summaryData.date), 'yyyy-MM-dd');
    const shareUrl = `${window.location.origin}/ai-news?date=${formattedDate}&summary=true`;
    
    try {
      if (navigator.share) {
        navigator.share({
          title: `AI News Summary - ${format(new Date(summaryData.date), 'MMMM d, yyyy')}`,
          text: `Check out this AI News Summary for ${format(new Date(summaryData.date), 'MMMM d, yyyy')}`,
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied to clipboard",
          description: "Share this link to show others this daily summary",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link to show others this daily summary",
      });
    }
  };
  
  // Function to save/bookmark summary
  const handleSave = () => {
    // This would ideally integrate with a user's bookmarks/saved items
    toast({
      title: "Summary saved",
      description: "You can access this from your saved summaries",
    });
  };
  
  return (
    <CardFooter className="bg-purple-950/30 py-3 text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{new Date(summaryData.created_at).toLocaleString(undefined, { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        
        <Badge variant="outline" className="text-xs bg-purple-900/30">
          {summaryData.article_count} articles
        </Badge>
        
        {summaryData.generated_with === 'openai' && (
          <Badge variant="outline" className="text-xs bg-green-900/30 text-green-300">
            AI-Enhanced
          </Badge>
        )}
        
        {summaryData.analysis_depth && (
          <Badge variant="outline" className="text-xs bg-blue-900/30 text-blue-300">
            {summaryData.analysis_depth} analysis
          </Badge>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={handleSave}
        >
          <BookmarkPlus className="h-3 w-3 mr-1" />
          Save
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={handleShare}
        >
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
    </CardFooter>
  );
}
