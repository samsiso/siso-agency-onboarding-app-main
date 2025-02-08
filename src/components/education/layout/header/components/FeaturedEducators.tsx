
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Educator {
  id: string;
  name: string;
  channel_avatar_url: string;
  number_of_subscribers: number;
  specialization: string[];
}

interface FeaturedEducatorsProps {
  educators: Educator[] | undefined;
  isLoading: boolean;
}

export const FeaturedEducators = ({ educators, isLoading }: FeaturedEducatorsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {educators?.map((educator) => (
        <motion.div
          key={educator.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
        >
          <Avatar className="h-12 w-12 border-2 border-siso-orange/20">
            <AvatarImage src={educator.channel_avatar_url} alt={educator.name} />
            <AvatarFallback>{educator.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{educator.name}</h4>
            <p className="text-xs text-siso-text/60">
              {formatNumber(educator.number_of_subscribers)} subscribers
            </p>
            {educator.specialization && (
              <div className="flex flex-wrap gap-1 mt-1">
                {educator.specialization.slice(0, 2).map((spec) => (
                  <span
                    key={spec}
                    className="px-1.5 py-0.5 text-[10px] rounded-full bg-siso-orange/10 text-siso-orange"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-siso-text/40 group-hover:text-siso-orange transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};
