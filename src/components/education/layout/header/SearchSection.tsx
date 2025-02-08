
import { Search, Command, Mic, Clock, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

interface SearchHistory {
  id: string;
  query: string;
  created_at: string;
  result_type: 'video' | 'educator' | 'path';
}

interface SearchEducator {
  id: string;
  name: string;
  channel_avatar_url: string;
  number_of_subscribers: number;
  specialization: string[];
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // [Analysis] Add search history tracking and educator preview fetching
  const { data: searchHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as SearchHistory[];
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
      return data as SearchEducator[];
    },
    enabled: isSearchFocused,
  });

  // [Analysis] Add video preview fetching with search query
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

  const skillLevels = [
    { label: 'Beginner', color: '#FF5722' },
    { label: 'Intermediate', color: '#FF7043' },
    { label: 'Advanced', color: '#FFA726' }
  ];

  const categories = ['AI', 'Machine Learning', 'Web3', 'Cloud'];

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
      toast.error('Failed to save search history');
    }
  };

  const clearSearchHistory = async (id: string) => {
    try {
      await supabase
        .from('user_search_history')
        .delete()
        .eq('id', id);
      await refetchHistory();
      toast.success('Search history item removed');
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error('Failed to clear search history');
    }
  };

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Categories */}
      <motion.div 
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {categories.map((category, i) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white'
                : 'bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-siso-text hover:from-siso-red/20 hover:to-siso-orange/20'
            }`}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Skill Levels */}
      <motion.div 
        className="flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {skillLevels.map((level) => (
          <Button
            key={level.label}
            variant="outline"
            size="sm"
            className={`rounded-full border-2 transition-all duration-300 ${
              selectedSkillLevel === level.label
                ? 'bg-white/10'
                : 'bg-transparent hover:bg-white/5'
            }`}
            style={{
              borderColor: selectedSkillLevel === level.label ? level.color : 'transparent',
              color: selectedSkillLevel === level.label ? level.color : 'inherit'
            }}
            onClick={() => setSelectedSkillLevel(level.label === selectedSkillLevel ? null : level.label)}
          >
            {level.label}
          </Button>
        ))}
      </motion.div>

      {/* Search Input */}
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

        {/* Enhanced Search Dropdown */}
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
                  {/* Recent Searches */}
                  {searchHistory && searchHistory.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-white/80">Recent Searches</h3>
                      <div className="space-y-2">
                        {searchHistory.map((item) => (
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
                  )}

                  {/* Featured Educators */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Featured Educators</h3>
                    {educatorsLoading ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                          <Skeleton key={i} className="h-24 rounded-lg bg-white/5" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {featuredEducators?.map((educator) => (
                          <motion.div
                            key={educator.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Avatar
                              src={educator.channel_avatar_url}
                              fallback={educator.name[0]}
                              className="w-12 h-12 border-2 border-siso-orange/20"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{educator.name}</h4>
                              <p className="text-xs text-siso-text/60">
                                {formatNumber(educator.number_of_subscribers)} subscribers
                              </p>
                              {educator.specialization && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {educator.specialization.slice(0, 2).map((spec) => (
                                    <span
                                      key={spec}
                                      className="px-1.5 py-0.5 text-[10px] rounded-full bg-siso-orange/10 text-siso-orange"
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-siso-text/40 group-hover:text-siso-orange transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Videos */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Popular Videos</h3>
                    {videosLoading ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                          <Skeleton key={i} className="h-32 rounded-lg bg-white/5" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {recentVideos?.map((video: any) => (
                          <motion.div
                            key={video.id}
                            className="group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-24 object-cover"
                              />
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-xs text-white">
                                {video.duration}
                              </div>
                            </div>
                            <div className="mt-2 space-y-1">
                              <h4 className="text-sm font-medium text-white line-clamp-2">{video.title}</h4>
                              <div className="flex items-center gap-2">
                                <Avatar
                                  src={video.education_creators.channel_avatar_url}
                                  fallback={video.education_creators.name[0]}
                                  className="w-5 h-5"
                                />
                                <span className="text-xs text-siso-text/60">
                                  {video.education_creators.name}
                                </span>
                              </div>
                              <p className="text-xs text-siso-text/60">
                                {formatNumber(video.viewCount)} views
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Learning Paths */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white/80">Popular Learning Paths</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { path: "AI Fundamentals → ML Basics → Deep Learning", color: "#FF5722" },
                        { path: "Web Dev → React → Full Stack", color: "#FF7043" },
                        { path: "Python → Data Science → AI", color: "#FFA726" },
                        { path: "Blockchain → Smart Contracts → DApps", color: "#FF9100" },
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

