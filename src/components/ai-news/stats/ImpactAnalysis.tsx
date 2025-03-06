
import React from 'react';
import { NewsItem } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { calculateImpactBreakdown, calculateSentimentDistribution, generateHistoricalTrends } from './calculateStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatPercentage } from '@/lib/formatters';

interface ImpactAnalysisProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// Helper for impact colors
const impactColors = {
  high: '#ef4444',   // Red for high impact
  medium: '#f59e0b', // Amber for medium impact
  low: '#10b981'     // Green for low impact
};

const sentimentColors = {
  positive: '#10b981', // Green for positive
  neutral: '#6b7280',  // Gray for neutral
  negative: '#ef4444'  // Red for negative
};

// [Analysis] Component that presents the impact and sentiment analysis for news items
export const ImpactAnalysis = ({ newsItems, loading = false }: ImpactAnalysisProps) => {
  // Calculate impact breakdown
  const impactData = calculateImpactBreakdown(newsItems);
  
  // Convert to format for Recharts
  const chartData = [
    { name: 'High Impact', value: impactData.high.count, color: impactColors.high },
    { name: 'Medium Impact', value: impactData.medium.count, color: impactColors.medium },
    { name: 'Low Impact', value: impactData.low.count, color: impactColors.low }
  ];
  
  // Calculate sentiment distribution
  const sentimentData = calculateSentimentDistribution(newsItems);
  
  // Convert to format for Recharts
  const sentimentChartData = [
    { name: 'Positive', value: sentimentData.positive.count, color: sentimentColors.positive },
    { name: 'Neutral', value: sentimentData.neutral.count, color: sentimentColors.neutral },
    { name: 'Negative', value: sentimentData.negative.count, color: sentimentColors.negative }
  ];
  
  // Generate historical trend data for demonstration
  const trendData = generateHistoricalTrends();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[180px] w-full" />
          </CardContent>
        </Card>
        
        <Card>
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
      <Card>
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Impact Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${formatPercentage(Math.round(percent * 100))})`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Articles']}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex justify-center mt-2 space-x-4">
            {Object.entries(impactData).map(([key, data]) => (
              <div key={key} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: impactColors[key as keyof typeof impactColors] }}
                />
                <span className="text-xs text-gray-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {data.count} ({formatPercentage(data.percentage)})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Sentiment Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${formatPercentage(Math.round(percent * 100))})`}
                  labelLine={false}
                >
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'Articles']}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center mt-2 space-x-4">
            {Object.entries(sentimentData).map(([key, data]) => (
              <div key={key} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: sentimentColors[key as keyof typeof sentimentColors] }}
                />
                <span className="text-xs text-gray-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {data.count} ({formatPercentage(data.percentage)})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Historical Trends */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">7-Day Impact Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="high" name="High Impact" stackId="a" fill={impactColors.high} />
                <Bar dataKey="medium" name="Medium Impact" stackId="a" fill={impactColors.medium} />
                <Bar dataKey="low" name="Low Impact" stackId="a" fill={impactColors.low} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
