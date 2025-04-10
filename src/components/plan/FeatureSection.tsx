
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <section id="features-section" className="space-y-4 pt-6">
      <EnhancedFeatureSelection 
        featureCategories={featureCategories}
        onFinalizeFeatures={onFinalizeFeatures}
      />
    </section>
  );
};
