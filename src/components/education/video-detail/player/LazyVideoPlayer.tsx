import { Suspense, lazy } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ErrorBoundary } from 'react-error-boundary';
import { VideoLoadingState } from './VideoLoadingState';
import { VideoErrorState } from './VideoErrorState';

// [Analysis] Lazy loading the video player component to reduce initial bundle size
const VideoPlayer = lazy(() => import('./VideoPlayer').then(module => ({
  default: module.VideoPlayer
})));

interface LazyVideoPlayerProps {
  videoId: string;
  title: string;
}

// [Analysis] Main container component that handles loading, errors, and aspect ratio
export const LazyVideoPlayer = ({ videoId, title }: LazyVideoPlayerProps) => {
  return (
    <div className="rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
      <AspectRatio ratio={16 / 9}>
        <ErrorBoundary
          FallbackComponent={VideoErrorState}
          onReset={() => {
            console.log('Resetting video player state');
          }}
        >
          <Suspense fallback={<VideoLoadingState />}>
            <VideoPlayer videoId={videoId} title={title} />
          </Suspense>
        </ErrorBoundary>
      </AspectRatio>
    </div>
  );
};