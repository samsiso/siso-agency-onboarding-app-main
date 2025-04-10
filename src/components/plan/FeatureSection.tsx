
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { featureCategories } from '@/data/plan/featureData';
import { FeatureIntroduction } from './FeatureIntroduction';
import { FeatureSearch } from './FeatureSearch';
import { FeatureCategoryList } from './FeatureCategoryList';
import { UpgradePrompt } from './UpgradePrompt';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';

interface FeatureSectionProps {
  onFinalizeFeatures: (selectedFeatures: string[]) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  onFinalizeFeatures
}) => {
  const {
    selectedFeatureIds,
    currentTier,
    searchQuery,
    selectedCategory,
    showUpgradePrompt,
    timeCalculation,
    selectedFeatureNames,
    setSearchQuery,
    setSelectedCategory,
    handleFeatureToggle,
    handleTierChange,
    setShowUpgradePrompt,
    getFilteredFeatures
  } = usePlanFeatures();

  return (
    <section id="features-section" className="space-y-4 pt-6">
      <GradientHeading 
        className="text-2xl font-bold" 
        variant="primary"
      >
        Customize Your Features
      </GradientHeading>
      
      <FeatureIntroduction 
        currentTier={currentTier}
        onTierChange={handleTierChange}
        selectedFeaturesCount={selectedFeatureIds.length}
        timeEstimate={{
          totalDays: timeCalculation.totalDays,
          additionalHours: timeCalculation.additionalHours
        }}
      />
      
      <FeatureSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="space-y-3">
        <FeatureCategoryList 
          categories={featureCategories}
          selectedCategory={selectedCategory}
          selectedFeatureIds={selectedFeatureIds}
          onFeatureToggle={handleFeatureToggle}
          getFilteredFeatures={getFilteredFeatures}
        />
      </div>
      
      <UpgradePrompt 
        show={showUpgradePrompt}
        onUpgrade={handleTierChange}
        onDismiss={() => setShowUpgradePrompt(false)}
      />
      
      <div className="mt-6">
        <Button 
          className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
          size="lg"
          onClick={() => onFinalizeFeatures(selectedFeatureNames)}
        >
          Finalize Feature Selection
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
