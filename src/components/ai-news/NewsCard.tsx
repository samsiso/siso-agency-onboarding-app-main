import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NewsCardMedia } from './NewsCardMedia';
import { NewsCardContent } from './NewsCardContent';
import { NewsCardComments } from './NewsCardComments';
import { ShareButtons } from './ShareButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/usePoints';

interface NewsComment {
  id: string;
  content: string;
  created_at: string;
  user_email: string;
  news_id: string;
  updated_at: string;
}

interface NewsCardProps {
  item: any;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  isFeatured?: boolean;
  isCompact?: boolean;
}

const NewsCard = ({ 
  item, 
  summaries, 
  loadingSummaries, 
  onGenerateSummary,
  isFeatured = false,
  isCompact = false
}: NewsCardProps) => {
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasReadArticle, setHasReadArticle] = useState(false);
  const { toast } = useToast();
  const { awardPoints } = usePoints(undefined);

  useEffect(() => {
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
            setComments(prev => [...prev, payload.new as NewsComment]);
          }
        }
      )
      .subscribe();

    fetchComments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item.id]);

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_id', item.id)
        .order('created_at', { ascending: true });

      setComments(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadArticle = async () => {
    if (hasReadArticle) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await awardPoints('read_article');
        setHasReadArticle(true);
        toast({
          title: "Points awarded!",
          description: "You earned 2 points for reading this article!",
        });
      }
    } catch (error) {
      console.error('Error handling article read:', error);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] rounded-lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <Card className="group h-full w-full hover:bg-card/60 transition-all duration-200 border-siso-border hover:border-siso-border-hover hover:shadow-lg">
        <CardContent className={`h-full p-4 sm:p-6 ${isFeatured ? 'space-y-6' : 'space-y-4'}`}>
          <div className={`h-full flex ${isCompact ? 'flex-row' : isFeatured ? 'flex-col' : 'flex-col'} gap-4 sm:gap-6`}>
            <NewsCardMedia 
              imageUrl={item.image_url} 
              title={item.title} 
              isFeatured={isFeatured}
              isCompact={isCompact}
            />
            
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <NewsCardContent
                title={item.title}
                description={item.description}
                date={item.date}
                source={item.source}
                impact={item.impact}
                onReadArticle={handleReadArticle}
                isCompact={isCompact}
              />

              {!isCompact && (
                <div className="mt-auto space-y-4">
                  <NewsCardComments
                    newsId={item.id}
                    comments={comments}
                  />

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
                          summaries[item.id] ? "View AI Summary" : "Generate AI Summary"
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
                            {loadingSummaries[item.id] ? "Generating summary..." : "Click the button to generate a summary"}
                          </div>
                        )}
                        
                        <ShareButtons summary={summaries[item.id] || ''} title={item.title} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;