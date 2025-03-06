
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';

interface SummaryContentProps {
  loading: boolean;
  summaryData: DailySummaryData | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

// [Analysis] Extracted content component with tabs
export function SummaryContent({ 
  loading, 
  summaryData, 
  activeTab, 
  setActiveTab 
}: SummaryContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (!summaryData) {
    return null;
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-purple-900/30 border-purple-500/30">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="key-points">Key Points</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="impacts">Industry Impacts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="mt-4">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {summaryData.summary}
        </p>
      </TabsContent>
      
      <TabsContent value="key-points" className="mt-4">
        <div className="space-y-2">
          {summaryData.key_points?.map((point, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Badge className="mt-0.5 bg-purple-800">{index + 1}</Badge>
              <p className="text-sm flex-1">{point}</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="applications" className="mt-4">
        <div className="space-y-3">
          {summaryData.practical_applications?.map((application, index) => (
            <div key={index} className="flex gap-3 items-start border-l-2 border-purple-600 pl-3 py-1">
              <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm">{application}</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="impacts" className="mt-4">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {summaryData.industry_impacts && Object.entries(summaryData.industry_impacts).map(([industry, impact], index) => (
              <div key={index} className="bg-purple-950/30 rounded-md p-3">
                <h4 className="text-sm font-medium text-purple-300 mb-1 capitalize">
                  {industry.replace(/_/g, ' ')}
                </h4>
                <p className="text-xs text-gray-300">{impact}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
