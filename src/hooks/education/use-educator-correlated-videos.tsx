
import { useQuery } from '@tanstack/react-query';

export const useEducatorCorrelatedVideos = (channelId: string) => {
  return useQuery({
    queryKey: ['educator-correlated-videos', channelId],
    queryFn: async () => {
      // Mock implementation
      return [];
    },
  });
};
