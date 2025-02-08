
import { useState } from 'react';
import { VideoGrid } from './video-library/VideoGrid';
import { LoadMore } from './video-library/LoadMore';
import { useVideos } from '@/hooks/useVideos';
import { Video } from './types';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SearchHistory } from './layout/header/components/SearchHistory';
import { FeaturedEducators } from './layout/header/components/FeaturedEducators';
import { PopularVideos } from './layout/header/components/PopularVideos';

interface VideoLibraryProps {
  isLoading?: boolean;
  selectedEducator?: string;
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
  sortBy?: string;
  filterBySeries?: boolean;
}

export const VideoLibrary = ({ 
  isLoading: externalLoading, 
  selectedEducator,
  viewMode = 'grid',
  searchQuery = '',
  sortBy = 'recent',
  filterBySeries = false
}: VideoLibraryProps) => {
  const [localSearchQuery] = useState(searchQuery);
  const isSearchActive = !!searchQuery;

  // [Analysis] Query for search history when searching
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
    enabled: isSearchActive,
  });

  // [Analysis] Query for featured educators during search
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
    enabled: isSearchActive,
  });

  // [Analysis] Query for recent/matching videos during search
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
    enabled: isSearchActive,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: mainVideosLoading,
    error
  } = useVideos({
    selectedEducator,
    searchQuery: localSearchQuery,
    sortBy,
    filterBySeries
  });

  const isLoading = mainVideosLoading || educatorsLoading || videosLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  
  if (error) {
    console.error('[VideoLibrary] Error state:', error);
    return (
      <div className="p-8 text-center text-siso-text">
        <p>Failed to load videos. Please try refreshing the page.</p>
        <p className="text-sm text-siso-text/70">Error: {(error as Error).message}</p>
      </div>
    );
  }

  // [Analysis] Render search results when search is active
  if (isSearchActive) {
    return (
      <div className="space-y-8">
        <div className="text-siso-text">
          <h2 className="text-xl font-semibold mb-2">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-sm text-siso-text/70">
            Found {recentVideos?.length || 0} videos and {featuredEducators?.length || 0} educators
          </p>
        </div>

        {searchHistory && (
          <SearchHistory
            history={searchHistory}
            onHistoryCleared={async () => {
              await refetchHistory();
            }}
          />
        )}

        {featuredEducators && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">Featured Educators</h3>
            <FeaturedEducators
              educators={featuredEducators}
              isLoading={educatorsLoading}
            />
          </div>
        )}

        {recentVideos && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">Matching Videos</h3>
            <PopularVideos
              videos={recentVideos}
              isLoading={videosLoading}
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90">Popular Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { path: "Python → Data Science → AI", color: "#FF5722" },
              { path: "React → Full Stack → Cloud", color: "#FF7043" },
              { path: "UI/UX → Web Design → Dev", color: "#FFA726" },
              { path: "Data Analysis → Statistics → ML", color: "#FF9100" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer group transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-base text-white/80 group-hover:text-white transition-colors">
                  {item.path}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // [Analysis] Regular video library view when not searching
  return (
    <div className="space-y-8">
      <VideoGrid
        videos={allVideos}
        featuredVideos={[]}
        isLoading={isLoading}
      />

      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
