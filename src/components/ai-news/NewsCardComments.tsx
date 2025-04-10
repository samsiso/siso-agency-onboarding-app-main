
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { safeSupabase } from '@/utils/supabaseHelpers';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { usePoints } from '@/hooks/usePoints';

interface NewsComment {
  id: string;
  content: string;
  created_at: string;
  user_email: string;
  news_id: string;
  updated_at: string;
}

interface NewsCardCommentsProps {
  newsId: string;
  comments: NewsComment[];
}

export const NewsCardComments = ({ newsId, comments }: NewsCardCommentsProps) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const { awardPoints } = usePoints(undefined);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment cannot be empty",
        description: "Please enter a comment before submitting.",
      });
      return;
    }

    try {
      const { data: { session } } = await safeSupabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to comment.",
        });
        return;
      }

      // Fixed insertion to use singular object not array, and include user_id
      const { error } = await safeSupabase
        .from('news_comments')
        .insert({
          news_id: newsId,
          content: newComment.trim(),
          user_email: session.user.email,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      await awardPoints('comment_article');
      setNewComment('');
      toast({
        title: "Comment added successfully",
        description: "You earned 5 points for commenting!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCommenting(!isCommenting)}
        className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
      >
        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="ml-1">{comments.length}</span>
      </Button>

      <AnimatePresence>
        {isCommenting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-10"
          >
            <div className="space-y-4 bg-card/60 p-4 rounded-lg border border-siso-border">
              <div className="space-y-3">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background p-3 rounded-lg border border-siso-border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-siso-text-muted">{comment.user_email}</p>
                      <p className="text-xs text-siso-text-muted">{formatDate(comment.created_at)}</p>
                    </div>
                    <p className="text-sm text-siso-text">{comment.content}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-background text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddComment}
                  className="text-xs hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
