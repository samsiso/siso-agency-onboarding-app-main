
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Video } from '../types';
import { useAuthSession } from '@/hooks/useAuthSession';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoActions } from './VideoActions';
import { VideoMetadata } from './VideoMetadata';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Calendar, MessageSquare, ThumbsUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface OptimizedVideoCardProps {
  video: Video;
  index: number;
  onClick?: () => void;
  className?: string;
}

export const OptimizedVideoCard = ({ video, index, onClick, className }: OptimizedVideoCardProps) => {
  const [isInView, setIsInView] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuthSession();

  // [Analysis] Using intersection observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`video-card-${index}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [index]);

  // Check if video is bookmarked
  useEffect(() => {
    if (!user?.id) return;
    
    const checkBookmarkStatus = async () => {
      const { data } = await supabase
        .from('video_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', video.id)
        .maybeSingle();
      
      setIsBookmarked(!!data);
    };

    checkBookmarkStatus();
  }, [user?.id, video.id]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[OptimizedVideoCard] Card clicked, delegating to onClick handler');
    onClick?.();
  };

  // Format relative time
  const formatUploadDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  };

  // [Analysis] Calculate engagement score (simple version)
  const calculateEngagementScore = () => {
    const views = video.metrics?.views || 0;
    const comments = video.metrics?.comment_count || 0;
    const likes = video.metrics?.likes_count || 0;
    return ((comments + likes) / (views || 1)) * 100;
  };

  const engagementScore = calculateEngagementScore();
  const uploadDate = formatUploadDate(video.created_at);

  // Stagger animation delay based on index
  const staggerDelay = Math.min(index * 0.1, 0.8);

  return (
    <TooltipProvider>
      <motion.div
        id={`video-card-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: staggerDelay }}
        onClick={handleCardClick}
        className={cn(
          "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt overflow-hidden",
          "transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5 hover:scale-[1.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-siso-orange",
          "relative",
          className
        )}
        tabIndex={0}
        role="article"
        aria-label={`Video: ${video.title}`}
      >
        <div className="relative">
          <VideoThumbnail
            thumbnailUrl={video.thumbnail_url}
            duration={video.duration}
            isInView={isInView}
            index={index}
          />
          
          {/* Quick Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatNumber(video.metrics?.views || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{formatNumber(video.metrics?.comment_count || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{formatNumber(video.metrics?.likes_count || 0)}</span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{uploadDate}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>Engagement Score: {engagementScore.toFixed(1)}%</p>
                    <p>Comments: {video.metrics?.comment_count || 0}</p>
                    <p>Likes: {video.metrics?.likes_count || 0}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <VideoActions
            videoId={video.id}
            videoUrl={video.url}
            videoTitle={video.title}
            userId={user?.id}
            isBookmarked={isBookmarked}
            onBookmarkChange={setIsBookmarked}
          />
        </div>

        <div className="p-4 space-y-3">
          <h3 className={cn(
            "line-clamp-2 font-semibold text-siso-text-bold text-lg leading-tight",
            "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange"
          )}>
            {video.title}
          </h3>

          {/* Video metadata with improved layout */}
          <div className="space-y-2">
            <VideoMetadata
              educator={video.educator}
              metrics={video.metrics}
            />
          </div>
        </div>

        {/* Progress bar for watched videos */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-siso-bg">
          <div className="h-full bg-gradient-to-r from-siso-red to-siso-orange" style={{ width: '0%' }} />
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
