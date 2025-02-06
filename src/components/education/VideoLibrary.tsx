import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoGrid } from './video-library/VideoGrid';
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

  // [Analysis] Simplified query structure for better performance
  // [Plan] Add Redis caching layer at 10k+ daily active users
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
      console.log('Fetching videos with params:', { 
        pageParam, 
        selectedEducator, 
        searchQuery, 
        sortBy 
      });
      
      let query = supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          thumbnailUrl,
          duration,
          viewCount,
          date,
          channel_id,
          education_creators (
            name,
            channel_avatar_url
          )
        `)
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)
        .order('date', { ascending: false });

      // Add filters if provided
      if (selectedEducator) {
        query = query.eq('channel_id', selectedEducator);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data: videos, error } = await query;

      if (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
        throw error;
      }

      console.log('Fetched videos:', videos);

      // Transform the data to match the Video type
      return (videos || []).map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.education_creators?.name || 'Unknown Creator',
          avatar_url: video.education_creators?.channel_avatar_url || ''
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
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
      console.log('Loading more videos...');
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