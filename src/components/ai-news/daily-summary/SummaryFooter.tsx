
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Share2, Bookmark, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryFooterProps {
  summaryData: DailySummaryData;
}

export function SummaryFooter({ summaryData }: SummaryFooterProps) {
  // [Analysis] Safely handle updated_at which might not be in the type definition
  // Generate time ago text using created_at as fallback
  const timeAgo = summaryData.created_at 
    ? formatDistanceToNow(new Date(summaryData.created_at), { addSuffix: true })
    : 'recently';
  
  // Handle share functionality
  const handleShare = () => {
    // Create shareable content
    const shareText = `AI News Daily Insights for ${summaryData.date}: ${summaryData.summary.substring(0, 100)}...`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'AI News Daily Insights',
        text: shareText,
        url: shareUrl,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nRead more: ${shareUrl}`);
      // Use toast notification here if available
      alert('Summary link copied to clipboard!');
    }
  };
  
  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-purple-500/20 pt-4 pb-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <InfoIcon className="h-3.5 w-3.5" />
        <span>
          Generated {timeAgo} using
          <Badge variant="outline" className="ml-1 bg-purple-950/30 text-purple-300">
            {summaryData.generated_with || 'AI'}
          </Badge>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-xs flex gap-1 items-center" onClick={handleShare}>
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs flex gap-1 items-center">
          <Bookmark className="h-3.5 w-3.5" />
          Save
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs flex gap-1 items-center">
          <FileText className="h-3.5 w-3.5" />
          Full Report
        </Button>
      </div>
    </CardFooter>
  );
}
