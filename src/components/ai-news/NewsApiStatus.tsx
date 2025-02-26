
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { InfoCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsApiStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [articleCount, setArticleCount] = useState(0);
  const [apiUsage, setApiUsage] = useState(0);
  const { toast } = useToast();

  // [Analysis] Fetch API status on component mount
  useEffect(() => {
    fetchApiStatus();
  }, []);

  const fetchApiStatus = async () => {
    try {
      // Get the count of articles from current month
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayStr = firstDay.toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('ai_news')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayStr);
      
      if (error) throw error;
      
      // We're assuming each article creation used one API call
      // API limit is 2000 calls per month
      const usagePercentage = ((count || 0) / 2000) * 100;
      
      setApiUsage(usagePercentage);
      setArticleCount(count || 0);
      
      // Get last sync time
      const { data: latestArticle } = await supabase
        .from('ai_news')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestArticle) {
        const syncDate = new Date(latestArticle.created_at);
        setLastSync(syncDate.toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching API status:', error);
    }
  };

  // [Analysis] Function to trigger news fetch via Edge Function
  const triggerNewsFetch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-ai-news', {
        body: { 
          keyword: "artificial intelligence", 
          limit: 20 
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "News synced successfully",
          description: data.message,
        });
        fetchApiStatus(); // Refresh stats
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error syncing news:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: error.message || "Failed to sync AI news",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-md p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <InfoCircle className="h-5 w-5 text-blue-500" />
          API Status
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerNewsFetch} 
          disabled={isLoading}
          className="h-8"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Now
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">API Usage (Monthly)</p>
          <div className="flex items-center gap-2">
            <Progress value={apiUsage} className="h-2" />
            <span className="text-sm font-medium">{apiUsage.toFixed(1)}%</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Monthly Articles</p>
          <p className="text-xl font-semibold">{articleCount}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last Sync: {lastSync || 'Never'}
        </p>
        <Badge variant="outline" className="text-xs">
          Limit: 2000/month
        </Badge>
      </div>
    </motion.div>
  );
};
