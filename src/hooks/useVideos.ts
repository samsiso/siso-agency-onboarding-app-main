
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
      console.log('[useVideos] Fetching page:', pageParam);
      
      try {
        // [Analysis] Use a single query with JOIN to get both video and creator data
        let query = supabase
          .from('youtube_videos')
          .select(`
            id,
            title,
            thumbnailUrl,
            duration,
            viewCount,
            published_timestamp,
            date,
            channel_id,
            education_creators!youtube_videos_channel_id_fkey (
              name,
              channel_avatar_url
            )
          `);

        // Log the SQL query being constructed
        console.log('[useVideos] Building query with params:', {
          offset: pageParam * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          selectedEducator,
          searchQuery
        });

        // Add filters
        if (selectedEducator) {
          query = query.eq('channel_id', selectedEducator);
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        // [Analysis] Order by published_timestamp first, fall back to date field if timestamp is null
        query = query
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)
          .order('published_timestamp', { ascending: false, nullsFirst: false })
          .order('date', { ascending: false, nullsFirst: false });

        const { data: videos, error: videosError } = await query;

        if (videosError) {
          console.error('[useVideos] Error fetching videos:', videosError);
          throw new Error(`Failed to fetch videos: ${videosError.message}`);
        }

        if (!videos) {
          console.log('[useVideos] No videos returned from query');
          return [];
        }

        // Transform the data with detailed logging
        const transformedVideos = videos.map(video => {
          // [Analysis] Get creator info from the joined data
          const creator = video.education_creators;
          
          return {
            id: video.id,
            title: video.title || '',
            url: `https://youtube.com/watch?v=${video.id}`,
            duration: video.duration || '0:00',
            thumbnail_url: video.thumbnailUrl || '',
            date: video.published_timestamp || video.date,
            educator: {
              name: creator?.name || 'Unnamed Creator', // Use actual creator name from join
              avatar_url: creator?.channel_avatar_url || ''
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

        console.log('[useVideos] Transformed videos count:', transformedVideos.length);
        return transformedVideos;
      } catch (error) {
        console.error('[useVideos] Critical error in query function:', error);
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === ITEMS_PER_PAGE;
      console.log('[useVideos] Pagination check:', { 
        lastPageSize: lastPage.length, 
        hasMore, 
        currentPages: allPages.length 
      });
      return hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });
};
