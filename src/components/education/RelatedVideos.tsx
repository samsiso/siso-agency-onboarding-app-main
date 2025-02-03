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
      const { data, error } = await supabase
        .from('youtube_videos')
        .select(`
          *,
          channel:youtube_channels(*)
        `)
        .neq('id', currentVideoId)
        .contains('topics', topics)
        .limit(10);
      
      if (error) throw error;

      // Transform the data to match the expected ToolVideoCard props
      return data.map(video => ({
        id: video.id,
        title: video.title,
        url: `https://youtube.com/watch?v=${video.video_id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnail_url || '',
        educator: {
          name: video.channel?.name || 'Unknown Creator',
          avatar_url: video.channel?.profile_image_url || ''
        },
        metrics: {
          views: video.view_count || 0,
          likes: video.like_count || 0,
          sentiment_score: 0.8, // Default value since we don't have this in the DB yet
          difficulty: (video.difficulty_level as "Beginner" | "Intermediate" | "Advanced") || "Intermediate",
          impact_score: 8.5 // Default value since we don't have this in the DB yet
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