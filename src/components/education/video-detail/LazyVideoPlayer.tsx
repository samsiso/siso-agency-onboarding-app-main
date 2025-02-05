import { Suspense, lazy } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

// [Analysis] Using dynamic import for VideoPlayer to reduce initial bundle size
const VideoPlayer = lazy(() => import('./VideoPlayer').then(module => ({
  default: module.VideoPlayer
})));

interface LazyVideoPlayerProps {
  videoId: string;
  title: string;
}

// [Analysis] Separate loading component for better UX during video load
const VideoLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-black/80 rounded-xl">
    <Loader2 className="w-8 h-8 animate-spin text-siso-red" />
  </div>
);

// [Analysis] Error fallback component for graceful failure handling
const VideoErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 rounded-xl p-4 text-center">
    <p className="text-white mb-4">Failed to load video: {error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-siso-red text-white rounded-lg hover:bg-siso-red/90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export const LazyVideoPlayer = ({ videoId, title }: LazyVideoPlayerProps) => {
  return (
    <div className="rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
      <AspectRatio ratio={16 / 9}>
        <ErrorBoundary
          FallbackComponent={VideoErrorFallback}
          onReset={() => {
            // [Analysis] Reset any state that might have caused the error
            console.log('Resetting video player state');
          }}
        >
          <Suspense fallback={<VideoLoadingFallback />}>
            <VideoPlayer videoId={videoId} title={title} />
          </Suspense>
        </ErrorBoundary>
      </AspectRatio>
    </div>
  );
};