import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MessageCircle } from 'lucide-react';
import { ShareButtons } from './ShareButtons';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface NewsCardProps {
  item: any;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_email: string;
}

const NewsCard = ({ 
  item, 
  summaries, 
  loadingSummaries, 
  onGenerateSummary 
}: NewsCardProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to realtime comments
    const channel = supabase
      .channel('news-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news_comments',
          filter: `news_id=eq.${item.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments(prev => [...prev, payload.new as Comment]);
          }
        }
      )
      .subscribe();

    // Fetch existing comments
    fetchComments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('news_comments')
      .select('*')
      .eq('news_id', item.id)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching comments",
        description: error.message,
      });
      return;
    }

    setComments(data || []);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('news_comments')
      .insert([
        {
          news_id: item.id,
          content: newComment,
          user_email: 'anonymous@example.com' // In a real app, this would come from auth
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:bg-card/60 transition-colors duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-1/4 max-w-[300px] mx-auto sm:mx-0">
              <img
                src={item.image_url}
                alt={item.title}
                className="rounded-lg object-cover w-full aspect-video"
              />
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold hover:text-siso-red transition-colors line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">{item.description}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-siso-text/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span>{item.source}</span>
                <span className="bg-siso-red/10 text-siso-red px-2 py-1 rounded text-xs">
                  {item.impact} Impact
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCommenting(!isCommenting)}
                  className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {comments.length} Comments
                </Button>
              </div>

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

              <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => !summaries[item.id] && onGenerateSummary(item.id)}
                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors w-full sm:w-auto"
                    >
                      {loadingSummaries[item.id] ? (
                        "Generating Summary..."
                      ) : (
                        "View AI Summary"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>AI Summary & Share Options</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 sm:space-y-6 py-4">
                      {summaries[item.id] ? (
                        <div className="bg-card p-3 sm:p-4 rounded-lg border border-siso-red/20">
                          <p className="text-sm sm:text-base">{summaries[item.id]}</p>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Generating summary...
                        </div>
                      )}
                      
                      <ShareButtons summary={summaries[item.id] || ''} title={item.title} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;