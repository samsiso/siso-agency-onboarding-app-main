
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils';
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
  };
}

interface PopularVideosProps {
  videos: Video[] | undefined;
  isLoading: boolean;
}

export const PopularVideos = ({ videos, isLoading }: PopularVideosProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
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
      className="grid grid-cols-2 gap-4"
    >
      {videos?.map((video) => (
        <motion.div
          key={video.id}
          variants={itemVariants}
          className="group cursor-pointer space-y-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative aspect-video rounded-xl overflow-hidden 
            bg-gradient-to-br from-white/5 to-transparent">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 
                group-hover:scale-105"
            />
            
            {/* Overlay & Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={false}
                  animate={{ scale: [0.9, 1], opacity: [0, 1] }}
                  className="w-12 h-12 rounded-full bg-siso-orange/90 flex items-center justify-center
                    transform group-hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                </motion.div>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 
              text-xs text-white flex items-center gap-1.5 backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-medium text-white line-clamp-2 
              group-hover:text-transparent group-hover:bg-clip-text 
              group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
              {video.title}
            </h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={video.education_creators.channel_avatar_url}
                    alt={video.education_creators.name}
                  />
                  <AvatarFallback>
                    {video.education_creators.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-siso-text/70">
                  {video.education_creators.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-siso-text/60">
                <Eye className="w-4 h-4" />
                {formatNumber(video.viewCount)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
