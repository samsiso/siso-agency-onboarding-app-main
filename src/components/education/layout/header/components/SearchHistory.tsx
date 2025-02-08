
import { Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SearchHistoryProps {
  history: Array<{
    id: string;
    query: string;
    created_at: string;
    result_type: string;  // Accept any string from DB
  }>;
  onHistoryCleared: () => Promise<void>;
}

export const SearchHistory = ({ history, onHistoryCleared }: SearchHistoryProps) => {
  const clearSearchHistory = async (id: string) => {
    try {
      await supabase
        .from('user_search_history')
        .delete()
        .eq('id', id);
      await onHistoryCleared();
      toast.success('Search history item removed');
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error('Failed to clear search history');
    }
  };

  // Filter valid result types and map the data
  const validHistory = history.filter(item => 
    ['video', 'path', 'educator'].includes(item.result_type)
  );

  if (!validHistory || validHistory.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/80">Recent Searches</h3>
      <div className="space-y-2">
        {validHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-siso-text/60" />
              <span className="text-sm text-siso-text/80">{item.query}</span>
            </div>
            <button
              onClick={() => clearSearchHistory(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-siso-text/60 hover:text-siso-red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
