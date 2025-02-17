
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EnhancedBlogLayout } from '@/components/ai-news/EnhancedBlogLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import type { EnhancedNewsItem } from '@/types/blog';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      // Fetch the main article data
      const { data: articleData, error: articleError } = await supabase
        .from('ai_news')
        .select(`
          *,
          article_sections (
            id,
            title,
            content,
            order_index,
            technical_complexity,
            created_at,
            updated_at
          ),
          article_tags (
            id,
            tag,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (articleError) throw articleError;

      // Transform the data to match our EnhancedNewsItem type
      const enhancedArticle: EnhancedNewsItem = {
        ...articleData,
        sections: articleData.article_sections || [],
        tags: articleData.article_tags || [],
      };

      return enhancedArticle;
    },
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.description,
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

  const handleBookmark = async () => {
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
            news_id: id,
            user_id: user.id
          }
        ]);

      if (error) throw error;

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

  if (isLoading || !post) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-48 bg-siso-border rounded" />
              <div className="h-64 w-full bg-siso-border rounded" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-siso-border rounded" />
                <div className="h-4 w-2/3 bg-siso-border rounded" />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1">
          <EnhancedBlogLayout
            article={post}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;
