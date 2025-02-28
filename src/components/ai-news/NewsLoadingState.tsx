
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { memo } from "react";

// [Analysis] Create multiple arrays for grid-based skeleton layout
const LOADING_ITEMS = Array(3).fill(null);
const LOADING_LINES = Array(3).fill(null);
const LOADING_DOTS = Array(4).fill(null);

export const NewsLoadingState = memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {LOADING_ITEMS.map((_, idx) => (
        <div 
          key={idx} 
          className={cn(
            "border rounded-lg overflow-hidden bg-card flex flex-col",
            "animate-pulse transition-opacity"
          )}
        >
          {/* Image skeleton */}
          <Skeleton className="w-full h-48" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-4 flex-1">
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              {LOADING_LINES.map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-4 mt-auto">
              <div className="flex space-x-2">
                {LOADING_DOTS.map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

NewsLoadingState.displayName = 'NewsLoadingState';
