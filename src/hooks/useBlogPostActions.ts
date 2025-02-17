
import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBlogPostActions = () => {
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);

  const handleShare = async (title?: string, description?: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href
        });
      } catch (error) {
        // User canceled share
        console.log('Share canceled');
      }
    } else {
      // Fallback
      toast({
        title: "Share",
        description: "Copy link: " + window.location.href,
      });
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
      const { error } = await supabase
        .from('ai_news_bookmarks')
        .insert([
          {
            news_id: newsId,
            user_id: user.id
          }
        ]);

      if (error) throw error;

      await awardPoints('read_article');
      
      toast({
        title: "Success",
        description: "Article bookmarked successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to bookmark article",
        variant: "destructive"
      });
    }
  };

  return {
    handleShare,
    handleBookmark
  };
};
