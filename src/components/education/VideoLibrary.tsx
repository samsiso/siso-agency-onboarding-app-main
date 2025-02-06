
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

  console.log('[VideoLibrary] Initial render with props:', {
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

  const isLoading = externalLoading || videosLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  const featuredVideos = allVideos.slice(0, 3);

  console.log('[VideoLibrary] Final render state:', { 
    isLoading, 
    videosCount: allVideos.length,
    hasNextPage,
    isFetchingNextPage,
    error,
    featuredVideosCount: featuredVideos.length
  });

  if (error) {
    console.error('[VideoLibrary] Render error:', error);
    return (
      <div className="p-8 text-center text-siso-text">
        <p>Failed to load videos. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VideoGrid
        videos={allVideos}
        featuredVideos={featuredVideos}
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
