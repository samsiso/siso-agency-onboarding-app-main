
import { TopStatsRow } from './stats/TopStatsRow';
import { TechnologyBreakdown } from './stats/TechnologyBreakdown';
import { ImpactAnalysis } from './stats/ImpactAnalysis';
import { calculateStats } from './stats/calculateStats';

interface DailyStatsOverviewProps {
  newsItems: any[];
}

const DailyStatsOverview = ({ newsItems }: DailyStatsOverviewProps) => {
  const stats = calculateStats(newsItems);
  if (!stats) return null;

  return (
    <div className="space-y-6 mb-8">
      <TopStatsRow stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TechnologyBreakdown />
        <ImpactAnalysis stats={stats} />
      </div>
    </div>
  );
};

export default DailyStatsOverview;
