
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

interface UseVideosProps {
  selectedEducator?: string;
  searchQuery?: string;
  sortBy?: string;
  filterBySeries?: boolean;
}

export const useVideos = ({ 
  selectedEducator,
  searchQuery,
  sortBy = 'recent',
  filterBySeries = false 
}: UseVideosProps) => {
  console.log('[useVideos] Hook called with params:', {
    selectedEducator,
    searchQuery,
    sortBy,
    filterBySeries
  });

  return useInfiniteQuery({
    queryKey: ['videos', selectedEducator, searchQuery, sortBy, filterBySeries],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('[useVideos] Starting video fetch with params:', { 
        pageParam, 
        selectedEducator, 
        searchQuery, 
        sortBy 
      });
      
      try {
        let query = supabase
          .from('youtube_videos')
          .select(`
            id,
            title,
            thumbnailUrl,
            duration,
            viewCount,
            date,
            education_creators (
              name,
              channel_avatar_url
            )
          `);

        if (selectedEducator) {
          query = query.eq('channel_id', selectedEducator);
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        query = query
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)
          .order('date', { ascending: false });

        console.log('[useVideos] Query parameters:', { 
          filters: {
            selectedEducator,
            searchQuery,
            pageStart: pageParam * ITEMS_PER_PAGE,
            pageEnd: (pageParam + 1) * ITEMS_PER_PAGE - 1
          }
        });

        const { data: videos, error: queryError } = await query;

        if (queryError) {
          console.error('[useVideos] Error fetching videos:', queryError);
          throw queryError;
        }

        if (!videos || videos.length === 0) {
          console.log('[useVideos] No videos found for current query');
          return [];
        }

        // Transform the data - now with more precise logging
        const transformedVideos = videos.map(video => {
          console.log('[useVideos] Transforming video:', { 
            id: video.id,
            title: video.title,
            date: video.date
          });

          return {
            id: video.id, // This is the YouTube video ID
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

        console.log('[useVideos] Transformed videos:', transformedVideos);
        return transformedVideos;
      } catch (error) {
        console.error('[useVideos] Error in query function:', error);
        toast.error('Failed to load videos');
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === ITEMS_PER_PAGE;
      console.log('[useVideos] Pagination check:', { 
        lastPageSize: lastPage.length, 
        hasMore, 
        currentPages: allPages.length,
        nextPage: hasMore ? allPages.length : undefined 
      });
      return hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });
};
