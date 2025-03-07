
import React from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// [Analysis] This component renders when there is no analysis data
interface EmptyAnalysisStateProps {
  onRefresh?: () => Promise<void>;
  isRefreshing: boolean;
}

export const EmptyAnalysisState = ({ onRefresh, isRefreshing }: EmptyAnalysisStateProps) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-blue-400" />
        <h3 className="font-medium">AI Analysis</h3>
      </div>
      <p className="text-sm text-gray-400 mb-3">No analysis available yet.</p>
      {onRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          Generate Analysis
        </Button>
      )}
    </div>
  );
};
