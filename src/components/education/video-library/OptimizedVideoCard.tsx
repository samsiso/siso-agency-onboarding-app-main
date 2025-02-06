
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Video } from '../types';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useNavigate } from 'react-router-dom';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoActions } from './VideoActions';
import { VideoMetadata } from './VideoMetadata';

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
  const navigate = useNavigate();

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

  const handleVideoClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.id || !video.title) {
      console.error('Invalid video data:', video);
      return;
    }

    const slug = video.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .substring(0, 60); // Limit length
    
    console.log('[OptimizedVideoCard] Navigation:', {
      videoId: video.id,
      slug,
      fullPath: `/education/videos/${slug}-${video.id}`
    });
    
    navigate(`/education/videos/${slug}-${video.id}`);
  };

  // Stagger animation delay based on index
  const staggerDelay = Math.min(index * 0.1, 0.8);

  return (
    <motion.div
      id={`video-card-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: staggerDelay }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt overflow-hidden",
        "transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-siso-orange",
        "relative",
        className
      )}
      tabIndex={0}
      role="article"
      aria-label={`Video: ${video.title}`}
    >
      <div onClick={handleVideoClick}>
        <VideoThumbnail
          thumbnailUrl={video.thumbnail_url}
          duration={video.duration}
          isInView={isInView}
          index={index}
        />
        
        <VideoActions
          videoId={video.id}
          videoUrl={video.url}
          videoTitle={video.title}
          userId={user?.id}
          isBookmarked={isBookmarked}
          onBookmarkChange={setIsBookmarked}
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
          {video.title}
        </h3>
        
        <VideoMetadata
          educator={video.educator}
          metrics={video.metrics}
        />
      </div>
    </motion.div>
  );
};
