
import { useState } from 'react';
import { VideoGrid } from './video-library/VideoGrid';
import { LoadMore } from './video-library/LoadMore';
import { useVideos } from '@/hooks/useVideos';
import { Video } from './types';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  // [Analysis] Query for matching educators when searching
  const { data: matchingEducators, isLoading: educatorsLoading } = useQuery({
    queryKey: ['educators-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from('education_creators')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    enabled: !!searchQuery,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: videosLoading,
    error
  } = useVideos({
    selectedEducator,
    searchQuery: localSearchQuery,
    sortBy,
    filterBySeries
  });

  const isLoading = videosLoading || educatorsLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  
  console.log('[VideoLibrary] Current state:', {
    isLoading,
    videosCount: allVideos.length,
    hasNextPage,
    error: error ? (error as Error).message : null,
    searchQuery,
    matchingEducators: matchingEducators?.length
  });

  if (error) {
    console.error('[VideoLibrary] Error state:', error);
    return (
      <div className="p-8 text-center text-siso-text">
        <p>Failed to load videos. Please try refreshing the page.</p>
        <p className="text-sm text-siso-text/70">Error: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Show matching educators if searching */}
      {searchQuery && matchingEducators && matchingEducators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold text-siso-text-bold">
            Matching Educators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchingEducators.map((educator) => (
              <div
                key={educator.id}
                className="p-4 rounded-lg bg-siso-bg-alt border border-siso-border hover:border-siso-orange/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={educator.channel_avatar_url}
                    alt={educator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-white">{educator.name}</h3>
                    <p className="text-sm text-siso-text/70">
                      {educator.number_of_subscribers?.toLocaleString()} subscribers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <VideoGrid
        videos={allVideos}
        featuredVideos={[]} // We'll add featured videos later
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
