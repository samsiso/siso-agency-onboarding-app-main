import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Play, Clock, Eye, User } from 'lucide-react';
import { Video } from '../types';

// [Analysis] Using intersection observer for lazy loading
// [Plan] Add video preview on hover after 1000+ users
interface OptimizedVideoCardProps {
  video: Video;
  index: number;
  onClick?: () => void;
  className?: string;
}

export const OptimizedVideoCard = ({ video, index, onClick, className }: OptimizedVideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

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
        className
      )}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {video.thumbnail_url && isInView ? (
            <>
              {/* Low quality placeholder */}
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-opacity duration-300",
                  isLoaded ? "opacity-0" : "opacity-100"
                )}
                style={{
                  backgroundImage: `url(${video.thumbnail_url}?quality=1&width=50)`,
                }}
              />
              {/* High quality image */}
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className={cn(
                  "h-full w-full object-cover transition-all duration-300 group-hover:scale-105",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-siso-bg animate-pulse">
              <Play className="w-12 h-12 text-siso-text/20" />
            </div>
          )}
        </AspectRatio>
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
          {video.title}
        </h3>
        
        {video.educator && (
          <div className="flex items-center gap-2">
            {video.educator.avatar_url ? (
              <img
                src={video.educator.avatar_url}
                alt={video.educator.name}
                className="w-6 h-6 rounded-full"
                loading="lazy"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-siso-bg flex items-center justify-center">
                <User className="w-3 h-3 text-siso-text/70" />
              </div>
            )}
            <span className="text-sm text-siso-text/70">{video.educator.name}</span>
          </div>
        )}

        {video.metrics && (
          <div className="flex items-center gap-4 text-xs text-siso-text/60">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.metrics.views?.toLocaleString()} views
            </div>
            {video.metrics.difficulty && (
              <span className="capitalize">{video.metrics.difficulty}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};