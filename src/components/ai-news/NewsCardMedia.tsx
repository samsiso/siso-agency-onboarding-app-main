
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

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

  // [Analysis] Implement intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '50px',
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
              src={imageUrl || '/placeholder.svg'}
              alt={title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError(true);
              }}
            />
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
