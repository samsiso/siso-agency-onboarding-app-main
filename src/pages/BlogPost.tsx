import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EnhancedBlogLayout } from '@/components/ai-news/EnhancedBlogLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { usePoints } from '@/hooks/usePoints';
import type { EnhancedNewsItem, ContentCategory, TechnicalComplexity, ArticleImpact, ArticleSection } from '@/types/blog';

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
            last_updated,
            article_id,
            overview,
            key_details,
            implications,
            reading_time_minutes,
            category,
            is_featured,
            metadata
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

      // [Analysis] Transform sections ensuring correct field mapping
      const transformedSections: ArticleSection[] = (articleData.article_sections || []).map((section: any) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        order_index: section.order_index,
        section_order: section.section_order || section.order_index,
        technical_complexity: section.technical_complexity || 'intermediate',
        importance_level: section.importance_level || 'medium',
        subsection_type: section.subsection_type || 'overview',
        source_references: typeof section.source_references === 'object' 
          ? section.source_references 
          : {},
        created_at: section.created_at,
        updated_at: section.updated_at,
        last_updated: section.last_updated || section.updated_at,
        article_id: section.article_id || articleData.id,
        overview: section.overview,
        key_details: section.key_details || [],
        bullet_points: [], // Default empty array since it's not in DB
        implications: section.implications || [],
        related_topics: [], // Default empty array since it's not in DB
        key_figures: {}, // Default empty object since it's not in DB
        reading_time_minutes: section.reading_time_minutes || 5,
        category: section.category,
        is_featured: section.is_featured || false,
        metadata: section.metadata || {}
      }));

      // [Analysis] Transform to EnhancedNewsItem with strongly typed sections
      const enhancedArticle: EnhancedNewsItem = {
        id: articleData.id,
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        date: articleData.date,
        category: articleData.category as ContentCategory,
        technical_complexity: (articleData.technical_complexity || 'intermediate') as TechnicalComplexity,
        impact: (articleData.impact || 'medium') as ArticleImpact,
        sections: transformedSections,
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
          ? articleData.technical_details
          : {},
        source_credibility: articleData.source_credibility || 'verified',
        estimated_reading_time: articleData.estimated_reading_time || 5,
        views: articleData.views || 0,
        image_url: articleData.image_url,
        source: articleData.source,
        sources: Array.isArray(articleData.sources) ? articleData.sources.map(String) : []
      };

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
