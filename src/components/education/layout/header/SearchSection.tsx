
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SkillLevelFilters } from './components/SkillLevelFilters';
import { SearchInput } from './components/SearchInput';
import { SearchResultsDropdown } from './components/SearchResultsDropdown';

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
      await (async () => {
        await refetchHistory();
      })();
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

      <div className="relative">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          onSubmit={handleSubmit}
          placeholders={searchPlaceholders}
        />

        <AnimatePresence>
          {isSearchFocused && (
            <SearchResultsDropdown
              isVisible={isSearchFocused}
              searchHistory={searchHistory}
              onHistoryCleared={async () => {
                await refetchHistory();
              }}
              featuredEducators={featuredEducators}
              educatorsLoading={educatorsLoading}
              recentVideos={recentVideos}
              videosLoading={videosLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
