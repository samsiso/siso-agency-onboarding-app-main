
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EnhancedBlogLayout } from '@/components/ai-news/EnhancedBlogLayout';
import { fetchBlogPost } from '@/services/blog-post.service';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';

const BlogPost = () => {
  const { id } = useParams();
  const { handleShare, handleBookmark } = useBlogPostActions();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => fetchBlogPost(id as string),
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
            onShare={() => handleShare(post.title, post.description)}
            onBookmark={() => handleBookmark(post.id)}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;
