
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Lightbulb, TrendingUp, RefreshCw, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface DailySummaryProps {
  date?: string;
  articleCount?: number;
  refreshSummary?: () => Promise<void>;
  isAdmin?: boolean;
}

// [Analysis] Interface for the daily summary data
interface SummaryData {
  date: string;
  summary: string;
  key_points: string[];
  practical_applications: string[];
  industry_impacts: Record<string, string>;
  article_count: number;
  created_at: string;
  generated_with: string;
}

export function DailySummary({ 
  date = new Date().toISOString().split('T')[0],
  articleCount = 0,
  refreshSummary,
  isAdmin = false
}: DailySummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();
  
  // Format the date for display
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : 'Today';
  
  // [Analysis] Fetch the summary for the given date
  const fetchSummary = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('ai_news_daily_summaries')
        .select('*')
        .eq('date', date)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching summary:', error);
        toast({
          title: 'Error',
          description: 'Failed to load daily summary. Please try again.',
          variant: 'destructive',
        });
      } else if (data) {
        setSummaryData(data);
      }
    } catch (error) {
      console.error('Error in fetchSummary:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // [Analysis] Generate a new summary for the date
  const generateSummary = async (forceRefresh = false) => {
    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-daily-summary', {
        body: { 
          date,
          forceRefresh
        },
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      // Refetch the summary from the database to get all fields
      await fetchSummary();
      
      toast({
        title: 'Success',
        description: forceRefresh 
          ? 'Daily summary has been regenerated' 
          : 'Daily summary has been generated',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate summary',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };
  
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-purple-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Today's AI Highlights</span>
              <Badge variant="outline" className="ml-2 bg-purple-800/50 text-xs">
                {formattedDate}
              </Badge>
            </CardTitle>
            <CardDescription>
              {summaryData 
                ? `A summary of ${summaryData.article_count || articleCount} AI news articles published today`
                : 'Daily highlights of the most important AI developments'}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
                className="bg-purple-900/30 border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Generating...' : summaryData ? 'Regenerate' : 'Generate Summary'}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="bg-purple-900/30 border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : summaryData ? (
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
        ) : shouldShowGeneratePrompt ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-purple-500 mb-3" />
              <h3 className="text-lg font-medium">No summary available for {formattedDate}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {articleCount > 0 
                  ? `There are ${articleCount} articles published, but no summary has been generated yet.`
                  : 'There are no articles or summary available for this date.'}
              </p>
            </div>
            
            {isAdmin && articleCount > 0 && (
              <Button 
                onClick={handleGenerate} 
                disabled={generating}
                className="bg-purple-700 hover:bg-purple-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generating ? 'Generating Summary...' : 'Generate Summary'}
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
      
      {summaryData && (
        <CardFooter className="bg-purple-950/30 py-2 text-xs text-muted-foreground flex justify-between">
          <div>
            Generated {new Date(summaryData.created_at).toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs bg-purple-900/30">
              {summaryData.article_count} articles
            </Badge>
            {summaryData.generated_with === 'openai' && (
              <Badge variant="outline" className="text-xs bg-green-900/30 text-green-300">
                AI-Enhanced
              </Badge>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
