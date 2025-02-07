
import { motion } from 'framer-motion';
import { NewsCardMedia } from './NewsCardMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus } from 'lucide-react';

interface FeaturedNewsHeroProps {
  item: any;
  onGenerateSummary: (id: string) => void;
}

export const FeaturedNewsHero = ({ item, onGenerateSummary }: FeaturedNewsHeroProps) => {
  if (!item) return null;

  // [Analysis] Enhanced visual hierarchy with gradient overlay and backdrop blur
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-xl overflow-hidden mb-8"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-siso-red/20 via-siso-orange/10 to-transparent opacity-75" />
      <div className="absolute inset-0 bg-gradient-radial from-siso-red/10 via-siso-orange/5 to-transparent opacity-50" />
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-siso-bg-alt/50 backdrop-blur-sm border border-siso-border rounded-xl">
        <div className="relative aspect-[16/9] lg:aspect-[4/3]">
          <NewsCardMedia
            imageUrl={item.image_url}
            title={item.title}
            isFeatured={true}
          />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="bg-siso-red/10 text-siso-red border-none"
              >
                Featured
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-siso-orange/10 text-siso-orange border-none"
              >
                {item.category}
              </Badge>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-siso-text-bold leading-tight">
              {item.title}
            </h2>

            <p className="text-siso-text/80 text-base sm:text-lg line-clamp-3 lg:line-clamp-4">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => onGenerateSummary(item.id)}
              className="bg-siso-bg border-siso-border hover:bg-siso-red/10 hover:text-siso-red"
            >
              Generate AI Summary
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-siso-red/10 hover:text-siso-red"
              >
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-siso-red/10 hover:text-siso-red"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
