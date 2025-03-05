
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Database,
  CalendarClock,
  BarChart
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// [Analysis] Central component to display fetch history and automation status
export const FetchHistoryPanel = ({ onRefresh }: { onRefresh: () => void }) => {
  const [fetchHistory, setFetchHistory] = useState<any[]>([]);
  const [nextScheduledFetch, setNextScheduledFetch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiMetrics, setAiMetrics] = useState<{
    avgRelevance: number;
    categoryDistribution: Record<string, number>;
  }>({
    avgRelevance: 0,
    categoryDistribution: {}
  });
  const { toast } = useToast();

  // [Plan] Fetch history data from the news_fetch_history table 
  useEffect(() => {
    fetchHistoryData();
    fetchAiMetrics();
    
    // Calculate next scheduled fetch based on cron job (every 6 hours)
    calculateNextScheduledFetch();
    
    // Refresh every minute to update the "time ago" displays
    const interval = setInterval(() => {
      calculateNextScheduledFetch();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchHistoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('news_fetch_history')
        .select('*')
        .order('fetch_time', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setFetchHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // [Analysis] Fetch AI relevance metrics to show quality of articles being collected
  const fetchAiMetrics = async () => {
    try {
      // Get average AI relevance score from the most recent articles
      const { data: recentArticles, error: articlesError } = await supabase
        .from('ai_news')
        .select('category')
        .order('created_at', { ascending: false })
        .limit(100);

      if (articlesError) throw articlesError;

      if (recentArticles && recentArticles.length > 0) {
        // Calculate category distribution
        const categories: Record<string, number> = {};
        recentArticles.forEach(article => {
          const category = article.category || 'uncategorized';
          categories[category] = (categories[category] || 0) + 1;
        });

        setAiMetrics({
          avgRelevance: 85, // Placeholder - would calculate from actual scores if available
          categoryDistribution: categories
        });
      }
    } catch (error) {
      console.error('Error fetching AI metrics:', error);
    }
  };
  
  // [Analysis] Calculate when the next scheduled fetch will occur based on 6-hour intervals
  const calculateNextScheduledFetch = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // The cron job runs at hours 0, 6, 12, 18
    const nextRunHour = Math.ceil(currentHour / 6) * 6;
    const nextRun = new Date(now);
    
    if (nextRunHour <= currentHour) {
      // If we're past the current interval, move to the next one
      nextRun.setHours(nextRunHour + 6, 0, 0, 0);
    } else {
      // Otherwise use the current interval
      nextRun.setHours(nextRunHour, 0, 0, 0);
    }
    
    // Format as string for display
    setNextScheduledFetch(nextRun.toISOString());
  };
  
  // [Analysis] Trigger a manual fetch by calling the edge function directly
  const handleManualFetch = async () => {
    setLoading(true);
    try {
      toast({
        title: "Manual sync initiated",
        description: "Fetching latest AI news articles...",
      });
      
      await onRefresh();
      
      // Refresh the history after a short delay to allow fetch to complete
      setTimeout(() => {
        fetchHistoryData();
        fetchAiMetrics();
      }, 3000);
      
    } catch (error) {
      console.error('Error triggering manual fetch:', error);
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "There was an error fetching news articles.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get status color based on fetch status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'initiated':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  // [Analysis] Get the top categories to display in the sidebar
  const getTopCategories = () => {
    const categories = aiMetrics.categoryDistribution;
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({
        name: category.replace(/_/g, ' '),
        count
      }));
  };

  return (
    <Card className="border-slate-800 bg-slate-950/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-purple-400" />
            Automated News Fetching
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleManualFetch} 
                  size="sm" 
                  variant="outline"
                  className="gap-2 h-8"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 text-purple-400" />
                  )}
                  Sync Now
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manually fetch latest AI news articles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          News articles are automatically fetched every 6 hours
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {nextScheduledFetch && (
          <div className="flex items-center justify-between mb-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Next scheduled fetch:</span>
            </div>
            <Badge variant="outline" className="bg-blue-950/20 text-blue-400 border-blue-500/50">
              {formatDistanceToNow(new Date(nextScheduledFetch), { addSuffix: true })}
            </Badge>
          </div>
        )}
        
        {/* AI Content Metrics */}
        <div className="my-4 space-y-2 p-2 rounded-md border border-slate-800 bg-slate-900/50">
          <div className="text-sm font-medium flex items-center gap-2">
            <BarChart className="h-4 w-4 text-green-400" />
            <span>AI Content Metrics</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {getTopCategories().map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground capitalize">{category.name}:</span>
                <Badge variant="outline" className="bg-indigo-950/20 text-indigo-400 border-indigo-500/50">
                  {category.count} articles
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-400" />
            Recent Fetch History
          </div>
          
          {fetchHistory.length > 0 ? (
            <div className="space-y-2">
              {fetchHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-2 rounded-md border border-slate-800 bg-slate-900/50 text-xs"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {item.status === 'success' && <CheckCircle className="h-3.5 w-3.5 text-green-400" />}
                      {item.status === 'error' && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                      {item.status === 'pending' && <RefreshCw className="h-3.5 w-3.5 text-yellow-400 animate-spin" />}
                      {item.status === 'initiated' && <RefreshCw className="h-3.5 w-3.5 text-blue-400" />}
                      <span className="font-medium">
                        {format(parseISO(item.fetch_time), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {item.status === 'success' && (
                      <div className="text-muted-foreground ml-5 mt-1">
                        {item.articles_added} articles added, {item.duplicates_skipped} duplicates skipped
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="text-red-400 ml-5 mt-1 truncate max-w-[250px]">
                        {item.error_message || "Unknown error"}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(item.status)} capitalize`}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No fetch history available yet
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full text-xs text-muted-foreground">
          Older articles are automatically archived after 30 days.
        </div>
      </CardFooter>
    </Card>
  );
};
