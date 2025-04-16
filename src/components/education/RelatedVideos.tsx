
import { useQuery } from '@tanstack/react-query';
import { ToolVideoCard } from '../tools/ToolVideoCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { safeSupabase, safeCast } from '@/utils/supabaseHelpers';

interface RelatedVideosProps {
  currentVideoId: string;
  topics: string[];
}

export function RelatedVideos({ currentVideoId, topics }: RelatedVideosProps) {
  const { data: relatedVideos, isLoading } = useQuery({
    queryKey: ['related-videos', currentVideoId, topics],
    queryFn: async () => {
      const { data: videos, error } = await safeSupabase
        .from('youtube_videos')
        .select(`
          id,
          title,
          url,
          duration,
          thumbnailUrl,
          viewCount,
          channel_id
        `)
        .neq('id', currentVideoId)
        .limit(10);
      
      if (error) {
        console.error('Error fetching related videos:', error);
        throw error;
      }
      
      if (!videos) return [];

      console.log('Raw video data:', videos); // Debug log

      // Safely cast the returned data
      const typedVideos = safeCast<any[]>(videos);

      return typedVideos.map(video => ({
        id: video?.id || '',
        title: video?.title || '',
        url: `https://youtube.com/watch?v=${video?.id || ''}`,
        duration: video?.duration || '0:00',
        thumbnail_url: video?.thumbnailUrl || '',
        educator: {
          name: video?.channel_id || 'Unknown Creator',
          avatar_url: '' // Default empty string for avatar
        },
        metrics: {
          views: video?.viewCount || 0,
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
