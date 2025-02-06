
import { Search, Users, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NetworkingHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const NetworkingHeader = ({ searchQuery, setSearchQuery }: NetworkingHeaderProps) => {
  // [Analysis] Using React Query for real-time stats with automatic background updates
  const { data: stats } = useQuery({
    queryKey: ['networking-stats'],
    queryFn: async () => {
      const { data: communities, error } = await supabase
        .from('networking_resources')
        .select('member_count');
      
      if (error) throw error;
      
      const totalCommunities = communities.length;
      const totalMembers = communities.reduce((sum, community) => sum + (community.member_count || 0), 0);
      
      return { totalCommunities, totalMembers };
    }
  });

  const placeholders = [
    'Search communities...',
    'Find your next network...',
    'Discover connections...',
    'Join the conversation...'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6 mb-8"
    >
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-siso-red/10 via-siso-orange/5 to-transparent rounded-3xl"
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
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text flex items-center gap-2">
              SISO Networking Hub
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-siso-orange" />
              </motion.div>
            </h1>
            <p className="text-lg text-siso-text/80">
              Connect with the best communities and expand your network in the SISO ecosystem.
            </p>
            
            {stats && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 mt-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-siso-orange" />
                  <span className="text-siso-text-bold">
                    {stats.totalCommunities.toLocaleString()} Communities
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-siso-orange" />
                  <span className="text-siso-text-bold">
                    {stats.totalMembers.toLocaleString()} Members
                  </span>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="w-full md:w-auto relative">
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
                placeholder={placeholders[0]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[350px] px-4 py-3 bg-siso-text/5 border border-siso-text/10 rounded-lg 
                  focus:outline-none focus:border-siso-orange/50 text-siso-text pl-10 
                  transition-all duration-300 hover:bg-siso-text/10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="bg-siso-text/5 border border-siso-text/10 rounded-lg p-4 transition-all duration-300 group-hover:border-siso-orange/50">
            <Users className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <p className="text-siso-text/80 mt-2">
              <span className="font-semibold text-siso-text">Community Members:</span> Discover and connect with featured creators, educators, and community leaders.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="bg-siso-text/5 border border-siso-text/10 rounded-lg p-4 transition-all duration-300 group-hover:border-siso-orange/50">
            <Search className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <p className="text-siso-text/80 mt-2">
              <span className="font-semibold text-siso-text">Smart Search:</span> Find communities by name, category, or activity level with intelligent matching.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="bg-siso-text/5 border border-siso-text/10 rounded-lg p-4 transition-all duration-300 group-hover:border-siso-orange/50">
            <Globe className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <p className="text-siso-text/80 mt-2">
              <span className="font-semibold text-siso-text">Rich Insights:</span> View detailed analytics, engagement metrics, and growth trends for each community.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
