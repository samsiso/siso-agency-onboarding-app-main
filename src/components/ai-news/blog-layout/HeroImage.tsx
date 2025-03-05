import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";
import { EnhancedNewsItem } from '@/types/blog';

// [Analysis] List of high-quality fallback images for AI news articles
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
];

interface HeroImageProps {
  article: EnhancedNewsItem;
}

export const HeroImage = ({ article }: HeroImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // [Analysis] Select a consistent fallback image based on article ID
  useEffect(() => {
    // Use image_url if available
    if (article.image_url) {
      setImageUrl(article.image_url);
      return;
    }
    
    // Otherwise, select a fallback image based on article hash
    const hashCode = article.id.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    const fallbackImage = FALLBACK_IMAGES[hashCode % FALLBACK_IMAGES.length];
    setImageUrl(`${fallbackImage}?w=1200&h=600&fit=crop&crop=focalpoint&auto=format&q=80`);
  }, [article.id, article.image_url]);

  if (!imageUrl) {
    return <Skeleton className="w-full h-80 rounded-lg" />;
  }

  return (
    <motion.div 
      className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={article.title}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          !imageLoaded && "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          if (!imageError && imageUrl !== FALLBACK_IMAGES[0]) {
            setImageError(true);
            setImageUrl(FALLBACK_IMAGES[0]);
          }
          setImageLoaded(true);
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
      
      {/* Source attribution */}
      {article.source && (
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
          Source: {article.source}
        </div>
      )}
    </motion.div>
  );
};
