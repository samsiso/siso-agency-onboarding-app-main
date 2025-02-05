import { memo } from 'react';
import { VideoPlayerFrame } from './VideoPlayerFrame';

export interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export const VideoPlayer = memo(({ videoId, title }: VideoPlayerProps) => {
  return <VideoPlayerFrame videoId={videoId} title={title} />;
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;