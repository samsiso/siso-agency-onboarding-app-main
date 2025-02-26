
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/formatters';
import { Play, Clock, Eye } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: number;
  education_creators: {
    name: string;
    channel_avatar_url: string;
  } | null;
}

interface PopularVideosProps {
  videos: Video[] | undefined;
  isLoading: boolean;
}

export const PopularVideos = ({ videos, isLoading }: PopularVideosProps) => {
  // [Analysis] Early return if no videos
  if (!videos?.length) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="aspect-video rounded-xl bg-gradient-to-br from-white/5 to-transparent" 
          />
        ))}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          variants={itemVariants}
          className="group cursor-pointer space-y-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative aspect-video rounded-xl overflow-hidden 
            bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 
                group-hover:scale-105"
            />
            
            {/* Enhanced Overlay & Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={{ scale: [0.9, 1], opacity: [0, 1] }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-siso-red to-siso-orange 
                  flex items-center justify-center transform group-hover:scale-110 
                  transition-transform duration-300 shadow-lg shadow-siso-orange/20">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </motion.div>
            </div>

            {/* Enhanced Duration Badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg 
              bg-black/80 backdrop-blur-sm border border-white/10
              text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {video.duration}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-medium text-white line-clamp-2 
              group-hover:text-transparent group-hover:bg-clip-text 
              group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange
              transition-all duration-300">
              {video.title}
            </h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-white/10 group-hover:ring-siso-orange/20 
                  transition-colors duration-300">
                  {video.education_creators ? (
                    <AvatarImage
                      src={video.education_creators.channel_avatar_url}
                      alt={video.education_creators.name}
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
                    {video.education_creators?.name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm text-siso-text/90 group-hover:text-white transition-colors">
                    {video.education_creators?.name || 'Unknown Creator'}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-siso-text/60">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.viewCount)} views
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
