import { memo } from 'react';
import { VideoPlayerFrame } from './VideoPlayerFrame';

// [Analysis] Define and export props interface for better type safety
export interface VideoPlayerProps {
  videoId: string;
  title: string;
}

// [Analysis] Memoized video player to prevent unnecessary re-renders
export const VideoPlayer = memo(({ videoId, title }: VideoPlayerProps) => {
  return <VideoPlayerFrame videoId={videoId} title={title} />;
});

VideoPlayer.displayName = 'VideoPlayer';

// [Analysis] Default export needed for lazy loading
export default { VideoPlayer };