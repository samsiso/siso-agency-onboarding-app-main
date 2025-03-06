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
import { toast } from '@/hooks/use-toast';
interface DailySummaryProps {
  date?: string;
  articleCount?: number;
  refreshSummary?: () => Promise<void>;
  isAdmin?: boolean;
}

// [Analysis] Main component that orchestrates the summary display with enhanced error handling
export function DailySummary({
  date = new Date().toISOString().split('T')[0],
  articleCount = 0,
  refreshSummary,
  isAdmin = true // [Plan] Default to true for testing purposes
}: DailySummaryProps) {
  const [activeTab, setActiveTab] = useState('summary');
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

  // Handle refresh button click with better feedback
  const handleRefresh = async () => {
    try {
      console.log("DailySummary: Refreshing summary data");
      toast({
        title: "Refreshing summary",
        description: "Fetching the latest AI-generated summary..."
      });
      if (refreshSummary) {
        await refreshSummary();
      }
      await fetchSummary();
      toast({
        title: "Summary refreshed",
        description: "The latest summary data has been loaded."
      });
    } catch (err) {
      console.error("Error refreshing summary:", err);
      toast({
        title: "Refresh failed",
        description: "Could not refresh the summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle generate summary click with enhanced error handling
  const handleGenerate = async () => {
    try {
      console.log(`DailySummary: Generating summary, exists: ${summaryData !== null}`);
      toast({
        title: "Generating summary",
        description: "This may take up to 30 seconds. Please wait..."
      });
      await generateSummary(summaryData !== null);

      // The success toast will be shown in the generateSummary function itself
    } catch (err) {
      console.error("Error generating summary:", err);
      toast({
        title: "Generation failed",
        description: "Could not generate the summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  // If there's no summary data and we've finished loading
  const shouldShowGeneratePrompt = !loading && !summaryData;

  // [Analysis] Return the JSX for the component with improved error states
  return;
}