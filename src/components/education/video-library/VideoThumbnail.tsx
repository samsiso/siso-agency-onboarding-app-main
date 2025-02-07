
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
  return (
    <div className="relative group/thumbnail">
      <AspectRatio ratio={16 / 9}>
        {thumbnailUrl && isInView ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Thumbnail image */}
            <img
              src={thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-110"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform scale-90 group-hover/thumbnail:scale-100 transition-transform duration-300">
                <Play className="w-6 h-6 text-siso-bg fill-current" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-siso-bg animate-pulse">
            <Play className="w-12 h-12 text-siso-text/20" />
          </div>
        )}
      </AspectRatio>
      
      {/* Duration badge with improved styling */}
      {duration && (
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1 backdrop-blur-sm">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      )}
    </div>
  );
};
