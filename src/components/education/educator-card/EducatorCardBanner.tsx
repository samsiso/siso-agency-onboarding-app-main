
import { motion } from 'framer-motion';
import { Crown, ImageOff } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

interface EducatorCardBannerProps {
  bannerUrl?: string;
  isFeatured?: boolean;
  onBannerLoad: () => void;
  onBannerError: () => void;
  bannerLoaded: boolean;
  bannerError: boolean;
}

export const EducatorCardBanner = ({
  bannerUrl,
  isFeatured,
  onBannerLoad,
  onBannerError,
  bannerLoaded,
  bannerError
}: EducatorCardBannerProps) => {
  return (
    <div className="relative h-40 w-full overflow-hidden">
      {bannerUrl ? (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: bannerLoaded ? 1 : 0,
            scale: bannerLoaded ? 1 : 1.1
          }}
          transition={{ duration: 0.5 }}
        >
          <AspectRatio ratio={16/5} className="h-full">
            {!bannerError ? (
              <img
                src={bannerUrl}
                alt="Channel banner"
                className="h-full w-full object-cover"
                onLoad={onBannerLoad}
                onError={onBannerError}
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 flex items-center justify-center">
                <ImageOff className="w-8 h-8 text-siso-text/30" />
              </div>
            )}
          </AspectRatio>
        </motion.div>
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {isFeatured && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border-siso-orange/30"
        >
          <Crown className="w-3 h-3 mr-1 text-siso-orange" />
          Featured Creator
        </Badge>
      )}
    </div>
  );
};

