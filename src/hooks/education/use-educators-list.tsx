
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Educator } from './types';

interface EducatorPage {
  educators: Educator[];
  nextCursor: string | undefined;
}

// [Analysis] Convert to infinite query for better UX and performance
// [Plan] Add caching layer at 10k+ users
export const useEducatorsList = (searchQuery: string) => {
  return useInfiniteQuery<EducatorPage>({
    queryKey: ['educators', searchQuery],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
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
          channel_banner_url,
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

      // Transform the data to match Educator type
      const educators = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        specialization: item.specialization || [],
        profile_image_url: item.profile_image_url || '',
        channel_avatar_url: item.channel_avatar_url || '',
        channel_banner_url: item.channel_banner_url || '',
        number_of_subscribers: item.number_of_subscribers || 0,
        channel_total_videos: item.channel_total_videos || 0,
        channel_location: item.channel_location || '',
        slug: item.slug || '',
        featured_videos: Array.isArray(item.featured_videos) ? item.featured_videos : [],
        is_featured: item.is_featured || false,
        member_count: item.member_count || 0
      }));
      
      return {
        educators,
        nextCursor: data?.length === 12 ? data[data.length - 1].id : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
