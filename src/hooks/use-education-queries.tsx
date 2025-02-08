import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';

// [Analysis] Convert to infinite query for better UX and performance
// [Plan] Add caching layer at 10k+ users
export const useEducatorsList = (searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ['educators', searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching educators for cursor:', pageParam); // Debug log
      
      let query = supabase
        .from('education_creators')
        .select(`
          id,
          name,
          description,
          specialization,
          profile_image_url,
          channel_avatar_url,
          youtube_avatar_url,
          youtube_banner_url,
          number_of_subscribers,
          channel_total_videos,
          channel_location,
          slug,
          featured_videos,
          is_featured,
          member_count
        `)
        .order('number_of_subscribers', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // [Analysis] Use cursor-based pagination for better performance
      if (pageParam) {
        query = query.lt('id', pageParam);
      }

      query = query.limit(12);

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching educators:', error);
        throw error;
      }
      
      return {
        educators: data || [],
        nextCursor: data?.length === 12 ? data[data.length - 1].id : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEducatorDetails = (slug: string) => {
  return useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('Fetching educator details for slug:', slug);
      
      const { data: educator, error: educatorError } = await supabase
        .from('education_creators')
        .select(`
          id,
          name,
          description,
          channel_description,
          channel_avatar_url,
          channel_banner_url,
          profile_image_url,
          number_of_subscribers,
          channel_total_videos,
          channel_total_views,
          channel_location,
          channel_joined_date,
          social_links,
          youtube_url,
          website_url,
          featured_videos
        `)
        .eq('slug', slug)
        .single();
      
      if (educatorError) {
        console.error('Error fetching educator details:', educatorError);
        throw educatorError;
      }
      
      if (!educator) {
        throw new Error('Educator not found');
      }

      console.log('Found educator with featured videos:', educator); // Debug log
      
      return educator;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEducatorVideos = (educatorId: string | null, page = 1) => {
  return useQuery({
    queryKey: ['educator-videos', educatorId, page],
    queryFn: async () => {
      if (!educatorId) return [];
      
      console.log('Fetching videos for educator:', educatorId); // Debug log
      
      const { data: educator } = await supabase
        .from('education_creators')
        .select('featured_videos')
        .eq('id', educatorId)
        .single();

      console.log('Educator data:', educator); // Debug log

      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          thumbnailUrl,
          duration,
          viewCount,
          date,
          channel_id
        `)
        .eq('channel_id', educatorId)
        .order('date', { ascending: false })
        .range((page - 1) * 12, page * 12 - 1);
      
      if (error) {
        console.error('Error fetching educator videos:', error);
        throw error;
      }

      // Transform the data to match the Video type
      const transformedVideos: Video[] = videos.map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        duration: video.duration,
        thumbnail_url: video.thumbnailUrl,
        educator: {
          name: '', // Will be filled by parent component
          avatar_url: ''
        },
        metrics: {
          views: video.viewCount,
          likes: 0,
          sentiment_score: 0,
          difficulty: 'Beginner',
          impact_score: 0
        },
        topics: [],
        ai_analysis: {
          key_takeaways: [],
          implementation_steps: []
        }
      }));
      
      console.log('Transformed videos:', transformedVideos); // Debug log
      
      return transformedVideos;
    },
    enabled: !!educatorId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    gcTime: 10 * 60 * 1000,
  });
};
