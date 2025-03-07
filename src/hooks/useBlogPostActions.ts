
import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// [Analysis] Enhanced hook with improved social sharing capabilities
export const useBlogPostActions = () => {
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);

  const handleShare = async (title?: string, description?: string) => {
    const shareData = {
      title: title || 'AI News',
      text: description || 'Check out this interesting AI news article',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Content has been shared"
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Sharing failed",
          description: "Could not share the content",
          variant: "destructive"
        });
      }
    }
  };

  const handleBookmark = async (newsId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already bookmarked
      const { data: existingBookmark, error: checkError } = await supabase
        .from('ai_news_bookmarks')
        .select('id')
        .eq('news_id', newsId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingBookmark) {
        // Remove bookmark if it exists
        const { error: deleteError } = await supabase
          .from('ai_news_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);
        
        if (deleteError) throw deleteError;
        
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        });
      } else {
        // Add bookmark if it doesn't exist
        const { error: insertError } = await supabase
          .from('ai_news_bookmarks')
          .insert([
            {
              news_id: newsId,
              user_id: user.id
            }
          ]);
  
        if (insertError) throw insertError;
  
        await awardPoints('bookmark_article');
        
        toast({
          title: "Bookmarked",
          description: "Article saved to your bookmarks",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
      console.error('Bookmark error:', error);
    }
  };

  return {
    handleShare,
    handleBookmark
  };
};
