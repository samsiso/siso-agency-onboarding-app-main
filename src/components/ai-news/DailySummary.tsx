
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
  const { summaryData, loading, generating, error, fetchSummary, generateSummary } = useAiDailySummary(date, isAdmin);
  
  // Fetch summary on mount and when date changes
  useEffect(() => {
    fetchSummary();
  }, [date]);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (refreshSummary) {
      await refreshSummary();
    }
    await fetchSummary();
  };
  
  // Handle generate summary click
  const handleGenerate = async () => {
    await generateSummary(summaryData !== null);
  };
  
  // If there's no summary data and we've finished loading
  const shouldShowGeneratePrompt = !loading && !summaryData;
  
  return (
    <Card className="border-purple-600/20 bg-purple-950/10 mb-6 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-950/30 to-indigo-900/20 pb-2">
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
      
      <CardContent className="pt-4">
        {error && (
          <Alert variant="warning" className="mb-4 bg-amber-900/20 border-amber-600/30">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : summaryData ? (
          <SummaryContent
            loading={loading}
            summaryData={summaryData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : shouldShowGeneratePrompt ? (
          <GeneratePrompt
            formattedDate={formattedDate}
            articleCount={articleCount}
            isAdmin={isAdmin}
            generating={generating}
            onGenerate={handleGenerate}
          />
        ) : null}
      </CardContent>
      
      {summaryData && <SummaryFooter summaryData={summaryData} />}
    </Card>
  );
}
