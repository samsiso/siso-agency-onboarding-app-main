
import { User, Video, Eye, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EducatorCardStatsProps {
  subscriberCount?: number;
  videoCount?: number;
  totalViews?: number;
  location?: string;
  lastSyncedAt?: string;
  formatNumber: (num?: number) => string;
}

export const EducatorCardStats = ({
  subscriberCount,
  videoCount,
  totalViews,
  location,
  lastSyncedAt,
  formatNumber
}: EducatorCardStatsProps) => {
  return (
    <>
      <div className="flex items-center gap-4 mt-2 text-sm text-siso-text/70">
        {subscriberCount && (
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{formatNumber(subscriberCount)} subscribers</span>
          </div>
        )}
        
        {lastSyncedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Last synced {format(new Date(lastSyncedAt), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-siso-text/70">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {videoCount && (
          <div className="flex items-center gap-1.5 text-sm text-siso-text/70">
            <Video className="w-4 h-4 flex-shrink-0" />
            <span>{videoCount} videos</span>
          </div>
        )}
      </div>

      {totalViews && (
        <div className="flex items-center gap-1.5 text-sm text-siso-text/70 mt-2">
          <Eye className="w-4 h-4" />
          <span>{formatNumber(totalViews)} total views</span>
        </div>
      )}
    </>
  );
};

