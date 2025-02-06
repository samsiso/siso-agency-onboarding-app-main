
import { motion } from 'framer-motion';
import { OptimizedVideoCard } from './OptimizedVideoCard';
import { Video } from '../types';
import { useNavigate } from 'react-router-dom';

interface VideoGridProps {
  videos: Video[];
  featuredVideos: Video[];
  isLoading: boolean;
}

export const VideoGrid = ({ videos = [], featuredVideos = [], isLoading }: VideoGridProps) => {
  const navigate = useNavigate();

  // [Analysis] Improved loading state with staggered animation
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="animate-pulse"
          >
            <div className="aspect-video bg-siso-bg-alt rounded-lg"></div>
            <div className="mt-2 h-4 bg-siso-bg-alt rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-siso-bg-alt rounded w-1/2"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  // [Analysis] Early return with message if no videos
  if (!videos.length && !featuredVideos.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-xl text-siso-text/70">No videos found</p>
      </motion.div>
    );
  }

  const handleVideoClick = (video: Video) => {
    if (!video.id || !video.title) {
      console.error('Invalid video data:', video);
      return;
    }

    const slug = video.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60);
    
    console.log('[VideoGrid] Navigating to video:', { 
      slug, 
      videoId: video.id 
    });
    
    navigate(`/education/videos/${slug}-${video.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Featured Videos Section */}
      {featuredVideos?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Featured Videos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <OptimizedVideoCard
                key={`featured-${video.id}`}
                video={video}
                index={index}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <OptimizedVideoCard
            key={video.id}
            video={video}
            index={index}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>
    </motion.div>
  );
};
