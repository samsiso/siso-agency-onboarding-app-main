
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { SummaryHeader } from './daily-summary/SummaryHeader';
import { SummaryContent } from './daily-summary/SummaryContent';
import { SummaryFooter } from './daily-summary/SummaryFooter';
import { GeneratePrompt } from './daily-summary/GeneratePrompt';
import { useAiDailySummary } from '@/hooks/useAiDailySummary';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DailySummaryProps {
  date?: string;
  articleCount?: number;
  refreshSummary?: () => Promise<void>;
  isAdmin?: boolean;
}

// [Analysis] Main component that orchestrates the summary display
export function DailySummary({
  date = new Date().toISOString().split('T')[0],
  articleCount = 0,
  refreshSummary,
  isAdmin = false
}: DailySummaryProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Format the date for display
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : 'Today';

  // Use our custom hook
  const {
    summaryData,
    loading,
    generating,
    error,
    fetchSummary,
    generateSummary
  } = useAiDailySummary(date, isAdmin);

  // Fetch summary on mount and when date changes
  useEffect(() => {
    console.log(`DailySummary: Fetching summary for date ${date}`);
    fetchSummary();
  }, [date, fetchSummary]);

  // Handle refresh button click
  const handleRefresh = async () => {
    console.log("DailySummary: Refreshing summary data");
    if (refreshSummary) {
      await refreshSummary();
    }
    await fetchSummary();
  };

  // Handle generate summary click
  const handleGenerate = async () => {
    console.log(`DailySummary: Generating summary, exists: ${summaryData !== null}`);
    await generateSummary(summaryData !== null);
  };

  // If there's no summary data and we've finished loading
  const shouldShowGeneratePrompt = !loading && !summaryData;

  // [Analysis] Return the JSX for the component
  return (
    <Card className="border-purple-500/30 bg-purple-950/20 mb-8">
      <CardHeader className="pb-2">
        <SummaryHeader 
          formattedDate={formattedDate}
          articleCount={articleCount}
          summaryData={summaryData}
          generating={generating}
          isAdmin={isAdmin}
          onGenerate={handleGenerate}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-950/30 border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {shouldShowGeneratePrompt ? (
          <GeneratePrompt onGenerate={handleGenerate} isAdmin={isAdmin} />
        ) : (
          <SummaryContent
            loading={loading}
            summaryData={summaryData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </CardContent>
      
      {summaryData && !loading && (
        <SummaryFooter summaryData={summaryData} />
      )}
    </Card>
  );
}
