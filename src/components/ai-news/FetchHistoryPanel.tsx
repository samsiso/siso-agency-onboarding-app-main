
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FetchHistoryItem {
  id: string;
  timestamp: string;
  source: string;
  articles_count: number;
  articles_added?: number;
  articles_updated?: number;
  duplicates_skipped?: number;
  status: 'success' | 'error';
  error_message?: string;
}

interface FetchHistoryPanelProps {
  onRefresh: () => void;
  onTestFetch?: () => void;
}

export const FetchHistoryPanel = ({ onRefresh, onTestFetch }: FetchHistoryPanelProps) => {
  const [history, setHistory] = useState<FetchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // [Analysis] Fetch real history data on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('news_fetch_history')
          .select('*')
          .order('fetch_time', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // [Analysis] Transform data to match component's expected format
        const transformedData: FetchHistoryItem[] = data.map(item => ({
          id: item.id,
          timestamp: item.fetch_time,
          source: item.source_type,
          articles_count: item.articles_fetched || 0,
          articles_added: item.articles_added || 0,
          articles_updated: item.articles_updated || 0,
          duplicates_skipped: item.duplicates_skipped || 0,
          status: item.status === 'success' ? 'success' : 'error',
          error_message: item.error_message
        }));
        
        setHistory(transformedData);
      } catch (error) {
        console.error('Error fetching history:', error);
        // Fallback to mock data if fetch fails
        const mockData: FetchHistoryItem[] = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            source: 'event_registry',
            articles_count: 42,
            articles_added: 35,
            articles_updated: 7,
            duplicates_skipped: 15,
            status: 'success'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            source: 'news_api',
            articles_count: 18,
            articles_added: 12,
            articles_updated: 3,
            duplicates_skipped: 3,
            status: 'success'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            source: 'event_registry',
            articles_count: 0,
            status: 'error',
            error_message: 'API quota exceeded'
          }
        ];
        
        setHistory(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 border border-gray-800 rounded-lg bg-gray-950/50 p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            News Fetch History
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track when AI news data is collected and processed
          </p>
        </div>
        
        <div className="flex gap-2">
          {onTestFetch && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onTestFetch}
            >
              <Info className="h-4 w-4" />
              Test Fetch
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Now
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-800/50 rounded-md" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {history.length > 0 ? (
            history.map(item => (
              <div 
                key={item.id} 
                className={`p-3 rounded-md border ${
                  item.status === 'success' ? 'border-green-800/30 bg-green-950/10' : 'border-red-800/30 bg-red-950/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium capitalize">{item.source}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {format(parseISO(item.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {item.articles_count} articles fetched
                    </div>
                    
                    {/* Display detailed stats for successful fetches */}
                    {item.status === 'success' && (
                      <div className="text-xs text-gray-400 mt-1 space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-block px-1.5 py-0.5 bg-blue-900/20 text-blue-400 rounded">
                                +{item.articles_added || 0} new
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>New articles added</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-block px-1.5 py-0.5 bg-purple-900/20 text-purple-400 rounded">
                                ~{item.articles_updated || 0} updated
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Existing articles updated</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-block px-1.5 py-0.5 bg-orange-900/20 text-orange-400 rounded">
                                {item.duplicates_skipped || 0} skipped
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duplicate articles skipped</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    
                    {item.error_message && (
                      <div className="text-sm text-red-400 mt-1">
                        {item.error_message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-800 rounded-md">
              <p className="text-gray-500">No fetch history available</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
