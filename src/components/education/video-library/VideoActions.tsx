import { Button } from '@/components/ui/button';
import { Bookmark, Share2, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VideoActionsProps {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  userId?: string;
  isBookmarked: boolean;
  onBookmarkChange: (bookmarked: boolean) => void;
}

export const VideoActions = ({ 
  videoId, 
  videoUrl, 
  videoTitle,
  userId,
  isBookmarked,
  onBookmarkChange
}: VideoActionsProps) => {
  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please sign in to bookmark videos');
      return;
    }

    try {
      if (isBookmarked) {
        await supabase
          .from('video_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('video_id', videoId);
        onBookmarkChange(false);
        toast.success('Video removed from bookmarks');
      } else {
        await supabase
          .from('video_bookmarks')
          .insert([{ user_id: userId, video_id: videoId }]);
        onBookmarkChange(true);
        toast.success('Video bookmarked');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: videoTitle,
        text: `Check out this video: ${videoTitle}`,
        url: videoUrl
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying link
      navigator.clipboard.writeText(videoUrl);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="icon"
        variant="secondary"
        className="h-8 w-8 bg-black/50 hover:bg-black/70"
        onClick={(e) => e.stopPropagation()}
        aria-label="Upvote video"
      >
        <div className="flex flex-col items-center">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-xs mt-0.5">0</span>
        </div>
      </Button>
      <Button
        size="icon"
        variant="secondary"
        className="h-8 w-8 bg-black/50 hover:bg-black/70"
        onClick={handleBookmark}
        aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        className="h-8 w-8 bg-black/50 hover:bg-black/70"
        onClick={handleShare}
        aria-label="Share video"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
