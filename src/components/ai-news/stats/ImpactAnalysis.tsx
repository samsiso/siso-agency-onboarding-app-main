
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend
} from 'recharts';
import { NewsItem } from '@/types/blog';
import { calculateImpactBreakdown, calculateSentimentDistribution, generateHistoricalTrends } from './calculateStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImpactAnalysisProps {
  newsItems: NewsItem[];
  loading?: boolean;
}

// [Analysis] Component for visualizing impact analysis with multiple charts
export function ImpactAnalysis({ newsItems, loading = false }: ImpactAnalysisProps) {
  // If loading, show skeleton state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no news items, show empty state
  if (newsItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Impact Analysis</CardTitle>
          <CardDescription>No data available for analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="mx-auto h-10 w-10 mb-2 text-yellow-400/60" />
            <p>No news items to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate impact breakdown
  const impactData = calculateImpactBreakdown(newsItems);
  
  // Convert to array format for charts
  const impactChartData = [
    { name: 'High', value: impactData.high.count, percentage: impactData.high.percentage },
    { name: 'Medium', value: impactData.medium.count, percentage: impactData.medium.percentage },
    { name: 'Low', value: impactData.low.count, percentage: impactData.low.percentage }
  ];
  
  // Calculate sentiment distribution
  const sentimentData = calculateSentimentDistribution(newsItems);
  
  // Convert to array format for charts
  const sentimentChartData = [
    { name: 'Positive', value: sentimentData.positive.count, percentage: sentimentData.positive.percentage },
    { name: 'Neutral', value: sentimentData.neutral.count, percentage: sentimentData.neutral.percentage },
    { name: 'Negative', value: sentimentData.negative.count, percentage: sentimentData.negative.percentage }
  ];
  
  // Generate historical trends
  const trendData = generateHistoricalTrends(7);
  
  // Colors for pie charts
  const IMPACT_COLORS = ['#ef4444', '#f97316', '#22c55e'];
  const SENTIMENT_COLORS = ['#22c55e', '#64748b', '#ef4444'];

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-950/90 p-3 border border-gray-800 rounded-md shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`Count: ${payload[0].value}`}</p>
          <p className="text-sm">{`Percentage: ${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Impact Distribution</CardTitle>
              <CardDescription>Breakdown of content by impact level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-[240px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {impactChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={IMPACT_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
                  {impactChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: IMPACT_COLORS[index] }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.value} ({item.percentage}%)
                        </Badge>
                        {index === 0 ? (
                          <ChevronUp className="h-4 w-4 ml-1 text-green-500" />
                        ) : index === impactChartData.length - 1 ? (
                          <ChevronDown className="h-4 w-4 ml-1 text-red-500" />
                        ) : (
                          <Minus className="h-4 w-4 ml-1 text-gray-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sentiment Analysis</CardTitle>
              <CardDescription>Content tone and sentiment distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-[240px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
                  {sentimentChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: SENTIMENT_COLORS[index] }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="ml-2 text-xs">
                          {item.value} ({item.percentage}%)
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Trends</CardTitle>
              <CardDescription>AI news impact levels over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        borderColor: '#333',
                        color: '#fff' 
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Impact" />
                    <Bar dataKey="medium" stackId="a" fill="#f97316" name="Medium Impact" />
                    <Bar dataKey="low" stackId="a" fill="#22c55e" name="Low Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
