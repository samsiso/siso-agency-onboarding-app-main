import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_email: string;
}

interface NewsCardCommentsProps {
  newsId: string;
  comments: Comment[];
}

export const NewsCardComments = ({ newsId, comments }: NewsCardCommentsProps) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('news_comments')
      .insert([
        {
          news_id: newsId,
          content: newComment,
          user_email: 'anonymous@example.com'
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding comment",
        description: error.message,
      });
      return;
    }

    setNewComment('');
  };

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCommenting(!isCommenting)}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        {comments.length} Comments
      </Button>

      {isCommenting && (
        <div className="space-y-4 bg-card/60 p-4 rounded-lg">
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-background p-2 rounded">
                <p className="text-xs text-siso-text/60">{comment.user_email}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-background rounded px-2 py-1 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddComment}
              className="text-xs hover:bg-siso-red/10 hover:text-siso-red transition-colors"
            >
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};