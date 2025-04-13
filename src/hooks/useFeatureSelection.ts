
import { useState, useCallback } from 'react';
import { FeatureCategory } from '@/models/plan/features';

export interface CustomFeature {
  name: string;
  description: string;
}

export function useFeatureSelection(
  modelFacingCategories: FeatureCategory[],
  agencyFacingCategories: FeatureCategory[],
  sharedFeatureCategories: FeatureCategory[]
) {
  // State for selected features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // State for custom features
  const [customFeaturesList, setCustomFeaturesList] = useState<CustomFeature[]>([]);
  
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

  // Function to toggle a single feature by name
  const toggleFeature = useCallback((featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    );
  }, []);
  
  // Add a custom feature
  const addCustomFeature = useCallback((name: string, description: string) => {
    setCustomFeaturesList(prev => [...prev, { name, description }]);
    setSelectedFeatures(prev => [...prev, `Custom: ${name}`]);
  }, []);
  
  // Remove a custom feature
  const removeCustomFeature = useCallback((index: number) => {
    const featureToRemove = customFeaturesList[index];
    setCustomFeaturesList(prev => prev.filter((_, i) => i !== index));
    setSelectedFeatures(prev => prev.filter(f => f !== `Custom: ${featureToRemove.name}`));
  }, [customFeaturesList]);
  
  // Find a feature by name in all categories
  const findFeatureById = useCallback((featureId: string) => {
    const allCategories = [
      ...modelFacingCategories, 
      ...agencyFacingCategories, 
      ...sharedFeatureCategories
    ];
    
    for (const category of allCategories) {
      const feature = category.features.find(f => f.id === featureId);
      if (feature) return feature;
    }
    return null;
  }, [modelFacingCategories, agencyFacingCategories, sharedFeatureCategories]);
  
  // Find a feature by name in all categories
  const findFeatureByName = useCallback((featureName: string) => {
    const allCategories = [
      ...modelFacingCategories, 
      ...agencyFacingCategories, 
      ...sharedFeatureCategories
    ];
    
    for (const category of allCategories) {
      const feature = category.features.find(f => f.name === featureName);
      if (feature) return feature;
    }
    return null;
  }, [modelFacingCategories, agencyFacingCategories, sharedFeatureCategories]);
  
  return {
    selectedFeatures,
    setSelectedFeatures,
    handleSelectRecommended,
    toggleFeature,
    findFeatureById,
    findFeatureByName,
    customFeaturesList,
    addCustomFeature,
    removeCustomFeature
  };
}
