import { motion } from 'framer-motion';
import { Video } from '../types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Play, Clock, Eye } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  featuredVideos: Video[];
  isLoading: boolean;
}

export const VideoGrid = ({ videos = [], featuredVideos = [], isLoading }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
            <div className="mt-2 h-4 bg-siso-bg-alt rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-siso-bg-alt rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const VideoCard = ({ video, featured = false }: { video: Video; featured?: boolean }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt overflow-hidden",
        "transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5"
      )}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-siso-bg">
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
        <h3 className={cn(
          "line-clamp-2 font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange",
          featured ? "text-lg" : "text-base"
        )}>
          {video.title}
        </h3>
        
        {video.educator && (
          <div className="flex items-center gap-2">
            {video.educator.avatar_url ? (
              <img
                src={video.educator.avatar_url}
                alt={video.educator.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-siso-bg flex items-center justify-center">
                <Play className="w-3 h-3 text-siso-text/70" />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Featured Videos Section */}
      {featuredVideos?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Featured Videos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <VideoCard key={video.id} video={video} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </motion.div>
  );
};