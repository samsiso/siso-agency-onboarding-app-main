
import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/blog';
import { calculateTopCategories, extractTrendingTopics } from './calculateStats';
import { BadgeCheck, TrendingUp, Zap, Info, ExternalLink, BarChart3, ChevronRight, Award } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Area,
  AreaChart
} from 'recharts';

interface TopStatsRowProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Enhanced component with interactive visualizations and animations
export const TopStatsRow = ({ newsItems, loading = false }: TopStatsRowProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Add animation trigger after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Skip processing if loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-24"></div>
        ))}
      </div>
    );
  }
  
  const topCategories = calculateTopCategories(newsItems, 5);
  const trendingTopics = extractTrendingTopics(newsItems);
  
  // [Analysis] Generate enhanced trend data for visualization with smoother curves
  const generateTrendData = (topicName: string) => {
    // In a real app, this would come from historical data
    const baseValue = Math.floor(Math.random() * 5) + 3;
    
    return Array(7).fill(0).map((_, i) => ({
      day: i,
      value: baseValue + Math.sin(i * 0.5) * 2 + Math.random() * 1.5
    }));
  };
  
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

  // Colors for the pie chart with gradients
  const CATEGORY_COLORS = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
  ];
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="text-xs font-medium text-white">{payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {/* Top Categories with pie chart */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-blue-900/30 to-blue-950/50 rounded-lg p-4 border border-blue-800/30 gradient-chart-bg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-blue-300">Top Categories</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-blue-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Distribution of articles by category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="pie-reveal">
                <defs>
                  {topCategories.map((_, index) => (
                    <linearGradient 
                      key={`pieGradient-${index}`} 
                      id={`pieGradient-${index}`} 
                      x1="0" 
                      y1="0" 
                      x2="0" 
                      y2="1"
                    >
                      <stop offset="0%" stopColor={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} stopOpacity={0.5}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={topCategories}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={36}
                  innerRadius={24}
                  animationBegin={300}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {topCategories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#pieGradient-${index})`} 
                      strokeWidth={1}
                      stroke="rgba(30, 41, 59, 0.5)"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="ml-2 space-y-1 flex-1">
            <AnimatePresence>
              {topCategories.slice(0, 3).map((cat, idx) => (
                <motion.div 
                  key={cat.category} 
                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-blue-900/30 p-1 rounded-sm transition-colors"
                  onClick={() => setSelectedCategory(cat.category)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex items-center">
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}}
                    ></span>
                    <span className="capitalize truncate max-w-[85px]">{cat.category}</span>
                  </div>
                  <span className="text-blue-300">{cat.percentage}%</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Trending Topics with enhanced trend charts */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-purple-900/30 to-purple-950/50 rounded-lg p-4 border border-purple-800/30 gradient-chart-bg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-purple-300">Trending Topics</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-purple-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Most mentioned technologies in today's articles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-2">
          <AnimatePresence>
            {trendingTopics.slice(0, 3).map((topic, idx) => (
              <motion.div 
                key={topic.topic} 
                className="group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{topic.topic}</span>
                  <div className="flex items-center">
                    <span className="text-xs text-purple-300 mr-1">{topic.count} mentions</span>
                    <ExternalLink className="h-3 w-3 text-purple-400/0 group-hover:text-purple-400/70 transition-colors" />
                  </div>
                </div>
                <div className="h-8 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateTrendData(topic.topic)}>
                      <defs>
                        <linearGradient id={`trendGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone" 
                        dataKey="value" 
                        stroke="#a78bfa" 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#trendGradient-${idx})`}
                        dot={false}
                        className="line-draw"
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <XAxis dataKey="day" hide={true} />
                      <YAxis hide={true} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Latest Updates with enhanced visuals */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-amber-900/30 to-amber-950/50 rounded-lg p-4 border border-amber-800/30 gradient-chart-bg"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-medium text-amber-300">Latest Updates</h3>
          </div>
          <Badge variant="outline" className="text-xs bg-amber-900/30 text-amber-300 border-amber-700/30">
            {newsItems.length > 0 ? `${newsItems.length} articles` : 'No articles'}
          </Badge>
        </div>
        
        <ul className="space-y-2">
          <AnimatePresence>
            {newsItems.slice(0, 3).map((item, idx) => (
              <motion.li 
                key={item.id} 
                className="group cursor-pointer hover:bg-amber-900/20 p-1.5 rounded transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                whileHover={{ x: 3 }}
              >
                <p className="text-xs truncate text-gray-300 font-medium">{item.title}</p>
                <div className="flex justify-between items-center mt-1 text-[10px] text-gray-400">
                  <span>{item.source}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-300 flex items-center gap-1">
                    Read more <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </motion.div>
  );
};
