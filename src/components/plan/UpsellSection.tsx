
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { UpsellFeatureCard } from './UpsellFeatureCard';
import { featureCategories } from '@/data/plan/featureData';
import { UPSELL_FEATURE_IDS } from '@/hooks/useRecommendedPackage';

interface UpsellSectionProps {
  selectedFeatureIds: string[];
  onAddFeature: (id: string) => void;
}

export function UpsellSection({ selectedFeatureIds, onAddFeature }: UpsellSectionProps) {
  const getUpsellFeatures = () => {
    const upsellFeatures = [];
    
    for (const featureId of UPSELL_FEATURE_IDS) {
      for (const category of featureCategories) {
        const feature = category.features.find(f => f.id === featureId);
        if (feature) {
          upsellFeatures.push({
            ...feature,
            categoryName: category.name
          });
          break;
        }
      }
    }
    
    return upsellFeatures;
  };
  
  const upsellFeatures = getUpsellFeatures();
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 border-t border-siso-text/10 pt-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-siso-orange" />
        <h3 className="text-lg font-semibold text-white">Recommended Upgrades</h3>
      </div>
      
      <p className="text-siso-text mb-4">
        Enhance your agency platform with these premium features for better performance and client satisfaction.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upsellFeatures.map(feature => (
          <UpsellFeatureCard
            key={feature.id}
            id={feature.id}
            name={feature.name}
            description={feature.description}
            category={feature.categoryName}
            onAdd={onAddFeature}
            isAdded={selectedFeatureIds.includes(feature.id)}
          />
        ))}
      </div>
    </motion.section>
  );
}
