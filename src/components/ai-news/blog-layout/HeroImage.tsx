import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";
import { EnhancedNewsItem } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Tag } from 'lucide-react';

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
  const [scrollY, setScrollY] = useState(0);

  // [Analysis] Handle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setImageUrl(`${fallbackImage}?w=1600&h=800&fit=crop&crop=focalpoint&auto=format&q=90`);
  }, [article.id, article.image_url]);

  if (!imageUrl) {
    return <Skeleton className="w-full h-96 rounded-lg" />;
  }

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden rounded-lg mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            !imageLoaded && "opacity-0"
          )}
          style={{ 
            transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0003})`,
            transformOrigin: 'center center'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!imageError && imageUrl !== FALLBACK_IMAGES[0]) {
              setImageError(true);
              setImageUrl(FALLBACK_IMAGES[0]);
            }
            setImageLoaded(true);
          }}
        />
      </div>
      
      {/* Glass overlay effect with article metadata */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/30 flex flex-col justify-end">
        <div className="p-6 md:p-10 backdrop-blur-sm bg-black/10 rounded-lg">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Tag className="h-3 w-3 mr-1" />
              {article.category || "AI News"}
            </Badge>
            
            {article.technical_complexity && (
              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {article.technical_complexity} complexity
              </Badge>
            )}
            
            {article.impact && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                {article.impact} impact
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            
            <span className="hidden sm:flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {article.source || "AI News"}
            </span>
            
            {article.estimated_reading_time && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-800/50 text-xs text-gray-300">
                {article.estimated_reading_time} min read
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
