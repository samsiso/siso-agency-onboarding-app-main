
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FeatureCategory } from '@/models/plan/features';

interface FeatureCategoryCardProps {
  category: FeatureCategory;
  active: boolean;
  selectedFeatureCount: number;
  totalTimeEstimate: number;
  onClick: () => void;
}

export const FeatureCategoryCard: React.FC<FeatureCategoryCardProps> = ({
  category,
  active,
  selectedFeatureCount,
  totalTimeEstimate,
  onClick,
}) => {
  // Format time display
  const formatTimeEstimate = (days: number) => {
    if (days < 1) {
      return `${Math.round(days * 24)} hrs`;
    }
    return days === 1 ? `${days} day` : `${days} days`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-all",
        active
          ? "bg-siso-orange/10 border-siso-orange/30"
          : "bg-black/30 border-siso-text/10 hover:bg-black/40"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "rounded-full p-1.5",
            active ? "bg-siso-orange/20" : "bg-black/30"
          )}>
            {category.icon}
          </div>
          <h3 className="font-medium text-white">{category.name}</h3>
        </div>
        
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform",
          active ? "text-siso-orange rotate-90" : "text-siso-text"
        )} />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Badge 
          variant={selectedFeatureCount > 0 ? "success" : "outline"} 
          className="text-xs"
        >
          {selectedFeatureCount} selected
        </Badge>
        
        {totalTimeEstimate > 0 && (
          <div className="flex items-center gap-1 text-xs text-siso-text">
            <Clock className="h-3 w-3" />
            {formatTimeEstimate(totalTimeEstimate)}
          </div>
        )}
      </div>
    </motion.div>
  );
};
