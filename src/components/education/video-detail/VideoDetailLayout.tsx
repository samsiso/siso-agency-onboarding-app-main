
import { Video } from '@/components/education/types';
import { LazyVideoPlayer } from './player';
import { VideoMetadata } from './VideoMetadata';
import { VideoCreatorInfo } from './VideoCreatorInfo';
import { VideoActions } from './VideoActions';
import { VideoInteractionPanel } from './VideoInteractionPanel';
import { RelatedVideos } from '@/components/education/RelatedVideos';

interface VideoDetailLayoutProps {
  video: Video;
  activeTab: string;
}

export const VideoDetailLayout = ({ video, activeTab }: VideoDetailLayoutProps) => {
  return (
    <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
      <div className="xl:col-span-2 space-y-6">
        <LazyVideoPlayer videoId={video.id} title={video.title} />

        <div className="space-y-6">
          <VideoMetadata 
            title={video.title}
            viewCount={video.metrics.views}
            publishDate={video.created_at || null}
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <VideoCreatorInfo
              channelName={video.educator.name}
              channelAvatar={video.educator.avatar_url}
              educatorSlug=""
            />
            <VideoActions />
          </div>
        </div>

        <VideoInteractionPanel videoId={video.id} activeTab={activeTab} />
      </div>

      <div className="space-y-6">
        <RelatedVideos 
          currentVideoId={video.id} 
          topics={video.topics}
        />
      </div>
    </div>
  );
};
