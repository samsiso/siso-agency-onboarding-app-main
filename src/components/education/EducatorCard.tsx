import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface EducatorCardProps {
  educator: {
    name: string;
    description?: string;
    profile_image_url?: string;
    channel_avatar_url?: string;
    number_of_subscribers?: number;
    channel_total_videos?: number;
    specialization?: string[];
    slug: string;
  };
  onClick?: () => void;
  className?: string;
}

export const EducatorCard = ({ educator, onClick, className }: EducatorCardProps) => {
  // [Analysis] Using memo for static content improves render performance
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-siso-border bg-siso-bg-alt p-4 transition-all duration-300 hover:border-siso-orange/30 hover:bg-siso-text/5",
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {(educator.channel_avatar_url || educator.profile_image_url) ? (
            <img
              src={educator.channel_avatar_url || educator.profile_image_url}
              alt={educator.name}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy" // [Analysis] Lazy load images for better performance
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-siso-bg flex items-center justify-center">
              <User className="w-6 h-6 text-siso-text/70" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
              {educator.name}
            </h3>
            {educator.number_of_subscribers && (
              <p className="text-sm text-siso-text/70">
                {educator.number_of_subscribers.toLocaleString()} subscribers
              </p>
            )}
          </div>
        </div>

        {educator.description && (
          <p className="text-sm text-siso-text/70 line-clamp-2">
            {educator.description}
          </p>
        )}

        {educator.specialization && educator.specialization.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {educator.specialization.slice(0, 3).map((spec, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-siso-bg text-siso-text/70"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {educator.channel_total_videos && (
          <div className="text-xs text-siso-text/60">
            {educator.channel_total_videos} videos
          </div>
        )}
      </div>
    </motion.div>
  );
};