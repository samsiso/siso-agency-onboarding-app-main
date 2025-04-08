
import { useState } from 'react';
import { CheckCircle, Circle, Settings, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  timeEstimate?: number; // in days
  included: boolean;
  category?: 'mvp' | 'advanced' | 'premium';
}

interface FeatureSelectionProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  readOnly?: boolean;
  showPricing?: boolean;
  showTimeEstimate?: boolean;
  showCategories?: boolean;
}

export const FeatureSelection = ({ 
  features, 
  onChange,
  readOnly = false,
  showPricing = false,
  showTimeEstimate = true,
  showCategories = true
}: FeatureSelectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const toggleFeature = (featureId: string) => {
    if (readOnly) return;
    
    const updatedFeatures = features.map(feature => 
      feature.id === featureId 
        ? { ...feature, included: !feature.included } 
        : feature
    );
    
    onChange(updatedFeatures);
  };
  
  // Group features by category if showing categories
  const getFeaturesToDisplay = () => {
    if (!showCategories) return features;
    
    return activeCategory 
      ? features.filter(feature => feature.category === activeCategory)
      : features;
  };
  
  // Get unique categories from features
  const categories = showCategories
    ? Array.from(new Set(features.map(feature => feature.category)))
        .filter(Boolean)
        .sort((a, b) => {
          const order = { mvp: 0, advanced: 1, premium: 2 };
          return order[a as keyof typeof order] - order[b as keyof typeof order];
        })
    : [];
  
  // Helper to get category display name
  const getCategoryDisplayName = (category: string | undefined) => {
    switch(category) {
      case 'mvp': return 'Core Features (MVP)';
      case 'advanced': return 'Advanced Features';
      case 'premium': return 'Premium Features';
      default: return 'Additional Features';
    }
  };
  
  // Helper to get category color
  const getCategoryColor = (category: string | undefined) => {
    switch(category) {
      case 'mvp': return 'bg-siso-orange/20 text-siso-orange';
      case 'advanced': return 'bg-blue-500/20 text-blue-400';
      case 'premium': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-siso-text/20 text-siso-text';
    }
  };
  
  return (
    <div className="rounded-lg border border-siso-text/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-siso-orange" />
        <h3 className="text-lg font-semibold text-white">
          {activeCategory 
            ? getCategoryDisplayName(activeCategory)
            : "All Features"}
        </h3>
      </div>
      
      {showCategories && categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "text-sm px-3 py-1 rounded-full transition-all",
              !activeCategory 
                ? "bg-siso-orange/20 text-siso-orange" 
                : "bg-siso-text/5 text-siso-text hover:bg-siso-text/10"
            )}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as string)}
              className={cn(
                "text-sm px-3 py-1 rounded-full transition-all",
                activeCategory === category
                  ? getCategoryColor(category as string)
                  : "bg-siso-text/5 text-siso-text hover:bg-siso-text/10"
              )}
            >
              {getCategoryDisplayName(category as string)}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {getFeaturesToDisplay().map((feature) => (
          <div 
            key={feature.id}
            onClick={() => toggleFeature(feature.id)}
            className={cn(
              "rounded-lg border border-siso-text/5 bg-black/30 p-3 transition-all duration-200",
              feature.included ? "border-siso-orange/30" : "",
              !readOnly && "cursor-pointer hover:bg-black/40"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {feature.included ? (
                  <CheckCircle className="h-5 w-5 text-siso-orange" />
                ) : (
                  <Circle className="h-5 w-5 text-siso-text/50" />
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">{feature.name}</h4>
                    {feature.category && showCategories && (
                      <span className={cn(
                        "ml-2 text-xs px-2 py-0.5 rounded-full",
                        getCategoryColor(feature.category)
                      )}>
                        {feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showTimeEstimate && feature.timeEstimate && (
                      <span className="flex items-center text-sm text-siso-text/80">
                        <Clock className="h-3 w-3 mr-1" />
                        {feature.timeEstimate} {feature.timeEstimate === 1 ? 'day' : 'days'}
                      </span>
                    )}
                    
                    {showPricing && (
                      <span className="text-sm text-siso-orange">+£{feature.price}</span>
                    )}
                  </div>
                </div>
                
                <p className="mt-1 text-sm text-siso-text">{feature.description}</p>
                
                {feature.timeEstimate && feature.timeEstimate > 5 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-2 flex items-center text-xs text-siso-text/70">
                          <Info className="h-3 w-3 mr-1" />
                          This feature requires additional development time
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">This feature adds {feature.timeEstimate} days to the development timeline</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
