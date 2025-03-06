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
export function SummaryFooter({
  summaryData
}: SummaryFooterProps) {
  // [Analysis] Safely handle created_at which might not always be properly formatted
  // Generate time ago text using created_at
  const timeAgo = summaryData.created_at ? formatDistanceToNow(new Date(summaryData.created_at), {
    addSuffix: true
  }) : 'recently';

  // Handle share functionality
  const handleShare = () => {
    // Create shareable content
    const shareText = `AI News Daily Insights for ${summaryData.date}: ${summaryData.summary.substring(0, 100)}...`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'AI News Daily Insights',
        text: shareText,
        url: shareUrl
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nRead more: ${shareUrl}`);
      // Use toast notification here if available
      alert('Summary link copied to clipboard!');
    }
  };
  return;
}