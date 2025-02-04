import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, MessageCircle, Brain, ListChecks, Eye, Calendar, Users, Share2, Download } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function VideoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analysis';
  const { toast } = useToast();
  
  const videoId = slug ? extractVideoIdFromSlug(slug) : '';
  console.log('Extracted Video ID:', videoId); // Debug log

  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      console.log('Fetching video with ID:', videoId); // Debug log
      
      if (!videoId) {
        throw new Error('Invalid video ID');
      }

      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('id', videoId)
        .maybeSingle();
      
      console.log('Query response:', { data, error }); // Debug log
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Video not found');
      }

      return data;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
          toast({
            title: "Error loading video",
            description: "The requested video could not be found or accessed.",
            variant: "destructive"
          });
        }
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-siso-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-siso-text">Video not found</div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/education')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Videos
        </Button>
      </div>
    );
  }

  // Use channel_id directly as the channel name
  const channelName = video.channel_id || 'Unknown Creator';
  const channelAvatar = ''; // We don't have avatar URLs anymore
  const videoDescription = ''; // We don't have channel descriptions anymore
  const thumbnailUrl = video.thumbnailUrl || '';
  
  let publishDate = null;
  try {
    if (video.date && typeof video.date === 'string') {
      publishDate = parseISO(video.date);
      if (isNaN(publishDate.getTime())) {
        publishDate = null;
      }
    }
  } catch (e) {
    console.error('Error parsing date:', e);
    publishDate = null;
  }
  
  const viewCount = video.viewCount || 0;

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
        {/* Navigation */}
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4 text-gray-400">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-white/10"
              onClick={() => navigate('/education')}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Videos
            </Button>
            <div className="flex items-center gap-2">
              <span>Education</span>
              <ChevronLeft className="w-4 h-4" />
              <span>Videos</span>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-white truncate max-w-[300px]">{video.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
          {/* Left Column - Video Player and Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
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
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{video.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Channel Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white/60" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{channelName}</h3>
                    <p className="text-sm text-gray-400">Creator</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="gap-2 bg-white/5 hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2 bg-white/5 hover:bg-white/10">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Video Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-b border-gray-800 py-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{viewCount.toLocaleString()} views</span>
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
            <Tabs defaultValue={activeTab} className="space-y-6">
              <TabsList className="w-full grid grid-cols-3 lg:w-[400px] bg-white/5">
                <TabsTrigger 
                  value="analysis" 
                  className="gap-2 data-[state=active]:bg-siso-red data-[state=active]:text-white"
                >
                  <Brain className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="gap-2 data-[state=active]:bg-siso-red data-[state=active]:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="takeaways" 
                  className="gap-2 data-[state=active]:bg-siso-red data-[state=active]:text-white"
                >
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Related Videos
            </h2>
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