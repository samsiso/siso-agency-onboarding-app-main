
import { Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { safeSupabase } from '@/utils/supabaseHelpers';

interface SearchHistoryProps {
  history: {
    id: string;
    query: string;
    created_at: string;
    result_type: string;
  }[];
  onHistoryCleared: () => Promise<void>;
  onSearchSelect: (query: string) => void;
}

export function SearchHistory({ 
  history, 
  onHistoryCleared, 
  onSearchSelect 
}: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-siso-text/50">
        <Clock className="mb-2 h-8 w-8" />
        <p className="text-sm">No recent searches</p>
      </div>
    );
  }

  const handleClearHistory = async () => {
    try {
      const { data: { user } } = await safeSupabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }
      
      const { error } = await safeSupabase
        .from('user_search_history')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error clearing search history:', error);
        return;
      }
      
      await onHistoryCleared();
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[200px] overflow-y-auto pr-3">
        <div className="space-y-2">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearchSelect(item.query)}
              className="flex items-center justify-between w-full p-2 rounded-md hover:bg-siso-text/10 
                text-left transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-siso-text/60" />
                <span className="text-sm text-siso-text truncate max-w-[200px]">{item.query}</span>
              </div>
              <span className="text-xs text-siso-text/40 group-hover:opacity-100 opacity-50">
                {formatDate(item.created_at)}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="text-xs text-siso-text/60 hover:text-siso-text hover:bg-transparent"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear History
        </Button>
      </div>
    </div>
  );
}
