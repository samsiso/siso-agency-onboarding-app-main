
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';

export const useEducatorVideos = (educatorId: string | null, page = 1) => {
  return useQuery({
    queryKey: ['educator-videos', educatorId, page],
    queryFn: async () => {
      if (!educatorId) return [];
      
      console.log('Fetching videos for educator:', educatorId); // Debug log
      
      const { data: educator } = await supabase
        .from('education_creators')
        .select('featured_videos')
        .eq('id', educatorId)
        .single();

      console.log('Educator data:', educator); // Debug log

      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          thumbnailUrl,
          duration,
          viewCount,
          date,
          channel_id
        `)
        .eq('channel_id', educatorId)
        .order('date', { ascending: false })
        .range((page - 1) * 12, page * 12 - 1);
      
      if (error) {
        console.error('Error fetching educator videos:', error);
        throw error;
      }

      // Transform the data to match the Video type
      const transformedVideos: Video[] = videos.map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        duration: video.duration,
        thumbnail_url: video.thumbnailUrl,
        educator: {
          name: '', // Will be filled by parent component
          avatar_url: ''
        },
        metrics: {
          views: video.viewCount,
          likes: 0,
          sentiment_score: 0,
          difficulty: 'Beginner',
          impact_score: 0
        },
        topics: [],
        ai_analysis: {
          key_takeaways: [],
          implementation_steps: []
        }
      }));
      
      console.log('Transformed videos:', transformedVideos); // Debug log
      
      return transformedVideos;
    },
    enabled: !!educatorId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    gcTime: 10 * 60 * 1000,
  });
};
