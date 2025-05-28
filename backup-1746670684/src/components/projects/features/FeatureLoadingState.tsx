
import { Skeleton } from '@/components/ui/skeleton';

export function FeatureLoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-6 w-40" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
