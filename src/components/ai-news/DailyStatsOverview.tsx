
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { NewsItem } from '@/types/blog';
import { 
  Clock, 
  BarChart, 
  RefreshCw, 
  ChevronDown, 
  Download, 
  Save,
  Maximize2,
  PieChart,
  Sparkles
} from 'lucide-react';
import { TopStatsRow } from './stats/TopStatsRow';
import { ImpactAnalysis } from './stats/ImpactAnalysis';
import { TechnologyBreakdown } from './stats/TechnologyBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/formatters';
import { SummaryContent } from './daily-summary/SummaryContent';
import { useAiDailySummary } from '@/hooks/useAiDailySummary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SummaryFooter } from './daily-summary/SummaryFooter';
import { GeneratePrompt } from './daily-summary/GeneratePrompt';

interface DailyStatsOverviewProps {
  newsItems: NewsItem[];
  lastSync: string | null;
  articleCount: number;
  loading?: boolean;
  currentDate?: Date;
  isAdmin?: boolean;
  refreshSummary?: () => Promise<void>;
}

// [Analysis] Enhanced component with better organization, tabs, and interactive features
export const DailyStatsOverview = ({ 
  newsItems, 
  lastSync, 
  articleCount,
  loading = false,
  currentDate = new Date(),
  isAdmin = false,
  refreshSummary
}: DailyStatsOverviewProps) => {
  // [Analysis] Only show this component if we have news items or are in loading state
  if (newsItems.length === 0 && !loading) {
    return null;
  }

  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get current date formatted as YYYY-MM-DD for the summary
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  
  // Use the daily summary hook
  const {
    summaryData,
    loading: summaryLoading,
    generating: summaryGenerating,
    error: summaryError,
    fetchSummary,
    generateSummary
  } = useAiDailySummary(formattedDate, isAdmin);

  // Handle generate summary click
  const handleGenerateSummary = async () => {
    await generateSummary(summaryData !== null);
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (refreshSummary) {
      await refreshSummary();
    }
  };

  // [Analysis] Function to export insights as CSV
  const exportInsights = () => {
    // This would generate and download a CSV file with the insight data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Category,Count,Percentage\n" + 
      Object.entries(newsItems
        .reduce((acc, item) => {
          const category = item.category || 'unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>))
        .map(([category, count]) => 
          `${category},${count},${Math.round((count / newsItems.length) * 100)}%`
        )
        .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai-news-insights-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If there's no summary data and we've finished loading
  const shouldShowGeneratePrompt = !summaryLoading && !summaryData;

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-900/50 to-gray-950/30 rounded-lg border border-gray-800 mb-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section with better interactive elements */}
      <Collapsible 
        open={expanded} 
        onOpenChange={setExpanded}
        className="w-full"
      >
        <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-400" />
              Today's AI News Insights
            </h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "" : "rotate-180"}`} />
                <span className="sr-only">Toggle insights panel</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-gray-400 text-sm mr-2">
              Analysis of <span className="font-medium text-white">{newsItems.length}</span> articles
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={exportInsights}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Export insights</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export insights as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save this view</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save this view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Maximize2 className="h-4 w-4" />
                    <span className="sr-only">Expand insights</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View full insights dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-2 border-b border-gray-800/50 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last updated: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Articles this month: {formatNumber(articleCount)}
            </div>
          </div>
          
          {/* Stats content with tabs for better organization */}
          <div className="p-4 sm:p-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Summary
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <TopStatsRow newsItems={newsItems} loading={loading} />
              </TabsContent>
              
              <TabsContent value="impact" className="mt-0">
                <ImpactAnalysis newsItems={newsItems} loading={loading} />
              </TabsContent>
              
              <TabsContent value="technology" className="mt-0">
                <TechnologyBreakdown newsItems={newsItems} loading={loading} />
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                {summaryError && (
                  <Alert variant="default" className="bg-purple-950/20 border-purple-500/30 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {summaryError}
                    </AlertDescription>
                  </Alert>
                )}
                
                {shouldShowGeneratePrompt ? (
                  <GeneratePrompt 
                    articleCount={articleCount} 
                    onGenerate={handleGenerateSummary} 
                    isAdmin={isAdmin}
                  />
                ) : (
                  <>
                    <SummaryContent 
                      summaryData={summaryData} 
                      loading={summaryLoading || summaryGenerating}
                      activeTab="summary"
                    />
                    {summaryData && (
                      <SummaryFooter
                        summaryData={summaryData}
                        date={formattedDate}
                      />
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

