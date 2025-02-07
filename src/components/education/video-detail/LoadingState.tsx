
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// [Analysis] More detailed skeleton UI that matches the final layout improves perceived performance
export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-32" /> {/* Back button */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" /> {/* Breadcrumb item */}
            <Skeleton className="h-4 w-4" /> {/* Chevron */}
            <Skeleton className="h-4 w-20" /> {/* Breadcrumb item */}
            <Skeleton className="h-4 w-4" /> {/* Chevron */}
            <Skeleton className="h-4 w-48" /> {/* Video title */}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
        {/* Video Player and Info Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="rounded-xl overflow-hidden bg-black/80 ring-1 ring-white/10">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>

          {/* Video Metadata */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-1/4" /> {/* View count & date */}
            </div>

            {/* Creator Info & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
                <Skeleton className="h-6 w-40" /> {/* Channel name */}
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" /> {/* Action button */}
                <Skeleton className="h-10 w-24" /> {/* Action button */}
              </div>
            </div>
          </div>

          {/* Interaction Panel */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-white/10">
              <Skeleton className="h-10 w-24" /> {/* Tab */}
              <Skeleton className="h-10 w-24" /> {/* Tab */}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" /> {/* Content area */}
              <Skeleton className="h-24 w-full" /> {/* Content area */}
            </div>
          </div>
        </div>

        {/* Related Videos Column */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" /> {/* Section title */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-24 w-40 rounded-lg" /> {/* Thumbnail */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" /> {/* Video title */}
                <Skeleton className="h-4 w-2/3" /> {/* Channel name */}
                <Skeleton className="h-4 w-1/3" /> {/* Views & date */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
