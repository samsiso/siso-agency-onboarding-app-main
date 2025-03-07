
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus, ExternalLink } from 'lucide-react';

// [Analysis] This component renders the sidebar action buttons
interface SidebarActionsProps {
  onShare?: () => void;
  onBookmark?: () => void;
  handleExternalLink?: () => void;
  hasExternalUrl: boolean;
}

export const SidebarActions = ({ 
  onShare, 
  onBookmark, 
  handleExternalLink,
  hasExternalUrl
}: SidebarActionsProps) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
      <div className="flex flex-col gap-3">
        {onShare && (
          <Button 
            variant="outline" 
            onClick={onShare} 
            className="w-full justify-start gap-2 hover:bg-blue-900/20 hover:text-blue-300 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share Article
          </Button>
        )}
        
        {onBookmark && (
          <Button 
            variant="outline" 
            onClick={onBookmark} 
            className="w-full justify-start gap-2 hover:bg-purple-900/20 hover:text-purple-300 transition-colors"
          >
            <BookmarkPlus className="h-4 w-4" />
            Bookmark for Later
          </Button>
        )}
        
        {hasExternalUrl && handleExternalLink && (
          <Button 
            variant="outline" 
            onClick={handleExternalLink} 
            className="w-full justify-start gap-2 hover:bg-amber-900/20 hover:text-amber-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Original Source
          </Button>
        )}
      </div>
    </div>
  );
};
