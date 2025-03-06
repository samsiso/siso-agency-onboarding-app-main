
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw } from 'lucide-react';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';

interface SummaryHeaderProps {
  formattedDate: string;
  loading: boolean;
  generating: boolean;
  onRefresh: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  hasSummary: boolean;
}

// [Analysis] Extracted header component with admin action buttons
export function SummaryHeader({
  formattedDate,
  loading,
  generating,
  onRefresh,
  activeTab,
  onTabChange,
  hasSummary
}: SummaryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <CardTitle className="text-xl sm:text-2xl text-gradient-purple-blue flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Daily AI News Insights
        </CardTitle>
        <CardDescription className="mt-1">
          {formattedDate}
        </CardDescription>
      </div>

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
      </div>
    </div>
  );
}
