
import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

// [Analysis] This component renders the header of the AI Analysis panel
interface AIAnalysisHeaderProps {
  onViewDetails: () => void;
}

export const AIAnalysisHeader = ({ onViewDetails }: AIAnalysisHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-blue-400" />
        <h3 className="font-medium">AI Analysis</h3>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewDetails}
        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
      >
        View Details
      </Button>
    </div>
  );
};
