import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';

export const useBlogPostActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBlogPost = async (title: string, content: string, authorId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ title, content, author_id: authorId }]);

      if (error) {
        console.error("Error creating blog post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create blog post",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      return true;
    } catch (error) {
      console.error("Unexpected error creating blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unexpected error occurred",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBlogPostById = async (postId: string): Promise<BlogPost | null> => {
    setLoading(true);
    try {
      const response = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      // Handle potential null data safely
      const post = response.data || null;
      if (!post) {
        throw new Error('Post not found');
      }

      return post as BlogPost;
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch blog post",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogPost = async (postId: string, title: string, content: string) => {
    setLoading(true);
    try {
      const response = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      // Handle potential null data safely
      const existingPost = response.data || null;
      if (!existingPost) {
        throw new Error('Post not found');
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update({ title, content })
        .eq('id', postId);

      if (error) {
        console.error("Error updating blog post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update blog post",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Unexpected error updating blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unexpected error occurred",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error("Error deleting blog post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete blog post",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Unexpected error deleting blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unexpected error occurred",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createBlogPost,
    getBlogPostById,
    updateBlogPost,
    deleteBlogPost,
  };
};
