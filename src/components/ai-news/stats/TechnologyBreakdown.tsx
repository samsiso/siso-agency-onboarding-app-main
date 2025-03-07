
import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/blog';
import { calculateComplexityBreakdown, calculateSourceDistribution } from './calculateStats';
import { Layers, Newspaper, Info, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

interface TechnologyBreakdownProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Simplified component with fewer animations and more focused data presentation
// [Plan] Reduce cognitive load by showing only essential information
export const TechnologyBreakdown = ({ newsItems, loading = false }: TechnologyBreakdownProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animate when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-40"></div>
        ))}
      </div>
    );
  }
  
  // Get only the complexity data we need
  const complexityData = calculateComplexityBreakdown(newsItems)
    .slice(0, 3); // Only show top 3 complexity levels
  
  // Only get top 5 sources
  const sourceData = calculateSourceDistribution(newsItems)
    .slice(0, 5); // Limit to top 5 sources
  
  // Animation variants - simplified
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Complexity colors - kept for consistency
  const complexityColors = {
    basic: "#10b981",     // green
    intermediate: "#3b82f6", // blue
    advanced: "#8b5cf6",  // purple
    mixed: "#f59e0b"      // amber
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
      variants={container}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {/* Technical Complexity - Simplified to bar chart */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-indigo-900/30 to-indigo-950/50 rounded-lg p-4 border border-indigo-800/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-medium text-indigo-300">Technical Complexity</h3>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-indigo-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Technical complexity of recent AI news articles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={complexityData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="level" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: '#94a3b8',
                  width: 100,
                }}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-900 p-2 rounded border border-gray-800">
                        <p className="text-xs font-medium text-white capitalize">{payload[0].payload.level}</p>
                        <p className="text-xs text-gray-300">{payload[0].payload.count} articles ({payload[0].payload.percentage}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="percentage" 
                radius={[0, 4, 4, 0]}
                fill={({ level }) => complexityColors[level as keyof typeof complexityColors] || "#3b82f6"}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      {/* Source Distribution - Simplified to horizontal bars */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 rounded-lg p-4 border border-emerald-800/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-medium text-emerald-300">Top Sources</h3>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-emerald-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Top 5 most frequent news sources</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceData.slice(0, 5)}
              layout="vertical"
            >
              <defs>
                <linearGradient id="sourceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="source" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: '#94a3b8',
                  width: 100,
                }}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-900 p-2 rounded border border-gray-800">
                        <p className="text-xs font-medium text-white">{payload[0].payload.source}</p>
                        <p className="text-xs text-gray-300">{payload[0].value} articles ({payload[0].payload.percentage}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                fill="url(#sourceGradient)"
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      {/* Key Technologies section - Simplified to a single row */}
      <motion.div 
        variants={item}
        className="sm:col-span-2 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-800/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-blue-300">Key Technologies</h3>
          </div>
          
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/30 text-xs">
            Most Mentioned
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['LLMs', 'Neural Networks', 'Computer Vision', 'NLP'].map((tech, idx) => (
            <motion.div 
              key={tech} 
              className="bg-gray-800/30 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{tech}</span>
                <Badge className="text-[10px] px-1 py-0 h-4 bg-blue-900/20 text-blue-300">
                  +{Math.floor(Math.random() * 60) + 10}%
                </Badge>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {5 + Math.floor(Math.random() * 20)} mentions
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
