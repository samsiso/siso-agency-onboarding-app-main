
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EducationStats {
  totalEducators: number;
  totalVideos: number;
  totalStudents: number;
}

export const useEducationStats = () => {
  return useQuery<EducationStats, Error>({
    queryKey: ['education-stats'],
    queryFn: async () => {
      // [Analysis] Using parallel requests for better performance
      const [educatorsResult, videosResult, subscribersResult] = await Promise.all([
        supabase
          .from('education_creators')
          .select('count', { count: 'exact', head: true }),
        
        supabase
          .from('youtube_videos')
          .select('count', { count: 'exact', head: true }),
        
        supabase
          .from('education_creators')
          .select('number_of_subscribers')
      ]);

      if (educatorsResult.error) throw educatorsResult.error;
      if (videosResult.error) throw videosResult.error;
      if (subscribersResult.error) throw subscribersResult.error;

      const totalStudents = subscribersResult.data.reduce(
        (sum, creator) => sum + (creator.number_of_subscribers || 0), 
        0
      );

      return {
        totalEducators: educatorsResult.count || 0,
        totalVideos: videosResult.count || 0,
        totalStudents
      };
    },
    // [Plan] Cache stats for 5 minutes since they don't change frequently
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
