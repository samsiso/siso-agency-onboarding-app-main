
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';

export const useEducatorCorrelatedVideos = (channelId: string | undefined) => {
  // [Analysis] Using tanstack/react-query for data fetching with caching
  return useQuery({
    queryKey: ['educator-correlated-videos', channelId],
    queryFn: async () => {
      if (!channelId) {
        throw new Error('Channel ID is required');
      }

      console.log('[useEducatorCorrelatedVideos] Fetching videos for channel:', channelId);

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
          channel_id,
          education_creators!youtube_videos_channel_id_fkey (
            name,
            channel_avatar_url
          )
        `)
        .eq('channel_id', channelId)
        .order('date', { ascending: false });

      if (error) {
        console.error('[useEducatorCorrelatedVideos] Error:', error);
        throw error;
      }

      // [Analysis] Transform the data to match our Video interface
      return videos.map((video): Video => ({
        id: video.id,
        title: video.title || '',
        url: video.url || '',
        duration: video.duration || '',
        thumbnail_url: video.thumbnailUrl || '',
        created_at: video.date,
        educator: {
          name: video.education_creators?.name || 'Unknown Creator',
          avatar_url: video.education_creators?.channel_avatar_url || '',
          title: 'Content Creator'
        },
        metrics: {
          views: video.viewCount || 0,
          likes: 0,
          sentiment_score: 0,
          difficulty: 'Intermediate',
          impact_score: 0,
          category: 'Education'
        },
        topics: [],
        ai_analysis: {
          key_takeaways: [],
          implementation_steps: []
        }
      }));
    },
    enabled: !!channelId
  });
};
