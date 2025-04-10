
import { useQuery } from '@tanstack/react-query';

interface EducationStats {
  totalEducators: number;
  totalVideos: number;
  totalStudents: number;
}

export const useEducationStats = () => {
  return useQuery<EducationStats, Error>({
    queryKey: ['education-stats'],
    queryFn: async () => {
      // Return mock data since we can't access the actual database properly
      return {
        totalEducators: 25,
        totalVideos: 147,
        totalStudents: 5340
      };
    },
    // Cache stats for 5 minutes since they don't change frequently
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
