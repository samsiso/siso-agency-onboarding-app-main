
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EnhancedBlogLayout } from '@/components/ai-news/EnhancedBlogLayout';
import { fetchBlogPost } from '@/services/blog-post.service';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NewsComment } from '@/types/blog';

const BlogPost = () => {
  const { postId } = useParams(); // [Analysis] Changed from 'id' to 'postId' to match App.tsx route parameter
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleShare, handleBookmark } = useBlogPostActions();

  // [Analysis] Added additional logging to debug the ID issue
  console.log('BlogPost - postId from params:', postId);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: () => fetchBlogPost(postId as string),
    // [Q] Is there a race condition if postId is undefined during initial render?
    // [Analysis] Don't fetch if postId is undefined
    enabled: !!postId,
    // [Analysis] Add error handling to show user-friendly messages
    retry: 1,
    meta: {
      onError: (err: any) => {
        console.error('Error loading blog post:', err);
        toast({
          variant: "destructive",
          title: "Failed to load article",
          description: "There was an error loading this article. Please try again.",
        });
      }
    }
  });

  // [Analysis] New function to handle external article links
  const handleExternalLink = () => {
    if (post?.url) {
      window.open(post.url, '_blank', 'noopener,noreferrer');
    }
  };

  // [Analysis] Go back to news list
  const handleGoBack = () => {
    navigate('/ai-news');
  };

  // [Analysis] More detailed logging for debugging
  console.log('BlogPost - post data:', post);
  console.log('BlogPost - error:', error);

  // [Analysis] Loading state with improved UI
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex-1 p-8">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
            
            <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
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

  // [Analysis] Error state with retry option
  if (error || !post) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex-1 p-8">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
            
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-red-500/10 p-4 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
              <p className="text-gray-400 max-w-md mb-8">
                We couldn't load this article. It may have been removed or is currently unavailable.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleGoBack}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // [Analysis] For external articles, add option to visit original source
  const isExternalArticle = !!post.url;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1">
          {isExternalArticle && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 m-4 rounded-lg flex items-center justify-between">
              <p>This article is from an external source.</p>
              <Button 
                variant="outline" 
                onClick={handleExternalLink}
                className="ml-4 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
              >
                Visit Original <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          <EnhancedBlogLayout
            article={post}
            onShare={() => handleShare(post.title, post.description)}
            onBookmark={() => handleBookmark(post.id)}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;
