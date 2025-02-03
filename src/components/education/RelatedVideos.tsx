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
        .select(`
          *,
          channel:youtube_channels(*)
        `)
        .neq('id', currentVideoId)
        .limit(10);
      
      if (error) throw error;
      if (!videos) return [];

      // Transform the data to match the expected ToolVideoCard props
      return videos.map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.channel?.name || 'Unknown Creator',
          avatar_url: video.channel?.profile_image_url || ''
        },
        metrics: {
          views: video.viewCount || 0,
          likes: 0, // We don't have this in the simplified schema
          sentiment_score: 0.8,
          difficulty: "Intermediate" as const,
          impact_score: 8.5
        },
        topics: [], // We don't have this in the simplified schema
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