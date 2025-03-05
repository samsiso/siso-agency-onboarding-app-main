
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsItem } from '@/types/blog';
import { Clock, BarChart, RefreshCw } from 'lucide-react';
import { TopStatsRow } from './stats/TopStatsRow';
import { ImpactAnalysis } from './stats/ImpactAnalysis';
import { TechnologyBreakdown } from './stats/TechnologyBreakdown';

interface DailyStatsOverviewProps {
  newsItems: NewsItem[];
  lastSync: string | null;
  articleCount: number;
  loading?: boolean;
}

export const DailyStatsOverview = ({ 
  newsItems, 
  lastSync, 
  articleCount,
  loading = false 
}: DailyStatsOverviewProps) => {
  // [Analysis] Only show this component if we have news items or are in loading state
  if (newsItems.length === 0 && !loading) {
    return null;
  }

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-900/50 to-gray-950/30 rounded-lg border border-gray-800 mb-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section */}
      <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-400" />
            Today's AI News Insights
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Analysis of {newsItems.length} articles published on {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex flex-col sm:items-end text-sm text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last updated: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Articles this month: {articleCount}
          </div>
        </div>
      </div>
      
      {/* Stats content */}
      <div className="p-4 sm:p-6 space-y-6">
        <TopStatsRow newsItems={newsItems} loading={loading} />
        <ImpactAnalysis newsItems={newsItems} loading={loading} />
        <TechnologyBreakdown newsItems={newsItems} loading={loading} />
      </div>
    </motion.div>
  );
};
