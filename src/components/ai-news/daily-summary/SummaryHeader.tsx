
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw } from 'lucide-react';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';

interface SummaryHeaderProps {
  formattedDate: string;
  articleCount: number;
  summaryData: DailySummaryData | null;
  generating: boolean;
  isAdmin: boolean;
  onGenerate: () => void;
  onRefresh: () => void;
  loading: boolean;
}

// [Analysis] Extracted header component with admin action buttons
export function SummaryHeader({
  formattedDate,
  articleCount,
  summaryData,
  generating,
  isAdmin,
  onGenerate,
  onRefresh,
  loading
}: SummaryHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-xl text-purple-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span>Today's AI Highlights</span>
          <Badge variant="outline" className="ml-2 bg-purple-800/50 text-xs">
            {formattedDate}
          </Badge>
        </CardTitle>
        <CardDescription>
          {summaryData 
            ? `A summary of ${summaryData.article_count || articleCount} AI news articles published today`
            : 'Daily highlights of the most important AI developments'}
        </CardDescription>
      </div>
      
      <div className="flex gap-2">
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenerate}
            disabled={generating}
            className="bg-purple-900/30 border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : summaryData ? 'Regenerate' : 'Generate Summary'}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="bg-purple-900/30 border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
