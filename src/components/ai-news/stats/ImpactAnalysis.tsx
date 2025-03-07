
import React, { useState, useCallback } from 'react';
import { NewsItem } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { calculateImpactBreakdown, calculateSentimentDistribution, generateHistoricalTrends } from './calculateStats';
import { formatPercentage } from '@/lib/formatters';
import { Info, Maximize2, TrendingUp, ChevronRight, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ImpactAnalysisProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Enhanced component with animations, glassmorphism and better visuals
export const ImpactAnalysis = ({ newsItems, loading = false }: ImpactAnalysisProps) => {
  const [activeTimeRange, setActiveTimeRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [expandedView, setExpandedView] = useState(false);
  
  // Calculate impact breakdown
  const impactData = calculateImpactBreakdown(newsItems);
  
  // Convert to format for Recharts with enhanced styling
  const chartData = [
    { name: 'High', value: impactData.high.count, color: '#ef4444', percentage: impactData.high.percentage },
    { name: 'Medium', value: impactData.medium.count, color: '#f59e0b', percentage: impactData.medium.percentage },
    { name: 'Low', value: impactData.low.count, color: '#10b981', percentage: impactData.low.percentage }
  ];
  
  // Calculate sentiment distribution with enhanced colors
  const sentimentData = calculateSentimentDistribution(newsItems);
  
  // Convert to format for Recharts with improved design
  const sentimentChartData = [
    { name: 'Positive', value: sentimentData.positive.count, color: '#10b981', percentage: sentimentData.positive.percentage },
    { name: 'Neutral', value: sentimentData.neutral.count, color: '#6b7280', percentage: sentimentData.neutral.percentage },
    { name: 'Negative', value: sentimentData.negative.count, color: '#ef4444', percentage: sentimentData.negative.percentage }
  ];
  
  // Generate historical trend data with animation-friendly structure
  const trendData = generateHistoricalTrends();
  
  // Custom tooltip for better visuals
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="text-gray-200 text-xs font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                <span className="text-gray-300">{entry.name}:</span>
              </span>
              <span className="font-medium text-white ml-2">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Optimized rendering for better performance
  const renderImpactDistribution = useCallback(() => {
    if (loading) {
      return <Skeleton className="h-[180px] w-full" />;
    }
    
    return (
      <motion.div 
        className="w-full h-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="pie-reveal">
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradientImpact${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.5}/>
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationBegin={300}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradientImpact${index})`} 
                  stroke="rgba(30, 41, 59, 0.5)"
                  strokeWidth={1}
                  className="glow-effect"
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              animationDuration={200}
              animationEasing="ease-out"
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-gray-200">
              {newsItems.length} Articles
            </text>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }, [chartData, loading, newsItems.length]);
  
  // Optimized rendering for sentiment chart
  const renderSentimentAnalysis = useCallback(() => {
    if (loading) {
      return <Skeleton className="h-[180px] w-full" />;
    }
    
    return (
      <motion.div 
        className="w-full h-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="pie-reveal">
            <defs>
              {sentimentChartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradientSentiment${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.5}/>
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={sentimentChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationBegin={300}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {sentimentChartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradientSentiment${index})`} 
                  stroke="rgba(30, 41, 59, 0.5)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              animationDuration={200}
              animationEasing="ease-out"
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => {
                return <span className="text-xs text-gray-400">{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }, [sentimentChartData, loading]);
  
  // Optimized rendering for trend chart with improved visualization
  const renderTrendChart = useCallback(() => {
    if (loading) {
      return <Skeleton className="h-[200px] w-full" />;
    }
    
    // Determine the time range data to display
    const timeRangeData = trendData.slice(-1 * (activeTimeRange === '7d' ? 7 : activeTimeRange === '14d' ? 14 : 30));
    
    return (
      <motion.div 
        className="w-full h-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={timeRangeData} 
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            className="chart-load"
          >
            <defs>
              <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickMargin={8}
              tickFormatter={(value) => {
                // Show shorter date format for small screens
                return value.split('-').slice(1).join('/');
              }}
            />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="high" 
              name="High Impact" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#highGradient)" 
              strokeWidth={2}
              className="line-draw"
            />
            <Area 
              type="monotone" 
              dataKey="medium" 
              name="Medium Impact" 
              stroke="#f59e0b" 
              fillOpacity={1} 
              fill="url(#mediumGradient)" 
              strokeWidth={2}
              className="line-draw"
            />
            <Area 
              type="monotone" 
              dataKey="low" 
              name="Low Impact" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#lowGradient)" 
              strokeWidth={2}
              className="line-draw"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }, [trendData, loading, activeTimeRange]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="gradient-chart-bg animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[180px] w-full" />
          </CardContent>
        </Card>
        
        <Card className="gradient-chart-bg animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[180px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If no news items, show a message
  if (newsItems.length === 0) {
    return (
      <Card className="gradient-chart-bg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No news data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Impact Distribution */}
      <Card className="gradient-chart-bg overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-400" />
              Impact Distribution
            </CardTitle>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Distribution of articles based on their potential impact on the AI industry</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          {renderImpactDistribution()}
          
          <div className="flex justify-center mt-2 space-x-4">
            {Object.entries(impactData).map(([key, data]) => (
              <motion.div 
                key={key} 
                className="flex items-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + (key === 'high' ? 0 : key === 'medium' ? 0.1 : 0.2) }}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: key === 'high' ? '#ef4444' : key === 'medium' ? '#f59e0b' : '#10b981' }}
                />
                <span className="text-xs text-gray-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {data.count} ({formatPercentage(data.percentage)})
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Sentiment Analysis */}
      <Card className="gradient-chart-bg overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
              Sentiment Analysis
            </CardTitle>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">Distribution of overall sentiment in the news articles</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          {renderSentimentAnalysis()}
          
          <div className="flex justify-center mt-2 space-x-4">
            {Object.entries(sentimentData).map(([key, data]) => (
              <motion.div 
                key={key} 
                className="flex items-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (key === 'positive' ? 0 : key === 'neutral' ? 0.1 : 0.2) }}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ 
                    backgroundColor: key === 'positive' ? '#10b981' : key === 'neutral' ? '#6b7280' : '#ef4444' 
                  }}
                />
                <span className="text-xs text-gray-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {data.count} ({formatPercentage(data.percentage)})
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Historical Trends with improved time range selector */}
      <Card className="lg:col-span-2 gradient-chart-bg overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Impact Trends</span>
              <Badge variant="outline" className="ml-2 bg-blue-900/20 text-blue-400 border-blue-500/30 text-xs">
                {activeTimeRange.toUpperCase()}
              </Badge>
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs defaultValue="7d" onValueChange={(v) => setActiveTimeRange(v as '7d' | '14d' | '30d')}>
              <TabsList className="h-7 bg-gray-800/50">
                <TabsTrigger value="7d" className="text-xs px-2 h-5">7D</TabsTrigger>
                <TabsTrigger value="14d" className="text-xs px-2 h-5">14D</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2 h-5">30D</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setExpandedView(!expandedView)}
            >
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderTrendChart()}
          
          <motion.div 
            className="grid grid-cols-3 gap-2 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {['high', 'medium', 'low'].map((impact) => {
              const trend = Math.random() > 0.5 ? 'up' : 'down';
              const percentChange = (Math.random() * 10).toFixed(1);
              
              return (
                <div key={impact} className="bg-gray-800/30 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ 
                        backgroundColor: impact === 'high' ? '#ef4444' : impact === 'medium' ? '#f59e0b' : '#10b981' 
                      }}
                    />
                    <span className="text-xs text-gray-300 capitalize">{impact}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {trend === 'up' ? '+' : '-'}{percentChange}%
                    </span>
                    {trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-400 ml-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};
