import { motion } from 'framer-motion';
import { EducatorCard } from './EducatorCard';
import { CommunityMember } from '../community/types';
import { GradientText } from '@/components/ui/gradient-text';
import { Star } from 'lucide-react';

interface FeaturedEducatorsProps {
  educators: CommunityMember[];
  onEducatorSelect: (educator: CommunityMember) => void;
}

export const FeaturedEducators = ({ educators, onEducatorSelect }: FeaturedEducatorsProps) => {
  // [Analysis] Only show first 4 featured educators in 2x2 grid
  const featuredEducators = educators
    .filter(educator => educator.is_featured)
    .slice(0, 4);

  if (featuredEducators.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-6 h-6 text-siso-orange" />
        <GradientText
          colors={["#FF5722", "#FFA726"]}
          className="text-2xl font-bold"
        >
          Featured Educators
        </GradientText>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {featuredEducators.map((educator) => (
          <EducatorCard
            key={educator.id}
            educator={educator}
            onClick={() => onEducatorSelect(educator)}
            className="h-full"
          />
        ))}
      </motion.div>
    </section>
  );
};