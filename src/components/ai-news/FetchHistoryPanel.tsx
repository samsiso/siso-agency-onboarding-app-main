
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FetchHistoryItem {
  id: string;
  timestamp: string;
  source: string;
  articles_count: number;
  status: 'success' | 'error';
  error_message?: string;
}

interface FetchHistoryPanelProps {
  onRefresh: () => void;
}

export const FetchHistoryPanel = ({ onRefresh }: FetchHistoryPanelProps) => {
  const [history, setHistory] = useState<FetchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // [Analysis] Fetch history data on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        
        // [Plan] In a production environment, we would fetch from a real table
        // but for this prototype we'll simulate data
        
        // Simulated fetch data - in a real implementation, this would come from Supabase
        const mockData: FetchHistoryItem[] = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            source: 'event_registry',
            articles_count: 42,
            status: 'success'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            source: 'news_api',
            articles_count: 18,
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
      } catch (error) {
        console.error('Error fetching history:', error);
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
      
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-800/50 rounded-md" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(item => (
            <div 
              key={item.id} 
              className={`p-3 rounded-md flex justify-between items-center border ${
                item.status === 'success' ? 'border-green-800/30 bg-green-950/10' : 'border-red-800/30 bg-red-950/10'
              }`}
            >
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
                  {item.articles_count} articles
                </div>
                {item.error_message && (
                  <div className="text-sm text-red-400">
                    {item.error_message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
