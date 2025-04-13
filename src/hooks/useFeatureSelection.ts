
import { useState, useCallback } from 'react';
import { FeatureCategory } from '@/models/plan/features';

export function useFeatureSelection(
  modelFacingCategories: FeatureCategory[],
  agencyFacingCategories: FeatureCategory[],
  sharedFeatureCategories: FeatureCategory[]
) {
  // State for selected features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Function to select recommended features
  const handleSelectRecommended = useCallback(() => {
    const recommendedFeatures: string[] = [];
    
    // Collect all recommended features
    const allCategories = [
      ...modelFacingCategories, 
      ...agencyFacingCategories, 
      ...sharedFeatureCategories
    ];
    
    allCategories.forEach(category => {
      category.features.forEach(feature => {
        if (feature.recommended) {
          recommendedFeatures.push(feature.name);
        }
      });
    });
    
    setSelectedFeatures(recommendedFeatures);
    return recommendedFeatures;
  }, [modelFacingCategories, agencyFacingCategories, sharedFeatureCategories]);
  
  return {
    selectedFeatures,
    setSelectedFeatures,
    handleSelectRecommended
  };
}
