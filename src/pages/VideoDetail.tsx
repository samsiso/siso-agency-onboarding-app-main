import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, MessageCircle, Brain, ListChecks, Eye, ThumbsUp, Calendar, Users, Share2, Download } from 'lucide-react';
import { VideoAnalysis } from '@/components/education/VideoAnalysis';
import { VideoChat } from '@/components/education/VideoChat';
import { VideoTakeaways } from '@/components/education/VideoTakeaways';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { extractVideoIdFromSlug } from '@/utils/slugUtils';
import { format, parseISO } from 'date-fns';
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
      if (!data) throw new Error('Video not found');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-siso-red border-t-transparent rounded-full animate-spin" />
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

  const channelName = video.channel?.name || 'Unknown Creator';
  const channelAvatar = video.channel?.profile_image_url;
  const videoDescription = video.channel?.description || '';
  const thumbnailUrl = video.thumbnailUrl || '';
  const publishDate = video.date ? parseISO(video.date) : null;
  const viewCount = video.viewCount || 0;
  const likeCount = 0; // We don't have this in the simplified schema

  return (
    <>
      <Helmet>
        <title>{`${video.title} | ${channelName} | SISO Education`}</title>
        <meta name="description" content={videoDescription} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="og:type" content="video.other" />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
          {/* Left Column - Video Player and Info */}
          <div className="xl:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden bg-black/20 ring-1 ring-siso-text/10">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </AspectRatio>
            </div>

            {/* Video Title and Actions */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{video.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Channel Info */}
                <div className="flex items-center gap-3">
                  {channelAvatar && (
                    <img 
                      src={channelAvatar} 
                      alt={channelName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{channelName}</h3>
                    <p className="text-sm text-gray-400">Creator</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </Button>
                </div>
              </div>

              {/* Video Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-b border-gray-800 py-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{viewCount.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{likeCount.toLocaleString()} likes</span>
                </div>
                {publishDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(publishDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Panel */}
            <Tabs defaultValue={activeTab} className="space-y-4">
              <TabsList className="w-full grid grid-cols-3 lg:w-[400px] bg-gray-800">
                <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-siso-red">
                  <Brain className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-siso-red">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="takeaways" className="gap-2 data-[state=active]:bg-siso-red">
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
          </div>

          {/* Right Column - Related Videos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Related Videos</h2>
            <RelatedVideos 
              currentVideoId={video.id} 
              topics={[]}
            />
          </div>
        </div>
      </div>
    </>
  );
}