
import { useState } from 'react';
import { NewsItem } from '@/types/blog';
import { calculateComplexityBreakdown, calculateSourceDistribution } from './calculateStats';
import { Layers, Newspaper, PlusCircle, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts';

interface TechnologyBreakdownProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Enhanced component with interactive charts and more context
export const TechnologyBreakdown = ({ newsItems, loading = false }: TechnologyBreakdownProps) => {
  const [expanded, setExpanded] = useState(false);
  
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
  
  // Convert complexity data for pie chart
  const pieData = complexityData.map((item) => ({
    name: item.level,
    value: item.percentage,
    count: item.count
  }));
  
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
  
  // Complexity colors for pie chart and bars
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
      animate="show"
    >
      {/* Technical Complexity with pie chart */}
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
                <div className="text-xs space-y-1 max-w-[200px]">
                  <p>Technical complexity indicates the depth of technical knowledge required:</p>
                  <ul className="space-y-1">
                    <li><span className="text-green-400 font-medium">Basic</span>: General audience</li>
                    <li><span className="text-blue-400 font-medium">Intermediate</span>: Industry professionals</li>
                    <li><span className="text-purple-400 font-medium">Advanced</span>: Domain experts</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-start">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  innerRadius={25}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={complexityColors[entry.name as keyof typeof complexityColors]} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 p-2 rounded border border-gray-700 text-xs">
                          <p className="capitalize font-medium">{data.name}</p>
                          <p>{data.value}% ({data.count} articles)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="ml-3 space-y-2 flex-1">
            {complexityData.map((item) => (
              <div key={item.level} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="capitalize flex items-center gap-1">
                    <span 
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: complexityColors[item.level as keyof typeof complexityColors] }}
                    ></span>
                    {item.level}
                  </span>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] h-4 px-1.5 py-0 bg-indigo-900/10 text-indigo-300 border-indigo-700/30"
                  >
                    {item.count} articles
                  </Badge>
                </div>
                
                <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: complexityColors[item.level as keyof typeof complexityColors]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Source Distribution with interactive elements */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 rounded-lg p-4 border border-emerald-800/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-medium text-emerald-300">Top News Sources</h3>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-emerald-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Distribution of articles by publication source</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
          {sourceData.map((item, idx) => (
            <div key={item.source} className="flex items-center gap-2 group hover:bg-emerald-900/20 p-1 rounded-sm transition-colors cursor-pointer">
              <span className="text-gray-400 text-xs min-w-[16px]">{idx + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-xs truncate max-w-[120px]">{item.source}</div>
                  <div className="text-xs text-emerald-300 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                    View <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-1.5 mt-1">
                  <div 
                    className="h-1.5 rounded-full bg-emerald-500/60 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-emerald-300 min-w-[24px] text-right">{item.count}</span>
            </div>
          ))}
          
          {!expanded && sourceData.length > 5 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 h-7 text-xs text-emerald-300 hover:text-emerald-200 hover:bg-emerald-900/30"
              onClick={() => setExpanded(true)}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Show all sources
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
