
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
import { Clock, Eye, MessageSquare, Calendar, Heart } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';

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

  // [Analysis] Calculate if video is new (within last 7 days)
  const isNew = video.created_at && (() => {
    try {
      const date = new Date(video.created_at);
      return !isNaN(date.getTime()) && date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } catch {
      return false;
    }
  })();
  
  // [Analysis] Format the date for display, handling both ISO and YYYY-MM-DD formats
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      id={`video-card-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.8) }}
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
        
        {/* Badge for new videos */}
        {isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500/90 text-white">
              NEW
            </Badge>
          </div>
        )}

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

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 gap-2 text-xs text-siso-text/70">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatNumber(video.metrics.views)} views</span>
          </div>
          {video.metrics.likes > 0 && (
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>{formatNumber(video.metrics.likes)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{video.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(video.created_at)}</span>
          </div>
        </div>

        {/* Educator Info */}
        <VideoMetadata
          educator={video.educator}
          metrics={video.metrics}
        />
      </div>

      {/* Progress bar for watched videos (if implemented) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-siso-bg">
        <div className="h-full bg-gradient-to-r from-siso-red to-siso-orange" style={{ width: '0%' }} />
      </div>
    </motion.div>
  );
};
