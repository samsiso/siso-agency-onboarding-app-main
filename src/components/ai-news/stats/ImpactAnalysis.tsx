
import { NewsItem } from '@/types/blog';
import { calculateImpactBreakdown } from './calculateStats';
import { ActivitySquare, AlertTriangle, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImpactAnalysisProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

export const ImpactAnalysis = ({ newsItems, loading = false }: ImpactAnalysisProps) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-800/50 rounded-lg p-5 h-32"></div>
    );
  }
  
  const impactBreakdown = calculateImpactBreakdown(newsItems);
  
  // [Analysis] Determine which impact level has the highest percentage
  let dominantImpact = "balanced";
  let alertLevel = "neutral";
  
  if (impactBreakdown.high.percentage > 50) {
    dominantImpact = "significant disruption";
    alertLevel = "high";
  } else if (impactBreakdown.medium.percentage > 60) {
    dominantImpact = "notable advancements";
    alertLevel = "medium";
  } else if (impactBreakdown.low.percentage > 60) {
    dominantImpact = "incremental progress";
    alertLevel = "low";
  }
  
  // [Analysis] Choose colors based on alert level
  const alertColors = {
    high: "text-red-400 bg-red-900/20 border-red-800/30",
    medium: "text-amber-400 bg-amber-900/20 border-amber-800/30",
    low: "text-green-400 bg-green-900/20 border-green-800/30",
    neutral: "text-blue-400 bg-blue-900/20 border-blue-800/30"
  };
  
  // [Analysis] Map impact levels to icons
  const impactIcons = {
    high: <AlertTriangle className="h-5 w-5" />,
    medium: <ActivitySquare className="h-5 w-5" />,
    low: <Gauge className="h-5 w-5" />
  };
  
  return (
    <motion.div 
      className={`rounded-lg p-5 ${alertColors[alertLevel]} border`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium flex items-center gap-2">
          {alertLevel === "high" ? impactIcons.high : 
           alertLevel === "medium" ? impactIcons.medium : 
           impactIcons.low}
          Market Impact Analysis
        </h3>
        
        <span className="text-xs px-2 py-1 rounded-full bg-gray-900/50">
          {newsItems.length} articles analyzed
        </span>
      </div>
      
      <p className="text-sm mb-4">
        Today's AI news shows <span className="font-medium">{dominantImpact}</span> across the industry,
        with {impactBreakdown.high.percentage}% of articles indicating high-impact developments.
      </p>
      
      <div className="flex items-end space-x-2 h-16">
        {Object.entries(impactBreakdown).map(([level, data]) => (
          <div key={level} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full rounded-t ${
                level === 'high' ? 'bg-red-500/60' : 
                level === 'medium' ? 'bg-amber-500/60' : 
                'bg-green-500/60'
              }`} 
              style={{height: `${Math.max(data.percentage, 5)}%`}}
            />
            <div className="text-xs mt-1 capitalize">{level}</div>
            <div className="text-xs text-gray-400">{data.percentage}%</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
