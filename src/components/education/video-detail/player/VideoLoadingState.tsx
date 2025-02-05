import { Loader2 } from 'lucide-react';

// [Analysis] Dedicated loading component for better maintainability
export const VideoLoadingState = () => (
  <div className="w-full h-full flex items-center justify-center bg-black/80 rounded-xl">
    <Loader2 className="w-8 h-8 animate-spin text-siso-red" />
  </div>
);