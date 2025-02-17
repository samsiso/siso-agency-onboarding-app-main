
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NewsCardMedia } from './NewsCardMedia';
import { NewsCardContent } from './NewsCardContent';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/hooks/usePoints';
import { useNavigate } from 'react-router-dom';

// [Analysis] Define category-based default images
const categoryImages = {
  'breakthrough_technologies': '/images/ai-robotics.jpg',
  'language_models': '/images/nlp.jpg',
  'robotics_automation': '/images/robotics.jpg',
  'industry_applications': '/images/industry.jpg',
  'international_developments': '/images/global.jpg'
};

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
  const navigate = useNavigate();

  // [Analysis] Get default image based on category
  const getDefaultImage = (category: string) => {
    return categoryImages[category as keyof typeof categoryImages] || categoryImages.breakthrough_technologies;
  };

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
        navigate(`/ai-news/${item.id}`);
      }
    } catch (error) {
      console.error('Error handling article read:', error);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden hover:bg-card/60 transition-all duration-300 border-siso-border hover:border-siso-border-hover hover:shadow-lg backdrop-blur-sm">
        <CardContent className={`h-full p-0 flex flex-col ${isFeatured ? 'gap-6' : 'gap-4'}`}>
          <div className={`flex ${isCompact ? 'flex-row' : 'flex-col'} h-full`}>
            <NewsCardMedia 
              imageUrl={item.image_url || getDefaultImage(item.category)}
              title={item.title} 
              isFeatured={isFeatured}
              isCompact={isCompact}
            />
            
            <div className="flex-1 min-w-0 flex flex-col p-4">
              <NewsCardContent
                title={item.title}
                description={item.description}
                date={item.date}
                source={item.source}
                impact={item.impact}
                onReadArticle={handleReadArticle}
                isCompact={isCompact}
                summary={summaries[item.id]}
                loadingSummary={loadingSummaries[item.id]}
                onGenerateSummary={() => onGenerateSummary(item.id)}
                newsId={item.id}
                comments={comments}
                readingTime={item.reading_time}
                views={item.views}
                bookmarks={item.bookmarks}
                sourceCredibility={item.source_credibility}
                technicalComplexity={item.technical_complexity}
                articleType={item.article_type}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;
