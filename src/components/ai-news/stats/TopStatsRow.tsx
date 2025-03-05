
import { NewsItem } from '@/types/blog';
import { calculateTopCategories, extractTrendingTopics } from './calculateStats';
import { BadgeCheck, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopStatsRowProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

export const TopStatsRow = ({ newsItems, loading = false }: TopStatsRowProps) => {
  const topCategories = calculateTopCategories(newsItems, 3);
  const trendingTopics = extractTrendingTopics(newsItems);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-24"></div>
        ))}
      </div>
    );
  }
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Top Categories */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-blue-900/30 to-blue-950/50 rounded-lg p-4 border border-blue-800/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <BadgeCheck className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-medium text-blue-300">Top Categories</h3>
        </div>
        
        <div className="space-y-2">
          {topCategories.map((cat, idx) => (
            <div key={cat.category} className="flex items-center justify-between">
              <span className="text-sm capitalize text-white">{cat.category}</span>
              <span className="text-xs text-blue-300">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Trending Topics */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-purple-900/30 to-purple-950/50 rounded-lg p-4 border border-purple-800/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-medium text-purple-300">Trending Topics</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {trendingTopics.slice(0, 5).map((topic) => (
            <span 
              key={topic.topic} 
              className="inline-flex items-center rounded-full bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-300"
            >
              {topic.topic}
            </span>
          ))}
        </div>
      </motion.div>
      
      {/* Latest Updates */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-amber-900/30 to-amber-950/50 rounded-lg p-4 border border-amber-800/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-medium text-amber-300">Latest Updates</h3>
        </div>
        
        <ul className="space-y-1">
          {newsItems.slice(0, 3).map((item) => (
            <li key={item.id} className="text-xs truncate text-gray-300">
              {item.title}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};
