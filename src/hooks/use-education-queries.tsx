import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// [Analysis] Separate query hooks improve reusability and maintainability
// [Plan] Add error boundary wrapper for better error handling at 1000+ users

export const useEducatorsList = (page: number, searchQuery: string) => {
  // [Analysis] Only select fields we need, reducing payload size
  return useQuery({
    queryKey: ['educators', page, searchQuery],
    queryFn: async () => {
      console.log('Fetching educators for page:', page); // Debug log
      
      let query = supabase
        .from('education_creators')
        .select(`
          id,
          name,
          description,
          specialization,
          profile_image_url,
          channel_avatar_url,
          number_of_subscribers,
          channel_total_videos,
          slug
        `)
        .order('number_of_subscribers', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching educators:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    keepPreviousData: true, // Keep old data while fetching new data
  });
};

export const useEducatorDetails = (slug: string) => {
  return useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('Fetching educator details for slug:', slug); // Debug log
      
      const { data, error } = await supabase
        .from('education_creators')
        .select(`
          id,
          name,
          description,
          specialization,
          profile_image_url,
          channel_avatar_url,
          number_of_subscribers,
          channel_total_videos,
          channel_total_views,
          social_links,
          youtube_url,
          website_url
        `)
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching educator details:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useEducatorVideos = (educatorId: string | null, page = 1) => {
  return useQuery({
    queryKey: ['educator-videos', educatorId, page],
    queryFn: async () => {
      if (!educatorId) return [];
      
      console.log('Fetching videos for educator:', educatorId); // Debug log
      
      const { data, error } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          thumbnailUrl,
          duration,
          viewCount,
          date
        `)
        .eq('channel_id', educatorId)
        .order('date', { ascending: false })
        .range((page - 1) * 12, page * 12 - 1);
      
      if (error) {
        console.error('Error fetching educator videos:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!educatorId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    keepPreviousData: true,
  });
};