
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface NewsCardMediaProps {
  imageUrl: string;
  title: string;
  isFeatured?: boolean;
  isCompact?: boolean;
}

export const NewsCardMedia = ({ 
  imageUrl, 
  title, 
  isFeatured = false,
  isCompact = false 
}: NewsCardMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [error, setError] = useState(false);

  // [Analysis] Implement intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

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
    <div 
      className={`${isCompact ? 'w-1/3 max-w-[200px]' : 'w-full'}`}
    >
      <AspectRatio ratio={isCompact ? 4/3 : 16/9}>
        <div 
          id={`news-image-${title.replace(/\s+/g, '-')}`}
          className="relative h-full overflow-hidden rounded-t-lg"
        >
          {/* Loading shimmer effect */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 
              image-loading-shimmer
              ${isLoading || !isIntersecting ? 'opacity-100' : 'opacity-0'} 
              transition-opacity duration-300
            `} 
          />
          
          {isIntersecting && !error && (
            <img
              src={imageUrl}
              alt={title}
              className={`
                object-cover w-full h-full transition-all duration-300 
                group-hover:scale-105 group-hover:brightness-110
                ${isLoading ? 'opacity-0' : 'opacity-100'}
              `}
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError(true);
              }}
            />
          )}

          {/* Enhanced hover overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isFeatured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge 
                variant="outline" 
                className="bg-siso-red/10 text-siso-red border-none text-xs font-semibold px-2 py-1"
              >
                Featured
              </Badge>
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
};
