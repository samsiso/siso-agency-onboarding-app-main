
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/components/education/types';
import { useToast } from '@/hooks/use-toast';

export const useVideoDetail = (videoId: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!videoId) {
        console.error('[useVideoDetail] Invalid video ID');
        throw new Error('Invalid video ID');
      }

      console.log('[useVideoDetail] Fetching video data for ID:', videoId);

      const { data: videoDetails, error: videoError } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          duration,
          thumbnailUrl,
          viewCount,
          date,
          channel_id,
          education_creators:channel_id (
            name,
            channel_avatar_url,
            description
          )
        `)
        .eq('id', videoId)
        .single();

      if (videoError) {
        console.error('[useVideoDetail] Error fetching video:', videoError);
        throw videoError;
      }

      if (!videoDetails) {
        console.error('[useVideoDetail] No video found with ID:', videoId);
        throw new Error('Video not found');
      }

      // [Analysis] Transform database fields to match Video interface
      const transformedVideo: Video = {
        id: videoDetails.id,
        title: videoDetails.title,
        url: videoDetails.url,
        duration: videoDetails.duration,
        thumbnail_url: videoDetails.thumbnailUrl,
        created_at: videoDetails.date,
        educator: {
          name: videoDetails.education_creators?.name || 'Unknown Creator',
          avatar_url: videoDetails.education_creators?.channel_avatar_url || '',
          title: 'Content Creator'
        },
        metrics: {
          views: videoDetails.viewCount || 0,
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
      };

      console.log('[useVideoDetail] Transformed video data:', transformedVideo);
      return transformedVideo;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('[useVideoDetail] Query error:', error);
          toast({
            title: "Error loading video",
            description: error.message || "The requested video could not be found or accessed.",
            variant: "destructive"
          });
        }
      }
    }
  });
};
