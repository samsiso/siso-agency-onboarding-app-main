
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RefreshCw, TrendingUp, Users, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EducatorCardBanner } from './educator-card/EducatorCardBanner';
import { EducatorCardProfile } from './educator-card/EducatorCardProfile';
import { EducatorCardStats } from './educator-card/EducatorCardStats';
import { EducatorCardDescription } from './educator-card/EducatorCardDescription';
import { EducatorCardSpecializations } from './educator-card/EducatorCardSpecializations';

interface EducatorCardProps {
  educator: {
    name: string;
    description?: string;
    profile_image_url?: string;
    channel_avatar_url?: string;
    channel_banner_url?: string;
    number_of_subscribers?: number;
    channel_total_videos?: number;
    channel_total_views?: number;
    specialization?: string[];
    channel_location?: string;
    channel_joined_date?: string;
    slug: string;
    is_featured?: boolean;
    sync_status?: string;
    last_synced_at?: string;
    video_upload_frequency?: string;
    following_count?: number;
    engagement_rate?: number;
    primary_category?: string;
    expertise_areas?: string[];
    profile_color?: string;
  };
  onClick?: () => void;
  className?: string;
}

// [Analysis] Using hover animations and color transitions for better UX
export const EducatorCard = ({ educator, className }: EducatorCardProps) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (educator.channel_banner_url) {
      const img = new Image();
      img.src = educator.channel_banner_url;
      img.onload = () => setBannerLoaded(true);
      img.onerror = () => setBannerError(true);
    }

    if (educator.channel_avatar_url || educator.profile_image_url) {
      const img = new Image();
      img.src = educator.channel_avatar_url || educator.profile_image_url || '';
      img.onload = () => setAvatarLoaded(true);
      img.onerror = () => setAvatarError(true);
    }
  }, [educator.channel_banner_url, educator.channel_avatar_url, educator.profile_image_url]);

  return (
    <Link 
      to={`/education/educators/${educator.slug}`}
      className="block"
      aria-label={`View ${educator.name}'s profile`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative h-[480px] cursor-pointer rounded-xl border border-siso-border",
          "bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg overflow-hidden transition-all duration-500",
          "hover:shadow-lg hover:shadow-black/20 hover:border-siso-orange/30",
          "backdrop-blur-sm",
          educator.profile_color && `hover:border-[${educator.profile_color}]/30`,
          educator.is_featured && "ring-1 ring-siso-orange/30",
          className
        )}
      >
        <EducatorCardBanner
          bannerUrl={educator.channel_banner_url}
          isFeatured={educator.is_featured}
          onBannerLoad={() => setBannerLoaded(true)}
          onBannerError={() => setBannerError(true)}
          bannerLoaded={bannerLoaded}
          bannerError={bannerError}
        />

        {educator.sync_status && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-1.5 text-white",
                {
                  'bg-green-500': educator.sync_status === 'completed',
                  'bg-red-500': educator.sync_status === 'failed',
                  'bg-blue-500': educator.sync_status === 'in_progress',
                  'bg-gray-500': educator.sync_status === 'pending'
                }
              )}
            >
              {educator.sync_status === 'in_progress' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  {
                    'bg-green-500': educator.sync_status === 'completed',
                    'bg-red-500': educator.sync_status === 'failed',
                    'bg-blue-500': educator.sync_status === 'in_progress',
                    'bg-gray-500': educator.sync_status === 'pending'
                  }
                )} />
              )}
              {educator.sync_status === 'completed' && 'Synced'}
              {educator.sync_status === 'failed' && 'Sync Failed'}
              {educator.sync_status === 'in_progress' && 'Syncing...'}
              {educator.sync_status === 'pending' && 'Pending Sync'}
            </Badge>
          </div>
        )}

        <EducatorCardProfile
          name={educator.name}
          avatarUrl={educator.channel_avatar_url || educator.profile_image_url}
          onAvatarLoad={() => setAvatarLoaded(true)}
          onAvatarError={() => setAvatarError(true)}
          avatarLoaded={avatarLoaded}
          avatarError={avatarError}
        />

        <div className="px-6 mt-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-siso-text-bold truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
              {educator.name}
            </h3>
            
            <EducatorCardStats
              subscriberCount={educator.number_of_subscribers}
              videoCount={educator.channel_total_videos}
              totalViews={educator.channel_total_views}
              location={educator.channel_location}
              lastSyncedAt={educator.last_synced_at}
              formatNumber={formatNumber}
            />
          </div>

          <EducatorCardDescription description={educator.description} />

          {educator.expertise_areas && educator.expertise_areas.length > 0 ? (
            <EducatorCardSpecializations specializations={educator.expertise_areas} />
          ) : (
            <EducatorCardSpecializations specializations={educator.specialization} />
          )}

          <div className="flex flex-wrap gap-4 text-sm text-siso-text/70">
            {educator.video_upload_frequency && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Posts {educator.video_upload_frequency}</span>
              </div>
            )}
            
            {educator.following_count && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{formatNumber(educator.following_count)} following</span>
              </div>
            )}

            {educator.channel_location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{educator.channel_location}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const formatNumber = (num?: number) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
