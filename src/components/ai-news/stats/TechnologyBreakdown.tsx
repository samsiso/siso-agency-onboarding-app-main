import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/blog';
import { calculateComplexityBreakdown, calculateSourceDistribution } from './calculateStats';
import { Layers, Newspaper, PlusCircle, Info, ExternalLink, ChevronRight, Code, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
  Area,
  AreaChart
} from 'recharts';

interface TechnologyBreakdownProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Enhanced component with interactive charts and modern visualizations
export const TechnologyBreakdown = ({ newsItems, loading = false }: TechnologyBreakdownProps) => {
  const [expanded, setExpanded] = useState(false);
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
  
  const complexityData = calculateComplexityBreakdown(newsItems);
  const sourceData = calculateSourceDistribution(newsItems);
  
  // Convert complexity data for radial bar chart
  const radialData = complexityData.map((item, index) => ({
    name: item.level,
    value: item.percentage,
    fill: item.level === 'basic' ? '#10b981' : item.level === 'intermediate' ? '#3b82f6' : '#8b5cf6',
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
  
  // Custom tooltip for radial chart
  const CustomRadialTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="text-xs font-medium text-white capitalize mb-1">{data.name}</p>
          <p className="text-xs text-gray-300">{data.value}% ({data.count} articles)</p>
        </div>
      );
    }
    return null;
  };
  
  const renderRadialBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="30%" 
          outerRadius="100%" 
          data={radialData} 
          startAngle={90} 
          endAngle={-270}
          className="chart-load"
        >
          <RadialBar
            background={{ fill: 'rgba(17, 24, 39, 0.4)' }}
            clockWise
            dataKey="value"
            animationBegin={300}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <RechartsTooltip content={<CustomRadialTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
      variants={container}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {/* Technical Complexity with radial bar chart */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-indigo-900/30 to-indigo-950/50 rounded-lg p-4 border border-indigo-800/30 gradient-chart-bg"
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
            {renderRadialBarChart()}
          </div>
          
          <div className="ml-3 space-y-2 flex-1">
            <AnimatePresence>
              {complexityData.map((item, idx) => (
                <motion.div 
                  key={item.level} 
                  className="space-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
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
                  
                  <motion.div 
                    className="w-full bg-gray-700/30 rounded-full h-1.5"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                  >
                    <motion.div 
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: complexityColors[item.level as keyof typeof complexityColors]
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.7 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Source Distribution with horizontal bar chart */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/50 rounded-lg p-4 border border-emerald-800/30 gradient-chart-bg"
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
        
        <div>
          <div className="h-24 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData.slice(0, 5)}
                layout="vertical"
                className="chart-load"
              >
                <defs>
                  {sourceData.slice(0, 5).map((_, index) => (
                    <linearGradient
                      key={`sourceGradient-${index}`}
                      id={`sourceGradient-${index}`}
                      x1="0" y1="0" 
                      x2="1" y2="0"
                    >
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="source" 
                  type="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: '#94a3b8',
                    width: 100,
                  }}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="chart-tooltip">
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
                  className="bar-grow"
                  fill="url(#sourceGradient-0)"
                  animationBegin={300}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1 scrollbar-none">
            <AnimatePresence>
              {(expanded ? sourceData : sourceData.slice(0, 5)).map((item, idx) => (
                <motion.div 
                  key={item.source}
                  className="flex items-center gap-2 group hover:bg-emerald-900/20 p-1 rounded-sm transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  whileHover={{ x: 3 }}
                >
                  <span className="text-gray-400 text-xs min-w-[16px]">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="text-xs truncate max-w-[120px]">{item.source}</div>
                      <div className="text-xs text-emerald-300 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                        View <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-300 min-w-[24px] text-right">{item.count}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            
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
        </div>
      </motion.div>
      
      {/* Additional tech insights section */}
      <motion.div 
        variants={item}
        className="sm:col-span-2 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-800/20 gradient-chart-bg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-blue-300">Key Technologies</h3>
          </div>
          
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/30 text-xs">
            Top Mentions
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['LLMs', 'Neural Networks', 'Computer Vision', 'NLP'].map((tech, idx) => {
            const trendData = Array(10).fill(0).map((_, i) => ({
              x: i,
              y: 3 + Math.sin(i * 0.5) * 2 + Math.random() * 1.5
            }));
            
            return (
              <motion.div 
                key={tech} 
                className="bg-gray-800/30 p-2 rounded-lg relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{tech}</span>
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`techGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="y"
                        stroke="#3b82f6"
                        strokeWidth={1.5}
                        fill={`url(#techGradient-${idx})`}
                        dot={false}
                        isAnimationActive={true}
                        animationBegin={300 + idx * 100}
                        animationDuration={1500}
                        className="line-draw"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400">{5 + Math.floor(Math.random() * 20)} mentions</span>
                  <Badge className="text-[9px] px-1 py-0 h-4 bg-blue-900/20 text-blue-300">
                    +{Math.floor(Math.random() * 60) + 10}%
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
