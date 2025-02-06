
import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  duration?: string;
  isInView: boolean;
  index: number;
}

export const VideoThumbnail = ({ thumbnailUrl, duration, isInView, index }: VideoThumbnailProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      <AspectRatio ratio={16 / 9}>
        {thumbnailUrl && isInView ? (
          <>
            {/* Low quality placeholder */}
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-opacity duration-300",
                isLoaded ? "opacity-0" : "opacity-100"
              )}
              style={{
                backgroundImage: `url(${thumbnailUrl}?quality=1&width=50)`,
              }}
            />
            {/* High quality image */}
            <img
              src={thumbnailUrl}
              alt=""
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
      {duration && (
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      )}
    </div>
  );
};
