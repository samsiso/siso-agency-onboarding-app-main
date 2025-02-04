import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ToolVideoCard } from '../tools/ToolVideoCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface RelatedVideosProps {
  currentVideoId: string;
  topics: string[];
}

// [Analysis] Define proper types for our database response
interface VideoWithCreator {
  id: string;
  title: string | null;
  url: string | null;
  duration: string | null;
  thumbnailUrl: string | null;
  viewCount: number | null;
  channel_id: string | null;
  creator: {
    name: string | null;
    channel_avatar_url: string | null;
  } | null;
}

export function RelatedVideos({ currentVideoId, topics }: RelatedVideosProps) {
  const { data: relatedVideos, isLoading } = useQuery({
    queryKey: ['related-videos', currentVideoId, topics],
    queryFn: async () => {
      // [Analysis] Use LEFT JOIN to handle cases where creator might not exist
      const { data: videos, error } = await supabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          duration,
          thumbnailUrl,
          viewCount,
          channel_id,
          creator:education_creators!youtube_videos_channel_id_fkey(
            name,
            channel_avatar_url
          )
        `)
        .neq('id', currentVideoId)
        .limit(10);
      
      if (error) {
        console.error('Error fetching related videos:', error);
        throw error;
      }
      
      if (!videos) return [];

      console.log('Raw video data:', videos); // Debug log

      return videos.map((video: VideoWithCreator) => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.creator?.name || 'Unknown Creator',
          avatar_url: video.creator?.channel_avatar_url || ''
        },
        metrics: {
          views: video.viewCount || 0,
          likes: 0,
          sentiment_score: 0.8,
          difficulty: "Intermediate" as const,
          impact_score: 8.5
        },
        topics: [],
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