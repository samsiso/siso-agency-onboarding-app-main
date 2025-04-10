
import { useQuery } from '@tanstack/react-query';
import { safeSupabase } from '@/utils/supabaseHelpers';

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export const useVideoCategories = () => {
  return useQuery({
    queryKey: ['video-categories'],
    queryFn: async () => {
      console.log('[useVideoCategories] Fetching categories');
      
      const { data: categories, error } = await safeSupabase
        .from('video_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('[useVideoCategories] Error:', error);
        throw error;
      }

      return categories as VideoCategory[];
    }
  });
};
