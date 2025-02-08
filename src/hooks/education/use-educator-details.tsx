
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEducatorDetails = (slug: string) => {
  return useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('[useEducatorDetails] Fetching educator details for slug:', slug);
      
      // [Analysis] Match both old and new slug formats for backward compatibility
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
          featured_videos,
          channel_id
        `)
        .eq('slug', slug)
        .single();
      
      if (educatorError) {
        console.error('[useEducatorDetails] Error fetching educator details:', educatorError);
        
        // [Analysis] If not found with exact slug, try finding by the old format
        if (slug.match(/-\d+$/)) {
          const baseSlug = slug.replace(/-\d+$/, '');
          const { data: oldFormatEducator, error: oldFormatError } = await supabase
            .from('education_creators')
            .select()
            .ilike('slug', `${baseSlug}-%`)
            .single();
            
          if (!oldFormatError && oldFormatEducator) {
            return oldFormatEducator;
          }
        }
        
        throw educatorError;
      }
      
      if (!educator) {
        throw new Error('Educator not found');
      }

      console.log('[useEducatorDetails] Found educator:', educator);
      
      return educator;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
