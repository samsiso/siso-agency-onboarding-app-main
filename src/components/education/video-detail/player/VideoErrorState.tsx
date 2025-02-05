// [Analysis] Separate error handling component for better error UX
interface VideoErrorStateProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const VideoErrorState = ({ error, resetErrorBoundary }: VideoErrorStateProps) => (
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