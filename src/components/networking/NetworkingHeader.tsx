
import { Search, Users, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useHotkeys } from 'react-hotkeys-hook';

interface NetworkingHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const NetworkingHeader = ({ searchQuery, setSearchQuery }: NetworkingHeaderProps) => {
  // [Analysis] Using React Query for real-time stats with automatic background updates
  const { data: stats } = useQuery({
    queryKey: ['networking-stats'],
    queryFn: async () => {
      const { data: categoryStats, error: categoryError } = await supabase
        .from('category_stats')
        .select('*');
      
      if (categoryError) throw categoryError;
      
      const totalCommunities = categoryStats.reduce((sum, stat) => sum + stat.community_count, 0);
      const totalMembers = categoryStats.reduce((sum, stat) => sum + stat.total_members, 0);
      
      return { totalCommunities, totalMembers };
    }
  });

  // [Analysis] Add keyboard shortcut for search focus
  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 mb-6"
    >
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-siso-red/5 via-siso-orange/5 to-transparent rounded-3xl"
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative z-10 space-y-4 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
              SISO Networking Hub
            </h1>
            
            {stats && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-siso-orange" />
                  <span className="text-siso-text-bold">
                    {stats.totalCommunities.toLocaleString()} Communities
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-siso-orange" />
                  <span className="text-siso-text-bold">
                    {stats.totalMembers.toLocaleString()} Members
                  </span>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="w-full relative">
            <motion.div
              initial={false}
              animate={{ 
                scale: searchQuery ? 0.98 : 1,
                boxShadow: searchQuery 
                  ? "0 0 0 2px rgba(255, 87, 34, 0.3)" 
                  : "0 0 0 0px rgba(255, 87, 34, 0)"
              }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Input
                type="text"
                placeholder="Search communities... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 py-3 bg-siso-text/5 border border-siso-text/10 rounded-lg 
                  focus:outline-none focus:border-siso-orange/50 text-siso-text pl-10 
                  transition-all duration-300 hover:bg-siso-text/10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
