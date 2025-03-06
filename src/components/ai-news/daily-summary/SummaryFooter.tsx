
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';

interface SummaryFooterProps {
  summaryData: DailySummaryData;
}

// [Analysis] Extracted footer component with metadata
export function SummaryFooter({ summaryData }: SummaryFooterProps) {
  return (
    <CardFooter className="bg-purple-950/30 py-2 text-xs text-muted-foreground flex justify-between">
      <div>
        Generated {new Date(summaryData.created_at).toLocaleString()}
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs bg-purple-900/30">
          {summaryData.article_count} articles
        </Badge>
        {summaryData.generated_with === 'openai' && (
          <Badge variant="outline" className="text-xs bg-green-900/30 text-green-300">
            AI-Enhanced
          </Badge>
        )}
      </div>
    </CardFooter>
  );
}
