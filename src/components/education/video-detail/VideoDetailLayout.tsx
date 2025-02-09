
import { Video } from '@/components/education/types';
import { LazyVideoPlayer } from './player';
import { VideoMetadata } from './VideoMetadata';
import { VideoCreatorInfo } from './VideoCreatorInfo';
import { VideoActions } from './VideoActions';
import { VideoInteractionPanel } from './VideoInteractionPanel';
import { RelatedVideos } from '@/components/education/RelatedVideos';
import { VideoDescription } from './VideoDescription';
import { Badge } from '@/components/ui/badge';
import { Languages, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoDetailLayoutProps {
  video: Video;
  activeTab: string;
}

export const VideoDetailLayout = ({ video, activeTab }: VideoDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="relative w-full bg-black/60">
        <div className="max-w-[1800px] mx-auto">
          <LazyVideoPlayer videoId={video.id} title={video.title} />
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
        <motion.div 
          className="xl:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6 rounded-xl bg-white/5 backdrop-blur-sm p-6 border border-white/10">
            <div className="space-y-4">
              <VideoMetadata 
                title={video.title}
                viewCount={video.metrics.views}
                publishDate={video.created_at || null}
                likesCount={video.metrics.likes}
                commentCount={video.metrics.comments}
              />
              
              <div className="flex flex-wrap gap-2">
                {video.has_captions && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    Captions
                  </Badge>
                )}
                {video.hd_thumbnail_url && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileVideo className="w-3 h-3" />
                    HD
                  </Badge>
                )}
                {video.language && (
                  <Badge variant="outline">
                    {video.language}
                  </Badge>
                )}
                {video.metrics.category && (
                  <Badge variant="outline" className="bg-siso-red/10">
                    {video.metrics.category}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <VideoCreatorInfo
                name={video.educator.name}
                avatar={video.educator.avatar_url}
                subscriberCount={video.educator.subscriber_count}
                videoCount={video.educator.video_count}
                uploadFrequency={video.educator.upload_frequency}
                slug={video.educator.slug}
              />
              <VideoActions videoId={video.id} />
            </div>
          </div>

          {video.full_description && (
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
              <VideoDescription 
                description={video.full_description}
                tags={video.tags}
              />
            </div>
          )}

          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            <VideoInteractionPanel 
              videoId={video.id} 
              activeTab={activeTab}
            />
          </div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <RelatedVideos 
              videoId={video.id} 
              topics={video.topics}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
