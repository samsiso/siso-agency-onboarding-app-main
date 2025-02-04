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
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEducatorDetails = (slug: string) => {
  return useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('Fetching educator details for slug:', slug);
      
      // [Analysis] Split the query into two parts to reduce initial payload
      // First fetch educator details without videos
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
          website_url
        `)
        .eq('slug', slug)
        .maybeSingle();
      
      if (educatorError) {
        console.error('Error fetching educator details:', educatorError);
        throw educatorError;
      }
      
      if (!educator) {
        throw new Error('Educator not found');
      }

      // [Analysis] Only fetch first 12 most recent videos initially
      const { data: videos, error: videosError } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          thumbnailUrl,
          date,
          duration,
          viewCount
        `)
        .eq('channel_id', educator.name)
        .order('date', { ascending: false })
        .limit(12);
      
      if (videosError) {
        console.error('Error fetching educator videos:', videosError);
        throw videosError;
      }

      console.log('Raw educator data:', { educator, videos }); // Debug log
      
      return {
        ...educator,
        youtube_videos: videos || []
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    gcTime: 10 * 60 * 1000,
  });
};