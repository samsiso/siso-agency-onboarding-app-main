
import { useState } from 'react';
import { CheckCircle, Circle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  included: boolean;
}

interface FeatureSelectionProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  readOnly?: boolean;
}

export const FeatureSelection = ({ 
  features, 
  onChange,
  readOnly = false
}: FeatureSelectionProps) => {
  const toggleFeature = (featureId: string) => {
    if (readOnly) return;
    
    const updatedFeatures = features.map(feature => 
      feature.id === featureId 
        ? { ...feature, included: !feature.included } 
        : feature
    );
    
    onChange(updatedFeatures);
  };
  
  return (
    <div className="rounded-lg border border-siso-text/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-siso-orange" />
        <h3 className="text-lg font-semibold text-white">Additional Features</h3>
      </div>
      
      <div className="space-y-3">
        {features.map((feature) => (
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
                  <h4 className="font-medium text-white">{feature.name}</h4>
                  <span className="text-sm text-siso-orange">+£{feature.price}</span>
                </div>
                <p className="mt-1 text-sm text-siso-text">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
