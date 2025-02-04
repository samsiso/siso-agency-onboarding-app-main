interface EducatorStatsProps {
  subscriberCount?: number;
  videoCount?: number;
  totalViews?: number;
}

export const EducatorStats = ({ 
  subscriberCount = 0, 
  videoCount = 0, 
  totalViews = 0 
}: EducatorStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="text-2xl font-bold text-siso-orange">
          {subscriberCount.toLocaleString()}
        </div>
        <div className="text-siso-text/80">Subscribers</div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="text-2xl font-bold text-siso-orange">
          {videoCount.toLocaleString()}
        </div>
        <div className="text-siso-text/80">Videos</div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="text-2xl font-bold text-siso-orange">
          {totalViews.toLocaleString()}
        </div>
        <div className="text-siso-text/80">Total Views</div>
      </div>
    </div>
  );
};