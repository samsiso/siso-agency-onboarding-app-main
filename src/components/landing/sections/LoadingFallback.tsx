
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface LoadingFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export const LoadingFallback = memo(({ error, onRetry }: LoadingFallbackProps) => {
  if (error) {
    return (
      <div className="w-full py-12 animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto space-y-4 p-6 rounded-xl border border-siso-text/10 backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 mx-auto text-siso-red animate-pulse" />
            <h3 className="text-lg font-semibold text-siso-text">Failed to load content</h3>
            <p className="text-sm text-siso-text/70">There was an error loading this section. Please try again.</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-siso-red/10 hover:bg-siso-red/20 
                  text-siso-red transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Loading
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 space-y-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4 bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
            <Skeleton className="h-6 w-1/2 mx-auto bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="space-y-4 p-6 rounded-xl border border-siso-text/10 backdrop-blur-sm 
                  animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Skeleton className="h-12 w-12 rounded-lg bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                <Skeleton className="h-6 w-1/3 rounded-full bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                  <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                  <Skeleton className="h-4 w-4/6 bg-gradient-to-r from-black/40 to-black/20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

LoadingFallback.displayName = 'LoadingFallback';
