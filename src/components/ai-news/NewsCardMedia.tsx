
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${isCompact ? 'w-1/3 max-w-[200px]' : 'w-full'}`}
    >
      <div 
        id={`news-image-${title.replace(/\s+/g, '-')}`}
        className={`relative ${isCompact ? 'aspect-[4/3]' : 'aspect-video'} overflow-hidden rounded-lg border border-siso-border group`}
      >
        {/* Loading placeholder */}
        <div className={`absolute inset-0 bg-siso-bg-alt animate-pulse ${isLoading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />
        
        {isIntersecting && (
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className={`
              object-cover w-full h-full transition-all duration-300 
              group-hover:scale-105 group-hover:brightness-110
              ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        )}

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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};
