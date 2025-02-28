
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface NewsCardMediaProps {
  imageUrl: string;
  title: string;
  isFeatured?: boolean;
  isCompact?: boolean;
  className?: string;
}

export const NewsCardMedia = ({
  imageUrl,
  title,
  isFeatured = false,
  isCompact = false,
  className = ''
}: NewsCardMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // [Analysis] Use fallback image when original source fails after retries
  const fallbackImage = '/placeholder.svg';
  
  // [Analysis] Enhanced intersection observer for better lazy loading performance
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '100px', // Load images a bit earlier
      threshold: 0.1
    });
    
    const element = document.getElementById(`news-image-${title.replace(/\s+/g, '-')}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [title]);

  // [Analysis] Handle image error with retry logic
  const handleImageError = () => {
    if (retryCount < 2) {
      // Retry loading the image after a short delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
      }, 1000);
    } else {
      setError(true);
      setIsLoading(false);
      console.warn(`Failed to load image for article: ${title}`);
    }
  };

  return (
    <div className={`${isCompact ? 'w-1/3 max-w-[200px]' : 'w-full'} ${className}`}>
      <AspectRatio ratio={isCompact ? 4 / 3 : 16 / 9}>
        <div 
          id={`news-image-${title.replace(/\s+/g, '-')}`} 
          className="relative h-full overflow-hidden rounded-t-lg"
        >
          {/* Loading shimmer effect */}
          {(isLoading || !isIntersecting) && (
            <Skeleton className="w-full h-full absolute inset-0 bg-gradient-to-r from-siso-bg-alt/60 via-siso-bg/40 to-siso-bg-alt/60 animate-pulse" />
          )}
          
          {isIntersecting && !error && (
            <motion.img
              src={imageUrl || fallbackImage}
              alt={title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              onLoad={() => setIsLoading(false)}
              onError={handleImageError}
              key={`img-${retryCount}`} // Force re-render on retry
            />
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-siso-bg/80 p-4">
              <AlertCircle className="h-8 w-8 text-siso-red mb-2" />
              <p className="text-xs text-center text-white/80">Image unavailable</p>
            </div>
          )}

          {/* Enhanced hover overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

          {isFeatured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="outline" className="bg-siso-red/10 text-siso-red border-none text-xs font-semibold px-2 py-1">
                Featured
              </Badge>
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
};
