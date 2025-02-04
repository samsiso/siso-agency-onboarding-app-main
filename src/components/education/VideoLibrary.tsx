import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePagination } from '@/hooks/use-pagination';
import { VideoGrid } from './video-library/VideoGrid';
import { VideoPagination } from './video-library/VideoPagination';
import { toast } from 'sonner';

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

  // First fetch educator details to get channel_id
  const { data: educator, isLoading: educatorLoading } = useQuery({
    queryKey: ['educator-details', selectedEducator],
    queryFn: async () => {
      if (!selectedEducator) return null;

      const { data, error } = await supabase
        .from('education_creators')
        .select('id, channel_id, name, channel_avatar_url')
        .eq('id', selectedEducator)
        .maybeSingle();

      if (error) {
        console.error('Error fetching educator:', error);
        toast.error('Failed to fetch educator details');
        throw error;
      }

      console.log('Fetched educator:', data); // Debug log
      return data;
    },
    enabled: !!selectedEducator,
  });

  // Then fetch videos using channel_id
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['videos', educator?.channel_id, currentPage, searchQuery, sortBy, filterBySeries],
    queryFn: async () => {
      let query = supabase
        .from('youtube_videos')
        .select('*');

      // Only filter by channel_id if we have an educator
      if (educator?.channel_id) {
        query = query.eq('channel_id', educator.channel_id);
      }

      // Apply search filter if query exists
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('viewCount', { ascending: false });
          break;
        case 'oldest':
          query = query.order('date', { ascending: true });
          break;
        default: // recent
          query = query.order('date', { ascending: false });
      }

      const { data: videoData, error } = await query;

      if (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
        throw error;
      }

      console.log('Found videos:', videoData?.length || 0); // Debug log

      return videoData?.map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: educator?.name || 'Unknown Creator',
          avatar_url: educator?.channel_avatar_url || ''
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
    enabled: true, // Changed to always fetch videos, even without an educator
  });

  const isLoading = externalLoading || educatorLoading || videosLoading;
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
      <VideoGrid
        videos={currentVideos}
        featuredVideos={featuredVideos}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <VideoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pages={pages}
          showLeftEllipsis={showLeftEllipsis}
          showRightEllipsis={showRightEllipsis}
        />
      )}
    </div>
  );
};