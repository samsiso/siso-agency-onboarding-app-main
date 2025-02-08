
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  duration?: string;
  isInView: boolean;
  index: number;
}

export const VideoThumbnail = ({ thumbnailUrl, duration, isInView, index }: VideoThumbnailProps) => {
  const [imageError, setImageError] = useState(false);

  // [Analysis] Handle image load errors and provide fallback
  const handleImageError = () => {
    console.error(`[VideoThumbnail] Failed to load thumbnail: ${thumbnailUrl}`);
    setImageError(true);
  };

  return (
    <div className="relative group/thumbnail">
      <AspectRatio ratio={16 / 9}>
        {thumbnailUrl && isInView && !imageError ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Thumbnail image with error handling */}
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
              opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300" />
            
            {/* Improved play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 
              group-hover/thumbnail:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center 
                transform scale-90 group-hover/thumbnail:scale-100 transition-transform duration-300 
                shadow-lg shadow-black/30">
                <Play className="w-7 h-7 text-siso-bg fill-current ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "flex h-full items-center justify-center bg-gradient-to-br from-siso-bg via-siso-bg/90 to-siso-bg/80",
            imageError ? "bg-red-900/10" : "animate-pulse"
          )}>
            {imageError ? (
              <div className="flex flex-col items-center gap-2 text-siso-text/40">
                <AlertCircle className="w-8 h-8" />
                <span className="text-xs">Failed to load thumbnail</span>
              </div>
            ) : (
              <Play className="w-12 h-12 text-siso-text/20" />
            )}
          </div>
        )}
      </AspectRatio>
      
      {/* Enhanced duration badge */}
      {duration && (
        <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1.5 rounded-md 
          text-xs font-medium text-white flex items-center gap-1.5 backdrop-blur-sm 
          shadow-lg shadow-black/20 border border-white/10">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      )}
    </div>
  );
};
