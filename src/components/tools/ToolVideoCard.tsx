
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Brain, Info, Video, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={cn(
        "cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt/50 transition-all duration-300",
        "hover:border-siso-orange/30 hover:bg-siso-text/5",
        featured ? "p-6" : "p-4",
        className
      )}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-siso-bg">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-siso-bg">
                <Video className="w-12 h-12 text-siso-text/20" />
              </div>
            )}
          </AspectRatio>
        </div>

        <div className="md:w-2/3 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn(
              "font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange",
              featured ? "text-xl" : "text-lg"
            )}>
              {video.title}
            </h3>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1.5 rounded-full bg-siso-bg-alt hover:bg-siso-orange/10 transition-colors">
                      <Brain className="w-4 h-4 text-siso-text/70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {video.educator && (
            <div className="flex items-center gap-2">
              {video.educator.avatar_url ? (
                <img
                  src={video.educator.avatar_url}
                  alt={video.educator.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-siso-bg flex items-center justify-center">
                  <User className="w-4 h-4 text-siso-text/70" />
                </div>
              )}
              <p className="text-siso-text/70">{video.educator.name}</p>
            </div>
          )}

          {video.metrics && (
            <div className="flex items-center gap-4 text-sm text-siso-text/60">
              {video.metrics.views !== undefined && (
                <span>{video.metrics.views.toLocaleString()} views</span>
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
}
