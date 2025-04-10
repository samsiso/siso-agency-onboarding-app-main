
import { useQuery } from '@tanstack/react-query';
import { safeSupabase } from '@/utils/supabaseHelpers';

export const useEducatorDetails = (slug: string) => {
  return useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('[useEducatorDetails] Fetching educator details for slug:', slug);
      
      // [Analysis] Try exact match first
      const { data: educator, error: exactMatchError } = await safeSupabase
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
          channel_id,
          slug
        `)
        .eq('slug', slug)
        .maybeSingle();

      // If exact match found, return it
      if (educator) {
        console.log('[useEducatorDetails] Found educator with exact match:', educator);
        return educator;
      }

      // [Analysis] If not found, try finding by name part of the slug
      const baseName = slug.split('-')[0]; // Get first part of the slug
      console.log('[useEducatorDetails] Trying to find by base name:', baseName);
      
      const { data: fuzzyMatchEducator, error: fuzzyMatchError } = await safeSupabase
        .from('education_creators')
        .select()
        .ilike('slug', `${baseName}%`)
        .maybeSingle();

      if (fuzzyMatchError) {
        console.error('[useEducatorDetails] Error in fuzzy match:', fuzzyMatchError);
        throw fuzzyMatchError;
      }

      if (!fuzzyMatchEducator) {
        console.error('[useEducatorDetails] No educator found for slug:', slug);
        throw new Error('Educator not found');
      }

      console.log('[useEducatorDetails] Found educator with fuzzy match:', fuzzyMatchEducator);
      return fuzzyMatchEducator;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
