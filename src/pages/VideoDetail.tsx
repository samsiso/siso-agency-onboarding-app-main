import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, MessageCircle, Brain, ListChecks, Eye, ThumbsUp, Calendar, Users } from 'lucide-react';
import { VideoAnalysis } from '@/components/education/VideoAnalysis';
import { VideoChat } from '@/components/education/VideoChat';
import { VideoTakeaways } from '@/components/education/VideoTakeaways';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { extractVideoIdFromSlug } from '@/utils/slugUtils';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

export default function VideoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analysis';
  
  const videoId = slug ? extractVideoIdFromSlug(slug) : '';

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
    return (
      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-pulse text-siso-text">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex items-center justify-center">
        <div className="text-siso-text">Video not found</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${video.title} | ${video.channel?.name} | SISO Education`}</title>
        <meta name="description" content={video.description} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={video.thumbnail_url} />
        <meta property="og:type" content="video.other" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": video.description,
            "thumbnailUrl": video.thumbnail_url,
            "uploadDate": video.published_at,
            "duration": video.duration,
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "http://schema.org/WatchAction",
                "userInteractionCount": video.view_count
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "http://schema.org/LikeAction",
                "userInteractionCount": video.like_count
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Navigation Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-siso-bg/80 backdrop-blur-sm border-b border-siso-border p-4"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/education')}
              className="gap-2 group"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden md:inline">Back to Library</span>
            </Button>

            <div className="flex-1 flex items-center justify-center gap-3 px-4">
              <h1 className="text-lg md:text-xl font-semibold text-siso-text-bold line-clamp-1">
                {video.title}
              </h1>
              {video.channel && (
                <div className="hidden md:flex items-center gap-2">
                  {video.channel.profile_image_url && (
                    <img 
                      src={video.channel.profile_image_url} 
                      alt={video.channel.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-siso-text/70">{video.channel.name}</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate('/education', { state: { section: 'educators' } })}
              className="hidden md:flex gap-2"
            >
              <Users className="h-4 w-4" />
              <span>View Educators</span>
            </Button>
          </motion.div>

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

          {/* Video Info */}
          <div className="flex items-center gap-6 text-sm text-siso-text/70">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{video.view_count.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{video.like_count.toLocaleString()} likes</span>
            </div>
            {video.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(video.published_at), 'MMM d, yyyy')}</span>
              </div>
            )}
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
    </>
  );
}