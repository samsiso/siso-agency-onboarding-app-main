
import { memo, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardMediaProps {
  imageUrl?: string;
  title: string;
  isFeatured?: boolean;
  isCompact?: boolean;
  date?: string;
  source?: string; // [Analysis] Added missing source property to fix type error
  height?: string; // [Analysis] Added height property to match usage in NewsCard
  featured?: boolean; // [Analysis] Added for compatibility with NewsCard
}

// [Analysis] List of fallback images for articles without images
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
];

export const NewsCardMedia = memo(({ 
  imageUrl, 
  title,
  isFeatured = false,
  isCompact = false,
  date,
  source, // [Analysis] Added the source parameter
  height, // [Analysis] Added height parameter to match usage
  featured  // [Analysis] Added featured parameter for compatibility
}: NewsCardMediaProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // [Analysis] Select a consistent fallback image based on title hash
  const getFallbackImage = () => {
    // Simple hash function for the title to pick a consistent image
    const hashCode = title.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    return FALLBACK_IMAGES[hashCode % FALLBACK_IMAGES.length];
  };

  // [Analysis] Determine final image URL with fallback logic
  const finalImageUrl = imageError || !imageUrl ? getFallbackImage() : imageUrl;

  // [Analysis] For compact cards, return early with no image
  if (isCompact) {
    return null;
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-slate-900/40",
        height || (isFeatured || featured ? "h-80 sm:h-96" : "h-48 sm:h-56")
      )}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      <img
        src={finalImageUrl}
        alt={title}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500 hover:opacity-90",
          !imageLoaded && "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {date && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          <CalendarDays className="h-3 w-3" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )}
      
      {/* [Analysis] Display source if provided */}
      {source && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          {source}
        </div>
      )}
    </div>
  );
});

NewsCardMedia.displayName = 'NewsCardMedia';
