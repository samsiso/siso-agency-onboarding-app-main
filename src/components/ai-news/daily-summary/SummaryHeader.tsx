
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <CardTitle className="text-xl sm:text-2xl text-gradient-purple-blue flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Daily AI News Insights
        </CardTitle>
        <CardDescription className="mt-1">
          {formattedDate} • {articleCount} {articleCount === 1 ? 'article' : 'articles'} analyzed
          {summaryData?.generated_with === 'openai' && (
            <Badge variant="outline" className="bg-green-950/30 border-green-500/30 text-green-400 ml-2">
              AI Enhanced
            </Badge>
          )}
          {summaryData?.analysis_depth === 'comprehensive' && (
            <Badge variant="outline" className="bg-blue-950/30 border-blue-500/30 text-blue-400 ml-2">
              Comprehensive
            </Badge>
          )}
          {summaryData?.generated_with === 'error_fallback' && (
            <Badge variant="outline" className="bg-yellow-950/30 border-yellow-500/30 text-yellow-400 ml-2">
              Basic
            </Badge>
          )}
        </CardDescription>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="border-purple-500/30 hover:bg-purple-950/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          
          <Button
            size="sm"
            onClick={onGenerate}
            disabled={generating}
            className="bg-purple-800 hover:bg-purple-700"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {summaryData ? 'Regenerate' : 'Generate'} Summary
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
