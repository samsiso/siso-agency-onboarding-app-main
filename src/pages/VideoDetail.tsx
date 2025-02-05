import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from 'lucide-react';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { extractVideoIdFromSlug } from '@/utils/slugUtils';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { LazyVideoPlayer } from '@/components/education/video-detail/player';
import { VideoMetadata } from '@/components/education/video-detail/VideoMetadata';
import { VideoCreatorInfo } from '@/components/education/video-detail/VideoCreatorInfo';
import { VideoActions } from '@/components/education/video-detail/VideoActions';
import { VideoInteractionPanel } from '@/components/education/video-detail/VideoInteractionPanel';

export default function VideoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analysis';
  const { toast } = useToast();
  
  const videoId = slug ? extractVideoIdFromSlug(slug) : '';
  console.log('Extracted video ID:', videoId); // Debug log

  const { data: videoData, isLoading, error } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!videoId) {
        console.error('Invalid video ID');
        throw new Error('Invalid video ID');
      }

      console.log('Fetching video with ID:', videoId); // Debug log

      const { data: videoDetails, error: videoError } = await supabase
        .from('youtube_videos')
        .select(`
          *,
          education_creators (
            name,
            slug,
            channel_avatar_url,
            description
          )
        `)
        .eq('id', videoId)
        .maybeSingle();
      
      if (videoError) {
        console.error('Error fetching video:', videoError);
        throw videoError;
      }
      
      if (!videoDetails) {
        console.error('No video found with ID:', videoId);
        throw new Error('Video not found');
      }

      console.log('Found video details:', videoDetails); // Debug log

      return videoDetails;
    },
    enabled: !!videoId,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
          toast({
            title: "Error loading video",
            description: error.message || "The requested video could not be found or accessed.",
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

  if (error || !videoData) {
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

  const channelName = videoData?.education_creators?.name || videoData?.channel_id || 'Unknown Creator';
  const channelAvatar = videoData?.education_creators?.channel_avatar_url || '';
  const videoDescription = videoData?.education_creators?.description || '';
  const thumbnailUrl = videoData?.thumbnailUrl || '';
  const educatorSlug = videoData?.education_creators?.slug;

  return (
    <>
      <Helmet>
        <title>{`${videoData?.title || 'Video'} | ${channelName} | SISO Education`}</title>
        <meta name="description" content={videoDescription} />
        <meta property="og:title" content={videoData?.title || ''} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="og:type" content="video.other" />
      </Helmet>

      <div className="min-h-screen bg-black">
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
              <span className="text-white truncate max-w-[300px]">{videoData?.title || 'Loading...'}</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
          <div className="xl:col-span-2 space-y-6">
            {videoData?.id ? (
              <LazyVideoPlayer videoId={videoData.id} title={videoData.title || ''} />
            ) : (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Loading video...</p>
              </div>
            )}

            <div className="space-y-6">
              <VideoMetadata 
                title={videoData?.title || ''}
                viewCount={videoData?.viewCount || 0}
                publishDate={videoData?.date || ''}
              />
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <VideoCreatorInfo
                  channelName={channelName}
                  channelAvatar={channelAvatar}
                  educatorSlug={educatorSlug}
                />
                <VideoActions />
              </div>
            </div>

            <VideoInteractionPanel videoId={videoId} activeTab={activeTab} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Related Videos
            </h2>
            <RelatedVideos 
              currentVideoId={videoId} 
              topics={[]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
