
import { Search, Command, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { SkillLevelFilters } from './components/SkillLevelFilters';
import { SearchHistory } from './components/SearchHistory';
import { FeaturedEducators } from './components/FeaturedEducators';
import { PopularVideos } from './components/PopularVideos';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);

  const { data: searchHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: isSearchFocused,
  });

  const { data: featuredEducators, isLoading: educatorsLoading } = useQuery({
    queryKey: ['featured-educators', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('education_creators')
        .select('id, name, channel_avatar_url, number_of_subscribers, specialization')
        .limit(4);

      if (searchQuery) {
        query.ilike('name', `%${searchQuery}%`);
      } else {
        query.eq('is_featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isSearchFocused,
  });

  const { data: recentVideos, isLoading: videosLoading } = useQuery({
    queryKey: ['recent-videos', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          thumbnailUrl,
          duration,
          viewCount,
          channel_id,
          education_creators!inner(name, channel_avatar_url)
        `)
        .limit(6);

      if (searchQuery) {
        query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isSearchFocused,
  });

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const searchPlaceholders = [
    "Search for AI implementation tutorials...",
    "Find courses on automation...",
    "Discover educators specializing in AI...",
    "Learn about AI tools and platforms..."
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      await supabase.from('user_search_history').insert({
        query: searchQuery,
        result_type: 'path'
      });
      await refetchHistory();
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <SkillLevelFilters
        selectedSkillLevel={selectedSkillLevel}
        onSkillLevelChange={setSelectedSkillLevel}
      />

      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          onSubmit={handleSubmit}
          className="w-full h-14 pl-12 pr-24 bg-black/20 backdrop-blur-sm
            border border-[#FF5722]/20 rounded-xl text-lg text-siso-text-bold placeholder-siso-text/60
            focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722]/40
            hover:bg-black/30 hover:border-[#FF5722]/30
            transition-all duration-300"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF5722]/70 
          group-hover:text-[#FF5722] transition-colors" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text/70">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-[#FF5722]/20 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-siso-text/80">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
          <Mic className="w-5 h-5 cursor-pointer hover:text-[#FF5722] transition-colors" />
        </div>

        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute mt-2 w-full bg-black/90 border border-[#FF5722]/20 rounded-xl backdrop-blur-sm"
            >
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-6">
                  {searchHistory && (
                    <SearchHistory
                      history={searchHistory}
                      onHistoryCleared={refetchHistory}
                    />
                  )}

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Featured Educators</h3>
                    <FeaturedEducators
                      educators={featuredEducators}
                      isLoading={educatorsLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Popular Videos</h3>
                    <PopularVideos
                      videos={recentVideos}
                      isLoading={videosLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Popular Learning Paths</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { path: "Python → Data Science → AI", color: "#FF5722" },
                        { path: "React → Full Stack → Cloud", color: "#FF7043" },
                        { path: "UI/UX → Web Design → Dev", color: "#FFA726" },
                        { path: "Data Analysis → Statistics → ML", color: "#FF9100" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                            {item.path}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
