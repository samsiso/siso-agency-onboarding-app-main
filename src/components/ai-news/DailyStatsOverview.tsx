
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Activity, BarChart3, LineChart, Brain } from 'lucide-react';
import { NewsItem } from '@/types/blog';
import { ImpactAnalysis } from './stats/ImpactAnalysis';
import { TechnologyBreakdown } from './stats/TechnologyBreakdown';
import { TopStatsRow } from './stats/TopStatsRow';
import { SummaryContent } from './daily-summary/SummaryContent';
import { useAiDailySummary } from '@/hooks/useAiDailySummary';

interface DailyStatsOverviewProps {
  newsItems: NewsItem[];
  loading: boolean;
}

// [Analysis] Added AI Summary tab to provide overview of the day's news
export const DailyStatsOverview = ({
  newsItems,
  loading
}: DailyStatsOverviewProps) => {
  // Don't render if no news items and not loading
  if (newsItems.length === 0 && !loading) {
    return null;
  }
  
  // [Analysis] Added state for tracking the active AI summary tab
  const [activeTab, setActiveTab] = useState('overview');
  const [summaryActiveTab, setSummaryActiveTab] = useState('summary');
  
  // [Analysis] Extract the date from the first news item or use current date
  const currentDate = newsItems.length > 0 && newsItems[0].date 
    ? newsItems[0].date 
    : new Date().toISOString().split('T')[0];
    
  // [Analysis] Use the AI summary hook to fetch summary data based on the date
  const { summaryData, loading: summaryLoading } = useAiDailySummary(currentDate);
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-purple-950/20 border-gray-800 shadow-lg shadow-purple-900/5">
      <CardContent className="p-4">
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Today's AI News Insights
              </span>
            </h2>
            <TabsList className="bg-gray-900/70 border border-gray-800">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="impact"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Impact
              </TabsTrigger>
              <TabsTrigger 
                value="technology"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white"
              >
                <LineChart className="h-4 w-4 mr-2" />
                Technology
              </TabsTrigger>
              <TabsTrigger 
                value="ai-summary"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Summary
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <TopStatsRow newsItems={newsItems} loading={loading} />
          </TabsContent>
          
          <TabsContent value="impact">
            <ImpactAnalysis newsItems={newsItems} loading={loading} />
          </TabsContent>
          
          <TabsContent value="technology">
            <TechnologyBreakdown newsItems={newsItems} loading={loading} />
          </TabsContent>
          
          <TabsContent value="ai-summary">
            <SummaryContent 
              loading={summaryLoading || loading} 
              summaryData={summaryData}
              activeTab={summaryActiveTab}
              setActiveTab={setSummaryActiveTab}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
