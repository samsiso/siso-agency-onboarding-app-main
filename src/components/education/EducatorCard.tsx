import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { User, MapPin, Video, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EducatorCardProps {
  educator: {
    name: string;
    description?: string;
    profile_image_url?: string;
    channel_avatar_url?: string;
    number_of_subscribers?: number;
    channel_total_videos?: number;
    specialization?: string[];
    channel_location?: string;
    slug: string;
    is_featured?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

// [Analysis] Format large numbers to human readable format (e.g., 1.2M)
const formatNumber = (num?: number) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const EducatorCard = ({ educator, onClick, className }: EducatorCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group h-[420px] cursor-pointer rounded-lg border border-siso-border bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg p-4 transition-all duration-300 hover:border-siso-orange/30 hover:from-siso-text/5 hover:to-siso-bg/95",
        educator.is_featured && "from-siso-red/5 to-siso-orange/5 hover:from-siso-red/10 hover:to-siso-orange/10",
        className
      )}
    >
      <div className="flex flex-col h-full space-y-4">
        {/* Profile Section - Fixed Height */}
        <div className="flex items-center gap-3 h-16">
          {(educator.channel_avatar_url || educator.profile_image_url) ? (
            <motion.div className="relative w-12 h-12 rounded-full overflow-hidden">
              <AspectRatio ratio={1} className="h-full">
                <motion.img
                  src={educator.channel_avatar_url || educator.profile_image_url}
                  alt={educator.name}
                  className="h-full w-full object-cover ring-2 ring-siso-orange/20 group-hover:ring-siso-orange/40 transition-all duration-300"
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </AspectRatio>
            </motion.div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-siso-bg flex items-center justify-center ring-2 ring-siso-orange/20">
              <User className="w-6 h-6 text-siso-text/70" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-siso-text-bold truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
              {educator.name}
            </h3>
            {educator.number_of_subscribers && (
              <div className="flex items-center gap-1 text-sm text-siso-text/70">
                <User className="w-3.5 h-3.5" />
                <span className="truncate">{formatNumber(educator.number_of_subscribers)} subscribers</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid - Fixed Height */}
        <div className="grid grid-cols-2 gap-2 text-sm h-16">
          {educator.channel_location && (
            <div className="flex items-center gap-1.5 text-siso-text/70">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{educator.channel_location}</span>
            </div>
          )}
          {educator.channel_total_videos && (
            <div className="flex items-center gap-1.5 text-siso-text/70">
              <Video className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{educator.channel_total_videos} videos</span>
            </div>
          )}
        </div>

        {/* Description - Fixed Height with Ellipsis */}
        {educator.description && (
          <p className="text-sm text-siso-text/70 line-clamp-3 h-[4.5rem] group-hover:text-siso-text/90 transition-colors">
            {educator.description}
          </p>
        )}

        {/* Specializations - Scrollable Container */}
        {educator.specialization && educator.specialization.length > 0 && (
          <ScrollArea className="h-[4.5rem] w-full">
            <div className="flex flex-wrap gap-2">
              {educator.specialization.map((spec, index) => (
                <motion.span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-siso-text/90 border border-siso-border/50 group-hover:border-siso-orange/30 transition-colors whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  {spec}
                </motion.span>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </motion.div>
  );
};