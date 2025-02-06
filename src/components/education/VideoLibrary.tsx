
import { useState } from 'react';
import { VideoGrid } from './video-library/VideoGrid';
import { LoadMore } from './video-library/LoadMore';
import { useVideos } from '@/hooks/useVideos';
import { Video } from './types';

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
  searchQuery: initialSearchQuery = '',
  sortBy = 'recent',
  filterBySeries = false
}: VideoLibraryProps) => {
  const [searchQuery] = useState(initialSearchQuery);

  console.log('[VideoLibrary] Rendering with props:', {
    selectedEducator,
    viewMode,
    searchQuery,
    sortBy,
    filterBySeries
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
    searchQuery,
    sortBy,
    filterBySeries
  });

  // Only consider loading if both external and videos are loading
  const isLoading = videosLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  
  console.log('[VideoLibrary] Current state:', {
    isLoading,
    videosCount: allVideos.length,
    hasNextPage,
    error: error ? (error as Error).message : null
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
