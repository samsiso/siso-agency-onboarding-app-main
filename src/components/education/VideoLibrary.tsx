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

  // [Analysis] Using join to get educator details with videos
  // [Plan] Add caching layer when video count exceeds 1000
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['video-library', currentPage, selectedEducator, searchQuery, sortBy, filterBySeries],
    queryFn: async () => {
      console.log('Fetching videos for educator:', selectedEducator);
      
      // First get the educator details to get both ID and channel_id
      const { data: educator } = await supabase
        .from('education_creators')
        .select('id, channel_id')
        .eq('id', selectedEducator)
        .maybeSingle();

      console.log('Found educator:', educator);

      if (!educator) {
        console.log('No educator found with ID:', selectedEducator);
        toast.error('Educator not found');
        return [];
      }

      let query = supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          duration,
          thumbnailUrl,
          viewCount,
          date,
          educator:education_creators(
            name,
            channel_avatar_url
          )
        `);

      // Query videos using both educator_id and channel_id
      if (educator.id && educator.channel_id) {
        query = query.or(`educator_id.eq.${educator.id},channel_id.eq.${educator.channel_id}`);
      } else if (educator.id) {
        query = query.eq('educator_id', educator.id);
      } else if (educator.channel_id) {
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

      // Filter by series if needed
      if (filterBySeries) {
        query = query.not('series_id', 'is', null);
      }

      const { data: videos, error } = await query;
      
      if (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
        throw error;
      }

      console.log('Found videos:', videos?.length || 0);
      
      return videos?.map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.educator?.name || 'Unknown Creator',
          avatar_url: video.educator?.channel_avatar_url || ''
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
    enabled: !!selectedEducator,
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