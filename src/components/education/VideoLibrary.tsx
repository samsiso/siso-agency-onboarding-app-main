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

  // [Analysis] Simplified query to debug data fetching
  // [Plan] Add proper error boundaries and loading states
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
      console.log('Starting video fetch with params:', { 
        pageParam, 
        selectedEducator, 
        searchQuery, 
        sortBy 
      });
      
      try {
        // First, let's check if we can get any videos at all
        const { data: countCheck, error: countError } = await supabase
          .from('youtube_videos')
          .select('id', { count: 'exact' });

        console.log('Count check result:', { count: countCheck?.length, error: countError });

        // Now attempt the main query
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

        if (selectedEducator) {
          query = query.eq('channel_id', selectedEducator);
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        console.log('Executing query...'); // Debug log
        const { data: videos, error: queryError } = await query;
        console.log('Query result:', { 
          videosCount: videos?.length, 
          firstVideo: videos?.[0],
          error: queryError 
        });

        if (queryError) {
          console.error('Error fetching videos:', queryError);
          throw queryError;
        }

        if (!videos || videos.length === 0) {
          console.log('No videos found for current query');
          return [];
        }

        // Transform the data to match the Video type
        const transformedVideos = (videos || []).map(video => {
          console.log('Transforming video:', video); // Debug individual video transformation
          return {
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
          } satisfies Video;
        });

        console.log('Transformed videos:', transformedVideos); // Debug final result
        return transformedVideos;
      } catch (error) {
        console.error('Error in query function:', error);
        toast.error('Failed to load videos');
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === ITEMS_PER_PAGE;
      console.log('Checking for next page:', { 
        lastPageSize: lastPage.length, 
        hasMore, 
        nextPage: hasMore ? allPages.length : undefined 
      });
      return hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Infinite scroll triggered, loading more videos...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = externalLoading || videosLoading;
  const allVideos = (data?.pages.flat() || []) as Video[];
  const featuredVideos = allVideos.slice(0, 3);

  console.log('VideoLibrary render state:', { 
    isLoading, 
    videosCount: allVideos.length,
    hasNextPage,
    isFetchingNextPage,
    error 
  });

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