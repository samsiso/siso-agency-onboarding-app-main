
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

export const LoadingFallback = memo(() => {
  return (
    <div className="w-full py-12 space-y-8 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Content-aware skeleton that matches actual content layout */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Heading skeleton */}
          <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4 bg-gradient-to-r from-black/40 to-black/20" />
            <Skeleton className="h-6 w-1/2 mx-auto bg-gradient-to-r from-black/40 to-black/20" />
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 p-6 rounded-xl border border-siso-text/10 backdrop-blur-sm">
                {/* Icon skeleton */}
                <Skeleton className="h-12 w-12 rounded-lg bg-gradient-to-r from-black/40 to-black/20" />
                
                {/* Title skeleton */}
                <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-black/40 to-black/20" />
                
                {/* Stats badge skeleton */}
                <Skeleton className="h-6 w-1/3 rounded-full bg-gradient-to-r from-black/40 to-black/20" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gradient-to-r from-black/40 to-black/20" />
                  <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-black/40 to-black/20" />
                  <Skeleton className="h-4 w-4/6 bg-gradient-to-r from-black/40 to-black/20" />
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
