
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { featureCategories } from '@/data/plan/featureData';
import { ClickThroughFeatureSelection } from './ClickThroughFeatureSelection';
import { RecommendedPackage } from './RecommendedPackage';
import { UpsellSection } from './UpsellSection';
import { useRecommendedPackage } from '@/hooks/useRecommendedPackage';

interface FeatureSectionProps {
  onFinalizeFeatures: (selectedFeatures: string[]) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  onFinalizeFeatures
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const recommendedPackage = useRecommendedPackage();
  
  const handleSelectRecommended = () => {
    const ids = recommendedPackage.selectRecommended();
    setSelectedFeatureIds(ids);
    onFinalizeFeatures(recommendedPackage.allFeatureNames);
  };
  
  const handleCustomize = () => {
    recommendedPackage.customizeFeatures();
    setShowCustomization(true);
  };
  
  const handleFinalizeCustomFeatures = (selectedFeatures: string[]) => {
    onFinalizeFeatures(selectedFeatures);
  };
  
  const handleAddUpsellFeature = (featureId: string) => {
    // Add to selected features
    if (!selectedFeatureIds.includes(featureId)) {
      const newSelectedFeatures = [...selectedFeatureIds, featureId];
      setSelectedFeatureIds(newSelectedFeatures);
      
      // Find feature name
      let featureName = '';
      for (const category of featureCategories) {
        const feature = category.features.find(f => f.id === featureId);
        if (feature) {
          featureName = feature.name;
          break;
        }
      }
      
      // Add to recommended features list
      recommendedPackage.addUpsellFeature(featureId);
      
      // Update finalized features
      onFinalizeFeatures([...recommendedPackage.allFeatureNames, featureName]);
    }
  };
  
  return (
    <motion.section 
      id="features-section" 
      className="space-y-6 pt-6 pb-48" // Increased bottom padding to accommodate fixed Next Steps
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
        to your platform and influences your timeline.
      </p>
      
      {!showCustomization && (
        <RecommendedPackage 
          onSelectRecommended={handleSelectRecommended}
          onCustomize={handleCustomize}
        />
      )}
      
      {showCustomization ? (
        <ClickThroughFeatureSelection 
          featureCategories={featureCategories}
          onFinalizeFeatures={handleFinalizeCustomFeatures}
        />
      ) : recommendedPackage.isRecommendedSelected && (
        <UpsellSection 
          selectedFeatureIds={selectedFeatureIds}
          onAddFeature={handleAddUpsellFeature}
        />
      )}
    </motion.section>
  );
};
