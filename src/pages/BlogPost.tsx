
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthSession();
  const { awardPoints } = usePoints(user?.id);

  // [Analysis] Fetch blog post with relations
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_news')
        .select(`
          *,
          ai_news_summaries (summary)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // [Analysis] Track reading progress
  useEffect(() => {
    if (!user?.id || !id) return;

    const trackProgress = async () => {
      const { error } = await supabase
        .from('article_reading_progress')
        .upsert({
          article_id: id,
          user_id: user.id,
          progress: 0,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'article_id,user_id'
        });

      if (error) {
        console.error('Error tracking progress:', error);
      }
    };

    trackProgress();
  }, [id, user?.id]);

  // [Analysis] Handle upvote
  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote articles",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('article_upvotes')
        .insert({
          article_id: id,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already upvoted",
            description: "You have already upvoted this article",
          });
        } else {
          throw error;
        }
        return;
      }

      await awardPoints('upvote_article');
      toast({
        title: "Success",
        description: "Article upvoted successfully!",
      });
    } catch (error) {
      console.error('Error upvoting:', error);
      toast({
        title: "Error",
        description: "Failed to upvote article",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
          <Sidebar />
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!post) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/ai-news')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>

            <article className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-siso-red/10 text-siso-red border-none">
                    {post.category}
                  </Badge>
                  <Badge variant="outline" className="bg-siso-orange/10 text-siso-orange border-none">
                    {post.impact} Impact
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-siso-text-bold">
                  {post.title}
                </h1>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-siso-text/60">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.source}</span>
                  <span>•</span>
                  <span>{post.reading_time} min read</span>
                </div>
              </div>

              {/* Featured image */}
              {post.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-xl border border-siso-border">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-siso-text/80 leading-relaxed">
                  {post.description}
                </p>
                {post.content && (
                  <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-8 border-t border-siso-border">
                <Button
                  variant="outline"
                  onClick={handleUpvote}
                  className="hover:bg-siso-red/10 hover:text-siso-red"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Upvote ({post.upvotes || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.share({
                      title: post.title,
                      text: post.description,
                      url: window.location.href
                    });
                  }}
                  className="hover:bg-siso-red/10 hover:text-siso-red"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;
