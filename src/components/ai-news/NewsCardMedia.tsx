import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface NewsCardMediaProps {
  imageUrl: string;
  title: string;
  isFeatured?: boolean;
}

export const NewsCardMedia = ({ imageUrl, title, isFeatured = false }: NewsCardMediaProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full ${isFeatured ? 'sm:w-full' : 'sm:w-1/4'} max-w-[500px] mx-auto sm:mx-0`}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border border-siso-border group">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
        />
        {isFeatured && (
          <div className="absolute top-2 left-2">
            <Badge 
              variant="outline" 
              className="bg-siso-red/10 text-siso-red border-none text-xs font-semibold px-2 py-1"
            >
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};