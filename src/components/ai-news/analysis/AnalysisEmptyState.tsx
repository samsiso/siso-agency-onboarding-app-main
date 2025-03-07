
import React from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisEmptyStateProps {
  onRefresh: () => void;
}

export const AnalysisEmptyState: React.FC<AnalysisEmptyStateProps> = ({ onRefresh }) => {
  // [Analysis] Add handler to prevent default behavior
  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRefresh();
  };
  
  return (
    <div className="p-6 text-center text-gray-400 bg-gray-900/30 rounded-md">
      <Brain className="h-10 w-10 text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-1">No Analysis Available</h3>
      <p>This article hasn't been analyzed by our AI system yet.</p>
      <Button 
        onClick={handleGenerateClick} 
        variant="outline" 
        className="mt-4 border-blue-800 text-blue-300 hover:bg-blue-900/30"
      >
        Generate Analysis Now
      </Button>
    </div>
  );
};
