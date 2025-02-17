import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EnhancedBlogLayout } from '@/components/ai-news/EnhancedBlogLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import type { EnhancedNewsItem, ContentCategory, TechnicalComplexity, ArticleImpact } from '@/types/blog';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);

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

      // Using 'read_article' as the point action type since there isn't a specific bookmark action
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

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      // Fetch the main article data with comments
      const { data: articleData, error: articleError } = await supabase
        .from('ai_news')
        .select(`
          *,
          article_sections (
            id,
            title,
            content,
            order_index,
            section_order,
            technical_complexity,
            importance_level,
            subsection_type,
            source_references,
            created_at,
            updated_at,
            last_updated
          ),
          article_tags (
            id,
            tag,
            created_at
          ),
          news_comments (
            id,
            content,
            created_at,
            user_email,
            updated_at
          )
        `)
        .eq('id', id)
        .single();

      if (articleError) throw articleError;

      // Transform the data to match our EnhancedNewsItem type
      const enhancedArticle = {
        ...articleData,
        category: articleData.category as ContentCategory,
        technical_complexity: (articleData.technical_complexity || 'intermediate') as TechnicalComplexity,
        impact: (articleData.impact || 'medium') as ArticleImpact,
        sections: articleData.article_sections?.map(section => ({
          ...section,
          importance_level: section.importance_level || 'medium',
          subsection_type: section.subsection_type || 'overview',
          source_references: typeof section.source_references === 'object' ? section.source_references || {} : {},
          section_order: section.section_order || section.order_index,
          last_updated: section.last_updated || section.updated_at
        })) || [],
        tags: articleData.article_tags || [],
        key_takeaways: Array.isArray(articleData.key_takeaways) 
          ? articleData.key_takeaways.map(item => String(item))
          : [],
        related_articles: Array.isArray(articleData.related_articles) 
          ? articleData.related_articles.map((article: any) => ({
              id: article.id || '',
              title: article.title || '',
              description: article.description || ''
            }))
          : [],
        table_of_contents: Array.isArray(articleData.table_of_contents)
          ? articleData.table_of_contents.map((item: any) => ({
              id: item.id || '',
              title: item.title || '',
              level: typeof item.level === 'number' ? item.level : 1
            }))
          : [],
        technical_details: typeof articleData.technical_details === 'object' 
          ? articleData.technical_details || {}
          : {},
        source_credibility: articleData.source_credibility || 'verified',
        estimated_reading_time: articleData.estimated_reading_time || 5,
        views: articleData.views || 0
      } as EnhancedNewsItem;

      const comments = (articleData.news_comments || []).map(comment => ({
        ...comment,
        news_id: id
      }));

      return {
        ...enhancedArticle,
        comments
      };
    },
  });

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
