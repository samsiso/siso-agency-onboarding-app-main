import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePagination } from '@/hooks/use-pagination';
import { VideoGrid } from './video-library/VideoGrid';
import { VideoPagination } from './video-library/VideoPagination';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Video } from './types';

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
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: videosLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['videos', selectedEducator, searchQuery, sortBy, filterBySeries],
    queryFn: async ({ pageParam = 0 }) => {
      // First get the videos
      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
        throw error;
      }

      // Then get the creator info for these videos
      const channelIds = videos?.map(video => video.channel_id).filter(Boolean) || [];
      const { data: creators } = await supabase
        .from('education_creators')
        .select('channel_id, name, channel_avatar_url')
        .in('channel_id', channelIds);

      // Create a map of channel_id to creator info
      const creatorMap = (creators || []).reduce((acc, creator) => {
        acc[creator.channel_id] = creator;
        return acc;
      }, {} as Record<string, any>);

      // Transform the video data
      return (videos || []).map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: creatorMap[video.channel_id]?.name || video.channel_id || 'Unknown Creator',
          avatar_url: creatorMap[video.channel_id]?.channel_avatar_url || ''
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
      } satisfies Video));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
          toast.error('Failed to load videos');
        }
      }
    }
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = externalLoading || videosLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  const featuredVideos = allVideos.slice(0, 3);

  if (error) {
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

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="w-full h-20 flex items-center justify-center"
        >
          {isFetchingNextPage ? (
            <div className="w-6 h-6 border-2 border-siso-red border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-siso-text/60">Scroll to load more</span>
          )}
        </div>
      )}
    </div>
  );
};