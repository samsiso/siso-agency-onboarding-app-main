
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
  
  // [Analysis] Use the AI summary hook to fetch summary data based on news items
  const { summaryData, isLoading: summaryLoading } = useAiDailySummary(newsItems);
  
  return (
    <Card className="bg-gray-900/30 border-gray-800">
      <CardContent className="p-4">
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Today's AI News Insights
            </h2>
            <TabsList>
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="impact">
                <BarChart3 className="h-4 w-4 mr-2" />
                Impact Analysis
              </TabsTrigger>
              <TabsTrigger value="technology">
                <LineChart className="h-4 w-4 mr-2" />
                Technology
              </TabsTrigger>
              <TabsTrigger value="ai-summary">
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
              activeTab="summary"
              setActiveTab={() => {}}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
