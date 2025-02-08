
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils';

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
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {videos?.map((video) => (
        <motion.div
          key={video.id}
          className="group cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-24 object-cover"
            />
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-xs text-white">
              {video.duration}
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <h4 className="text-sm font-medium text-white line-clamp-2">{video.title}</h4>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={video.education_creators.channel_avatar_url}
                  alt={video.education_creators.name}
                />
                <AvatarFallback>
                  {video.education_creators.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-siso-text/60">
                {video.education_creators.name}
              </span>
            </div>
            <p className="text-xs text-siso-text/60">
              {formatNumber(video.viewCount)} views
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
