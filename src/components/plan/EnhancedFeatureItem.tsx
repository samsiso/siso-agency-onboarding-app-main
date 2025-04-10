
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureItem } from '@/models/plan/features';

interface EnhancedFeatureItemProps {
  feature: FeatureItem;
  isSelected: boolean;
  onToggle: () => void;
}

export const EnhancedFeatureItem: React.FC<EnhancedFeatureItemProps> = ({
  feature,
  isSelected,
  onToggle
}) => {
  // Format time display
  const formatTimeEstimate = (days: number) => {
    if (days < 1) {
      return `${Math.round(days * 24)} hours`;
    }
    return days === 1 ? `${days} day` : `${days} days`;
  };

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={onToggle}
        className={cn(
          "flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors mb-2",
          isSelected
            ? "bg-siso-orange/10 border border-siso-orange/30"
            : "bg-black/30 border border-siso-text/10 hover:bg-black/40"
        )}
      >
        <div className="mt-0.5 flex-shrink-0">
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-siso-orange" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-siso-text/50" />
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium text-white">{feature.name}</h4>
            
            <div className="flex items-center gap-2">
              {feature.timeEstimate > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={isSelected ? "success" : "outline"} 
                      className="flex items-center gap-1 bg-black/40"
                    >
                      <Clock className="h-3 w-3" />
                      {feature.timeEstimate < 1 
                        ? `+${Math.round(feature.timeEstimate * 24)} hrs` 
                        : `+${feature.timeEstimate} day${feature.timeEstimate !== 1 ? 's' : ''}`}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This feature adds {formatTimeEstimate(feature.timeEstimate)} to your timeline</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          <p className="text-sm text-siso-text mt-1">{feature.description}</p>
          
          {feature.recommended && (
            <div className="flex items-center gap-1 mt-2 text-xs text-siso-orange">
              <Info className="h-3 w-3" />
              <span>Recommended: {feature.roi || "Adds significant value to your platform"}</span>
            </div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
