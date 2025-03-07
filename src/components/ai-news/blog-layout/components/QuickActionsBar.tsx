
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, BookmarkPlus, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// [Analysis] This component renders the quick action buttons that float at the top of the article
interface QuickActionsBarProps {
  activeSection?: string;
  sectionTitle?: string;
  liked: boolean;
  handleLike: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

export const QuickActionsBar = ({ 
  activeSection, 
  sectionTitle, 
  liked, 
  handleLike, 
  onBookmark, 
  onShare 
}: QuickActionsBarProps) => {
  return (
    <div className="sticky top-2 z-30 bg-gray-900/80 backdrop-blur-md border border-gray-800/80 rounded-full p-1.5 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "h-9 rounded-full gap-2", 
            liked ? "text-red-400 hover:text-red-500" : "text-gray-400 hover:text-gray-300"
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-red-400")} />
          <span>Like</span>
        </Button>
        
        {onBookmark && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className="h-9 rounded-full gap-2"
          >
            <BookmarkPlus className="h-4 w-4" />
            <span>Save</span>
          </Button>
        )}
        
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="h-9 rounded-full gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        )}
      </div>
      
      <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
        {activeSection ? sectionTitle || 'Reading' : 'Start Reading'}
      </div>
    </div>
  );
};
