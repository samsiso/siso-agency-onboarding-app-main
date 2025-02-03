import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ToolVideoCardProps {
  video: {
    title: string;
    url: string;
    thumbnail_url?: string;
    educator?: {
      name: string;
      avatar_url?: string;
    };
    metrics?: {
      views?: number;
      likes?: number;
      sentiment_score?: number;
      difficulty?: string;
      impact_score?: number;
    };
  };
  className?: string;
  featured?: boolean;
}

export const ToolVideoCard = ({ video, className, featured = false }: ToolVideoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = video.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
    
    const videoId = video.url.split('v=')[1] || '';
    navigate(`/education/videos/${slug}-${videoId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt p-3 transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5",
        featured ? "col-span-2 md:col-span-3" : "col-span-1",
        className
      )}
    >
      <div className="space-y-3">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-siso-bg">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-siso-bg">
              <span className="text-siso-text-muted">No thumbnail</span>
            </div>
          )}
        </AspectRatio>

        <div className="space-y-1">
          <h3 className="line-clamp-2 font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
            {video.title}
          </h3>
          
          {video.educator && (
            <div className="flex items-center gap-2">
              {video.educator.avatar_url && (
                <img
                  src={video.educator.avatar_url}
                  alt={video.educator.name}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <p className="text-sm text-siso-text/70">{video.educator.name}</p>
            </div>
          )}

          {video.metrics && (
            <div className="flex items-center gap-4 text-xs text-siso-text/60">
              {video.metrics.views !== undefined && (
                <span>{video.metrics.views.toLocaleString()} views</span>
              )}
              {video.metrics.likes !== undefined && (
                <span>{video.metrics.likes.toLocaleString()} likes</span>
              )}
              {video.metrics.difficulty && (
                <span className="capitalize">{video.metrics.difficulty}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};