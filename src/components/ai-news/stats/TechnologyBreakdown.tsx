
import { NewsItem } from '@/types/blog';
import { calculateComplexityBreakdown, calculateSourceDistribution } from './calculateStats';
import { Layers, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechnologyBreakdownProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

export const TechnologyBreakdown = ({ newsItems, loading = false }: TechnologyBreakdownProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-40"></div>
        ))}
      </div>
    );
  }
  
  const complexityData = calculateComplexityBreakdown(newsItems);
  const sourceData = calculateSourceDistribution(newsItems);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Complexity colors
  const complexityColors = {
    basic: "bg-green-500/60",
    intermediate: "bg-blue-500/60",
    advanced: "bg-purple-500/60",
    mixed: "bg-amber-500/60"
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Technical Complexity */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-indigo-900/30 to-indigo-950/50 rounded-lg p-4 border border-indigo-800/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-medium text-indigo-300">Technical Complexity</h3>
        </div>
        
        <div className="space-y-3">
          {complexityData.map((item) => (
            <div key={item.level} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs capitalize">{item.level}</span>
                <span className="text-xs text-indigo-300">{item.percentage}%</span>
              </div>
              
              <div className="w-full bg-gray-700/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${complexityColors[item.level] || 'bg-gray-500/60'}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Source Distribution */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 rounded-lg p-4 border border-emerald-800/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-medium text-emerald-300">Top News Sources</h3>
        </div>
        
        <div className="space-y-2">
          {sourceData.map((item, idx) => (
            <div key={item.source} className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">{idx + 1}</span>
              <div className="flex-1">
                <div className="text-xs truncate">{item.source}</div>
                <div className="w-full bg-gray-700/30 rounded-full h-1.5 mt-1">
                  <div 
                    className="h-1.5 rounded-full bg-emerald-500/60"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-emerald-300">{item.count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
