
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

      // First get the creator details to get both channel_id and name
      const { data: creator, error: creatorError } = await supabase
        .from('education_creators')
        .select('name, channel_id')
        .eq('channel_id', channelId)
        .single();

      if (creatorError) {
        console.error('[useEducatorCorrelatedVideos] Error fetching creator:', creatorError);
        throw creatorError;
      }

      // [Analysis] Using proper parameter format for the OR condition
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
            channel_avatar_url,
            slug
          )
        `)
        .or(`channel_id.eq."${channelId}",channel_id.eq."${creator.name}",channel_id.ilike."%${creator.name}%"`)
        .order('date', { ascending: false })
        .limit(12);

      if (error) {
        console.error('[useEducatorCorrelatedVideos] Error:', error);
        throw error;
      }

      console.log('[useEducatorCorrelatedVideos] Found videos:', videos?.length);

      // [Analysis] Transform the data to match our Video interface
      return videos.map((video): Video => ({
        id: video.id,
        title: video.title || '',
        url: video.url || '',
        duration: video.duration || '',
        thumbnail_url: video.thumbnailUrl || '',
        created_at: video.date,
        educator: {
          name: video.education_creators?.name || creator.name || 'Unknown Creator',
          avatar_url: video.education_creators?.channel_avatar_url || '',
          title: 'Content Creator',
          slug: video.education_creators?.slug
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
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000 // Keep unused data for 10 minutes
  });
};
