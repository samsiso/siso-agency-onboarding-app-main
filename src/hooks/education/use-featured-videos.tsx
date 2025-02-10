
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';

export const useFeaturedVideos = () => {
  return useQuery({
    queryKey: ['featured-videos'],
    queryFn: async () => {
      console.log('[useFeaturedVideos] Fetching featured videos');
      
      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          thumbnailUrl,
          duration,
          viewCount,
          date,
          channel_id,
          views,
          featured,
          education_creators!youtube_videos_channel_id_fkey (
            name,
            channel_avatar_url
          )
        `)
        .eq('featured', true)
        .order('views', { ascending: false })
        .limit(3);

      if (error) {
        console.error('[useFeaturedVideos] Error:', error);
        throw error;
      }

      return videos.map(video => ({
        id: video.id,
        title: video.title,
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration,
        thumbnail_url: video.thumbnailUrl,
        date: video.date,
        educator: {
          name: video.education_creators?.name || 'Unknown Creator',
          avatar_url: video.education_creators?.channel_avatar_url || '',
        },
        metrics: {
          views: video.views || 0,
          likes: 0,
          sentiment_score: 0.8,
          difficulty: "Intermediate",
          impact_score: 8.5
        },
        topics: [],
        ai_analysis: {
          key_takeaways: [],
          implementation_steps: []
        }
      })) as Video[];
    }
  });
};
