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
        .select('*')
        .neq('id', currentVideoId)
        .contains('topics', topics)
        .limit(10);
      
      if (error) throw error;
      return data;
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