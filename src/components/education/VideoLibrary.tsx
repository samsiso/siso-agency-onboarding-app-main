import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePagination } from '@/hooks/use-pagination';
import { VideoGrid } from './video-library/VideoGrid';
import { VideoFilters } from './video-library/VideoFilters';
import { VideoPagination } from './video-library/VideoPagination';

interface VideoLibraryProps {
  isLoading?: boolean;
  selectedEducator?: string;
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
  sortBy?: string;
  filterBySeries?: boolean;
}

const ITEMS_PER_PAGE = 12;

export const VideoLibrary = ({ 
  isLoading: externalLoading, 
  selectedEducator,
  viewMode = 'grid',
  searchQuery: initialSearchQuery = '',
  sortBy = 'recent',
  filterBySeries = false
}: VideoLibraryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['video-library', currentPage, selectedEducator, searchQuery, sortBy, filterBySeries],
    queryFn: async () => {
      let query = supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          duration,
          thumbnailUrl,
          viewCount,
          channel_id
        `);

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('viewCount', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default: // recent
          query = query.order('created_at', { ascending: false });
      }

      if (selectedEducator) {
        query = query.eq('channel_id', selectedEducator);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Filter by series if needed
      if (filterBySeries) {
        query = query.not('series_id', 'is', null);
      }

      const { data: videos, error } = await query;
      
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      
      return videos?.map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.channel_id || 'Unknown Creator',
          avatar_url: '' 
        },
        metrics: {
          views: video.viewCount || 0,
          likes: 0,
          sentiment_score: 0.8,
          difficulty: "Intermediate" as const,
          impact_score: 8.5
        },
        topics: [],
        ai_analysis: {
          key_takeaways: ['Coming soon...'],
          implementation_steps: ['Coming soon...']
        }
      })) || [];
    },
  });

  const isLoading = externalLoading || videosLoading;
  const featuredVideos = videos?.slice(0, 3) || [];
  const totalVideos = videos?.length || 0;
  const totalPages = Math.ceil(totalVideos / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVideos = videos?.slice(startIndex, endIndex) || [];

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 7,
  });

  return (
    <div className="space-y-8">
      <VideoFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <VideoGrid
        videos={currentVideos}
        featuredVideos={featuredVideos}
        isLoading={isLoading}
      />

      <VideoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pages={pages}
        showLeftEllipsis={showLeftEllipsis}
        showRightEllipsis={showRightEllipsis}
      />
    </div>
  );
};