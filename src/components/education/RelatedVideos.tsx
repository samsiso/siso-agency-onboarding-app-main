import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolVideoCard } from '../tools/ToolVideoCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface RelatedVideosProps {
  currentVideoId: string;
  topics: string[];
}

export function RelatedVideos({ currentVideoId, topics }: RelatedVideosProps) {
  const { data: relatedVideos, isLoading } = useQuery({
    queryKey: ['related-videos', currentVideoId, topics],
    queryFn: async () => {
      // Get videos with proper join
      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .neq('video_id', currentVideoId)
        .limit(10);
      
      if (error) throw error;
      if (!videos) return [];

      // Transform the data to match the expected ToolVideoCard props
      return videos.map(video => ({
        id: video.video_id || '',
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.video_id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailurl || '',
        educator: {
          name: video["aboutChannelInfo/channelName"] || 'Unknown Creator',
          avatar_url: video["aboutChannelInfo/channelAvatarUrl"] || ''
        },
        metrics: {
          views: video.viewcount || 0,
          likes: video.like_count || 0,
          sentiment_score: 0.8,
          difficulty: video.difficulty_level as "Beginner" | "Intermediate" | "Advanced" || "Intermediate",
          impact_score: 8.5
        },
        topics: video.topics || [],
        ai_analysis: {
          key_takeaways: ['Coming soon...'],
          implementation_steps: ['Coming soon...']
        }
      }));
    },
  });

  if (isLoading) {
    return <div>Loading related videos...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-siso-text-bold">Related Videos</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {relatedVideos?.map((video) => (
            <div key={video.id} className="w-[300px] flex-shrink-0">
              <ToolVideoCard video={video} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}