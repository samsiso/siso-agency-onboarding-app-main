import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, MessageCircle, Brain, ListChecks } from 'lucide-react';
import { VideoAnalysis } from '@/components/education/VideoAnalysis';
import { VideoChat } from '@/components/education/VideoChat';
import { VideoTakeaways } from '@/components/education/VideoTakeaways';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function VideoDetail() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analysis';

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select(`
          *,
          channel:youtube_channels(*)
        `)
        .eq('id', videoId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/education')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Library
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-siso-text-bold">{video.title}</h1>
            <p className="text-sm text-siso-text/70">{video.channel?.name}</p>
          </div>
        </div>

        {/* Video Player */}
        <div className="rounded-lg overflow-hidden bg-black/20 ring-1 ring-siso-text/10">
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={`https://www.youtube.com/embed/${video.video_id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </AspectRatio>
        </div>

        {/* Interaction Panel */}
        <Tabs defaultValue={activeTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="analysis" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="takeaways" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Key Takeaways
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <VideoAnalysis videoId={video.id} />
          </TabsContent>

          <TabsContent value="chat">
            <VideoChat videoId={video.id} />
          </TabsContent>

          <TabsContent value="takeaways">
            <VideoTakeaways videoId={video.id} />
          </TabsContent>
        </Tabs>

        {/* Related Videos */}
        <RelatedVideos 
          currentVideoId={video.id} 
          topics={video.topics || []} 
        />
      </div>
    </div>
  );
}