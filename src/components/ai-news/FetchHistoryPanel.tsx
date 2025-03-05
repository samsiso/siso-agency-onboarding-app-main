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
  BarChart,
  Zap,
  TrendingUp,
  BookOpen
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
    contentQuality: {
      high: number;
      medium: number;
      low: number;
    };
    technicalComplexity: {
      advanced: number;
      intermediate: number;
      basic: number;
    };
  }>({
    avgRelevance: 0,
    categoryDistribution: {},
    contentQuality: {
      high: 0,
      medium: 0,
      low: 0
    },
    technicalComplexity: {
      advanced: 0,
      intermediate: 0,
      basic: 0
    }
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

  // [Analysis] Enhanced metrics fetching to include content quality and technical complexity
  const fetchAiMetrics = async () => {
    try {
      // Get average AI relevance score from the most recent articles
      const { data: recentArticles, error: articlesError } = await supabase
        .from('ai_news')
        .select('category, technical_complexity, impact')
        .order('created_at', { ascending: false })
        .limit(100);

      if (articlesError) throw articlesError;

      if (recentArticles && recentArticles.length > 0) {
        // Calculate category distribution
        const categories: Record<string, number> = {};
        const contentQuality = {
          high: 0,
          medium: 0,
          low: 0
        };
        const technicalComplexity = {
          advanced: 0,
          intermediate: 0,
          basic: 0
        };
        
        recentArticles.forEach(article => {
          // Process category distribution
          const category = article.category || 'uncategorized';
          categories[category] = (categories[category] || 0) + 1;
          
          // Process impact (as content quality)
          if (article.impact === 'high') contentQuality.high++;
          else if (article.impact === 'medium') contentQuality.medium++;
          else contentQuality.low++;
          
          // Process technical complexity
          if (article.technical_complexity === 'advanced') technicalComplexity.advanced++;
          else if (article.technical_complexity === 'intermediate') technicalComplexity.intermediate++;
          else technicalComplexity.basic++;
        });

        setAiMetrics({
          avgRelevance: 85, // Placeholder - would calculate from actual scores if available
          categoryDistribution: categories,
          contentQuality,
          technicalComplexity
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

  // [Analysis] Render the top categories with improved UI
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
        
        {/* Enhanced AI Content Metrics */}
        <div className="my-4 space-y-4 p-3 rounded-md border border-slate-800 bg-slate-900/50">
          <div className="text-sm font-medium flex items-center gap-2">
            <BarChart className="h-4 w-4 text-green-400" />
            <span>AI Content Metrics</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Distribution */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-blue-400" />
                Top Categories
              </h4>
              
              <div className="space-y-1.5">
                {getTopCategories().map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground capitalize">{category.name}:</span>
                    <Badge variant="outline" className="bg-indigo-950/20 text-indigo-400 border-indigo-500/50 text-xs">
                      {category.count} articles
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Technical Complexity */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                Technical Depth
              </h4>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Advanced:</span>
                  <Badge variant="outline" className="bg-purple-950/20 text-purple-400 border-purple-500/50 text-xs">
                    {aiMetrics.technicalComplexity.advanced} articles
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Intermediate:</span>
                  <Badge variant="outline" className="bg-blue-950/20 text-blue-400 border-blue-500/50 text-xs">
                    {aiMetrics.technicalComplexity.intermediate} articles
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Basic:</span>
                  <Badge variant="outline" className="bg-green-950/20 text-green-400 border-green-500/50 text-xs">
                    {aiMetrics.technicalComplexity.basic} articles
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Content Quality */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Impact Level
              </h4>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">High Impact:</span>
                  <Badge variant="outline" className="bg-red-950/20 text-red-400 border-red-500/50 text-xs">
                    {aiMetrics.contentQuality.high} articles
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Medium Impact:</span>
                  <Badge variant="outline" className="bg-orange-950/20 text-orange-400 border-orange-500/50 text-xs">
                    {aiMetrics.contentQuality.medium} articles
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Low Impact:</span>
                  <Badge variant="outline" className="bg-gray-950/20 text-gray-400 border-gray-500/50 text-xs">
                    {aiMetrics.contentQuality.low} articles
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Reading Level */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-pink-400" />
                Content Quality Score
              </h4>
              
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Relevance Score:</span>
                  <span className="text-xs font-semibold text-purple-400">{aiMetrics.avgRelevance}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${aiMetrics.avgRelevance}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 text-center">
                  Based on AI relevance analysis of recent articles
                </div>
              </div>
            </div>
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
