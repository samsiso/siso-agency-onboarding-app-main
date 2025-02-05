import { memo } from 'react';
import { VideoPlayerFrame } from './VideoPlayerFrame';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

// [Analysis] Memoized video player to prevent unnecessary re-renders
export const VideoPlayer = memo(({ videoId, title }: VideoPlayerProps) => {
  return <VideoPlayerFrame videoId={videoId} title={title} />;
});

VideoPlayer.displayName = 'VideoPlayer';