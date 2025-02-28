
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// [Analysis] Define clear interface for component props
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

  // [Analysis] Use intersection observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '100px',
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

  // [Analysis] Handle image loading and errors for better UX
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`${isCompact ? 'w-1/3 max-w-[200px]' : 'w-full'} ${className}`}>
      <AspectRatio ratio={isCompact ? 4 / 3 : 16 / 9}>
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
          
          {/* Actual image with lazy loading */}
          {isIntersecting && (
            <motion.img
              src={imageUrl}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isLoading ? 0 : 1 
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover bg-siso-bg-alt"
            />
          )}

          {/* Error fallback */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-siso-bg-alt text-siso-text-muted">
              <span className="text-sm">Image unavailable</span>
            </div>
          )}

          {/* Enhanced hover overlay with gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-80"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 0.8 }}
          />

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
