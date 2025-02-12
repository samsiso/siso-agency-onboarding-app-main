import { Clock, X, Search, ChevronRight, History } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface SearchHistoryProps {
  history: Array<{
    id: string;
    query: string;
    created_at: string;
    result_type: string;
  }>;
  onHistoryCleared: () => Promise<void>;
  onSearchSelect?: (query: string) => void;
}

export const SearchHistory = ({ 
  history, 
  onHistoryCleared,
  onSearchSelect 
}: SearchHistoryProps) => {
  // [Analysis] Early return with better empty state
  if (!history || history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center space-y-3 bg-gradient-to-br from-white/5 to-transparent rounded-xl"
      >
        <History className="w-12 h-12 mx-auto text-siso-text/30" />
        <div className="space-y-1">
          <p className="text-lg font-medium text-siso-text/80">No recent searches</p>
          <p className="text-sm text-siso-text/50">
            Your search history will appear here
          </p>
        </div>
      </motion.div>
    );
  }

  const clearSearchHistory = async (id: string) => {
    try {
      await supabase
        .from('user_search_history')
        .delete()
        .eq('id', id);
      await onHistoryCleared();
      toast.success('Search removed from history');
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error('Failed to clear search history');
    }
  };

  // [Analysis] Group history items by date with better formatting
  const groupedHistory = history.reduce((groups: any, item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {Object.entries(groupedHistory).map(([date, items]: [string, any]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-siso-text/60 px-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-siso-orange/50" />
            {date}
          </h3>
          <div className="space-y-1">
            {items.map((item: any) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex items-center justify-between group px-3 py-2 rounded-lg 
                  hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent
                  cursor-pointer backdrop-blur-sm"
                onClick={() => onSearchSelect?.(item.query)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
                    flex items-center justify-center group-hover:from-siso-red/20 group-hover:to-siso-orange/20 
                    transition-colors duration-300">
                    <Clock className="w-4 h-4 text-siso-text/60 group-hover:text-siso-orange transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-siso-text/80 group-hover:text-white transition-colors block truncate">
                      {item.query}
                    </span>
                    <span className="text-xs text-siso-text/40">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearchHistory(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5
                      hover:bg-white/5 rounded-full focus:opacity-100 focus:outline-none"
                  >
                    <X className="w-4 h-4 text-siso-text/60 hover:text-siso-red transition-colors" />
                  </button>
                  
                  <ChevronRight className="w-4 h-4 text-siso-text/40 
                    group-hover:text-siso-orange group-hover:translate-x-1
                    transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
