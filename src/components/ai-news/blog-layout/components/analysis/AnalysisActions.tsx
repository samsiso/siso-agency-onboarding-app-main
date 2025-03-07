
import React from 'react';
import { RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// [Analysis] This component renders the action buttons for the analysis
interface AnalysisActionsProps {
  onRefresh?: () => Promise<void>;
  isRefreshing: boolean;
  // [Plan] Add share handler if we implement sharing functionality
}

export const AnalysisActions = ({ onRefresh, isRefreshing }: AnalysisActionsProps) => {
  return (
    <div className="flex justify-between mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
        Update
      </Button>
      
      <Button
        variant="outline"
        size="sm"
      >
        <Share2 className="h-3 w-3 mr-1" />
        Share
      </Button>
    </div>
  );
};
