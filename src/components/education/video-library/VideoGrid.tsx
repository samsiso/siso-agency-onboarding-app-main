import { motion } from 'framer-motion';
import { ToolVideoGrid } from '../../tools/ToolVideoGrid';
import { Video } from '../types';

interface VideoGridProps {
  videos: Video[];
  featuredVideos: Video[];
  isLoading: boolean;
}

export const VideoGrid = ({ videos, featuredVideos, isLoading }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <ToolVideoGrid
        videos={videos}
        featuredVideos={featuredVideos}
        isLoading={isLoading}
      />
    </motion.div>
  );
};