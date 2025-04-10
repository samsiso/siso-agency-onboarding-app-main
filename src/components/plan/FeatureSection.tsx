
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { featureCategories } from '@/data/plan/featureData';
import { EnhancedFeatureSelection } from './EnhancedFeatureSelection';

interface FeatureSectionProps {
  onFinalizeFeatures: (selectedFeatures: string[]) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  onFinalizeFeatures
}) => {
  return (
    <motion.section 
      id="features-section" 
      className="space-y-6 pt-6 pb-40" // Increased bottom padding to accommodate fixed Next Steps
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
    >
      <GradientHeading className="text-2xl font-bold" variant="primary">
        Customize Your Features
      </GradientHeading>
      
      <p className="text-siso-text max-w-3xl">
        Select the features that matter most to your agency. Each choice adds specific capabilities 
        to your platform and influences your timeline. Our recommendation engine highlights
        features with proven ROI for OnlyFans agencies.
      </p>
      
      <EnhancedFeatureSelection 
        featureCategories={featureCategories}
        onFinalizeFeatures={onFinalizeFeatures}
      />
    </motion.section>
  );
};
