import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { safeSupabase } from '@/utils/supabaseHelpers';
import FeatureFlags from '@/utils/featureFlags';
import { safeGet } from '@/utils/typeHelpers';

export const useBlogPostActions = () => {
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);
  const isDailyNewsEnabled = FeatureFlags.dailyNews;

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
    if (!isDailyNewsEnabled) {
      toast({
        title: "Feature disabled",
        description: "The Daily News feature is currently disabled",
        variant: "destructive"
      });
      return;
    }
    
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
      const { data: existingBookmark, error: checkError } = await safeSupabase
        .from('ai_news_bookmarks')
        .select('id')
        .eq('news_id', newsId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // Safely access the bookmark ID to avoid TypeScript errors
      const bookmarkId = existingBookmark ? safeGet(existingBookmark, 'id', '') : '';
      
      if (bookmarkId) {
        // Remove bookmark if it exists
        const { error: deleteError } = await safeSupabase
          .from('ai_news_bookmarks')
          .delete()
          .eq('id', bookmarkId);
        
        if (deleteError) throw deleteError;
        
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        });
      } else {
        // Add bookmark if it doesn't exist
        const { error: insertError } = await safeSupabase
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

  const safeFetchBlogPost = async (blogId: string) => {
    try {
      const { data, error } = await safeSupabase
        .from('blog_posts')
        .select('*')
        .eq('id', blogId)
        .single();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        return null;
      }
      
      // Add non-null check before accessing data
      if (data && typeof data === 'object' && 'id' in data) {
        return data as { id: string; [key: string]: any };
      }
      
      return null;
    } catch (error) {
      console.error('Error in safeFetchBlogPost:', error);
      return null;
    }
  };

  return {
    handleShare,
    handleBookmark,
    safeFetchBlogPost
  };
};

export const safeFetchBlogPost = async (blogId: string) => {
  try {
    const { data, error } = await safeSupabase
      .from('blog_posts')
      .select('*')
      .eq('id', blogId)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    
    // Add non-null check before accessing data
    if (data && typeof data === 'object' && 'id' in data) {
      return data as { id: string; [key: string]: any };
    }
    
    return null;
  } catch (error) {
    console.error('Error in safeFetchBlogPost:', error);
    return null;
  }
};
