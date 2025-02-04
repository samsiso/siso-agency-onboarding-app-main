import { Users, PlaySquare, Eye } from 'lucide-react';

interface EducatorStatsProps {
  subscriberCount?: number | null;
  videoCount?: number | null;
  totalViews?: number | null;
}

const formatNumber = (num: number | null | undefined): string => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const EducatorStats = ({ 
  subscriberCount = 0, 
  videoCount = 0, 
  totalViews = 0 
}: EducatorStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-siso-orange/10 rounded-lg">
          <Users className="w-6 h-6 text-siso-orange" />
        </div>
        <div>
          <div className="text-2xl font-bold text-siso-text">
            {formatNumber(subscriberCount)}
          </div>
          <div className="text-siso-text/60 text-sm">Subscribers</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-siso-orange/10 rounded-lg">
          <PlaySquare className="w-6 h-6 text-siso-orange" />
        </div>
        <div>
          <div className="text-2xl font-bold text-siso-text">
            {formatNumber(videoCount)}
          </div>
          <div className="text-siso-text/60 text-sm">Videos</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-siso-orange/10 rounded-lg">
          <Eye className="w-6 h-6 text-siso-orange" />
        </div>
        <div>
          <div className="text-2xl font-bold text-siso-text">
            {formatNumber(totalViews)}
          </div>
          <div className="text-siso-text/60 text-sm">Total Views</div>
        </div>
      </div>
    </div>
  );
};