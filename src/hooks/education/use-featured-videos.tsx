
import { useQuery } from '@tanstack/react-query';

export const useFeaturedVideos = () => {
  return useQuery({
    queryKey: ['featured-videos'],
    queryFn: async () => {
      // Mock implementation
      return [];
    },
  });
};
