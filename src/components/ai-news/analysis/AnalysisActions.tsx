
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Bookmark, Loader2 } from 'lucide-react';

interface AnalysisActionsProps {
  isLoading: boolean;
  onRefresh: () => void;
  onShare: () => void;
  onBookmark: () => void;
}

export const AnalysisActions: React.FC<AnalysisActionsProps> = ({ 
  isLoading, 
  onRefresh, 
  onShare, 
  onBookmark 
}) => {
  // [Analysis] Prevent default action for all button clicks to avoid page refresh
  const handleButtonClick = (callback: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  };

  return (
    <div className="flex justify-between items-center gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleButtonClick(onRefresh)}
        disabled={isLoading}
        className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Refresh Analysis
          </>
        )}
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={handleButtonClick(onShare)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={handleButtonClick(onBookmark)}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Bookmark
        </Button>
      </div>
    </div>
  );
};
