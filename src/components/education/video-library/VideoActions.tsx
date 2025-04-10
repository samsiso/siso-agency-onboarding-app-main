
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, ThumbsUp, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { safeSupabase } from '@/utils/supabaseHelpers';

interface VideoActionsProps {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  userId?: string;
  isBookmarked: boolean;
  isCompleted?: boolean;
  onBookmarkChange: (bookmarked: boolean) => void;
  onCompletionChange?: (completed: boolean) => void;
}

export const VideoActions = ({ 
  videoId, 
  videoUrl, 
  videoTitle,
  userId,
  isBookmarked,
  isCompleted,
  onBookmarkChange,
  onCompletionChange
}: VideoActionsProps) => {
  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please sign in to bookmark videos');
      return;
    }

    try {
      if (isBookmarked) {
        await safeSupabase
          .from('video_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('video_id', videoId);
        onBookmarkChange(false);
        toast.success('Video removed from bookmarks');
      } else {
        await safeSupabase
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

  const handleCompletion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please sign in to mark videos as completed');
      return;
    }

    try {
      if (isCompleted) {
        await safeSupabase
          .from('video_progress')
          .update({ completed: false, completed_at: null })
          .eq('user_id', userId)
          .eq('video_id', videoId);
        onCompletionChange?.(false);
        toast.success('Video marked as not completed');
      } else {
        await safeSupabase
          .from('video_progress')
          .upsert({
            user_id: userId,
            video_id: videoId,
            completed: true,
            completed_at: new Date().toISOString(),
            progress: 100
          });
        onCompletionChange?.(true);
        toast.success('Video marked as completed');
      }
    } catch (error) {
      console.error('Error updating completion status:', error);
      toast.error('Failed to update completion status');
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
        className={cn(
          "h-8 w-8 bg-black/50 hover:bg-black/70",
          isCompleted && "text-green-500"
        )}
        onClick={handleCompletion}
        aria-label={isCompleted ? "Mark as not completed" : "Mark as completed"}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
      
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
