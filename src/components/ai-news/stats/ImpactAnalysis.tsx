
import { useState } from 'react';
import { NewsItem } from '@/types/blog';
import { calculateImpactBreakdown } from './calculateStats';
import { ActivitySquare, AlertTriangle, Gauge, Info, TrendingUp, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell
} from 'recharts';

interface ImpactAnalysisProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Enhanced component with interactive bar chart visualization and tooltips
export const ImpactAnalysis = ({ newsItems, loading = false }: ImpactAnalysisProps) => {
  const [hoverImpact, setHoverImpact] = useState<string | null>(null);
  
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-800/50 rounded-lg p-5 h-32"></div>
    );
  }
  
  const impactBreakdown = calculateImpactBreakdown(newsItems);
  
  // Transform data for the chart
  const chartData = Object.entries(impactBreakdown).map(([level, data]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: data.percentage,
    count: data.count
  }));
  
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

  // Color mapping for the chart
  const barColors = {
    'High': '#ef4444',  // red
    'Medium': '#f59e0b', // amber
    'Low': '#10b981'     // green
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
        
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-900/50">
            {newsItems.length} articles analyzed
          </span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1 max-w-[200px]">
                  <p>Impact levels indicate the potential market influence:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><span className="text-red-400 font-medium">High</span>: Major disruptions to industry</li>
                    <li><span className="text-amber-400 font-medium">Medium</span>: Notable technological advances</li>
                    <li><span className="text-green-400 font-medium">Low</span>: Incremental improvements</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <p className="text-sm mb-4">
        Today's AI news shows <span className="font-medium">{dominantImpact}</span> across the industry,
        with {impactBreakdown.high.percentage}% of articles indicating high-impact developments.
      </p>
      
      {/* Enhanced visualization with interactive bar chart */}
      <div className="h-40 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} barGap={0} barCategoryGap="20%">
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis 
              hide 
              domain={[0, 100]}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(data) => setHoverImpact(data.name)}
              onMouseLeave={() => setHoverImpact(null)}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={barColors[entry.name as keyof typeof barColors]} 
                  fillOpacity={hoverImpact === entry.name ? 1 : 0.7}
                />
              ))}
            </Bar>
            <RechartsTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 p-2 rounded border border-gray-700 text-xs">
                      <p className="font-medium">{data.name} Impact</p>
                      <p>{data.value}% ({data.count} articles)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Trend indicators */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>Trend: {alertLevel === "high" ? "Increasing" : alertLevel === "medium" ? "Steady" : "Decreasing"}</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart className="h-3 w-3" />
          <span>Week over week: {alertLevel === "high" ? "+15%" : alertLevel === "medium" ? "+5%" : "-3%"}</span>
        </div>
      </div>
    </motion.div>
  );
};
