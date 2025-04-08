
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  onChange: (value: number) => void;
}

export const PriceSlider = ({
  minPrice,
  maxPrice,
  currentPrice,
  onChange
}: PriceSliderProps) => {
  const [value, setValue] = useState<number[]>([currentPrice]);
  
  // Calculate percentage for gradient and labels
  const percentage = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
  
  // When currentPrice changes externally, update the slider
  useEffect(() => {
    setValue([currentPrice]);
  }, [currentPrice]);
  
  const handleChange = (newValue: number[]) => {
    setValue(newValue);
    onChange(newValue[0]);
  };
  
  // Pricing tiers for the marks
  const pricingTiers = [
    { value: minPrice, label: 'MVP' },
    { value: minPrice + ((maxPrice - minPrice) / 3), label: 'Standard' },
    { value: minPrice + (2 * (maxPrice - minPrice) / 3), label: 'Premium' },
    { value: maxPrice, label: 'Enterprise' }
  ];
  
  return (
    <div className="w-full">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-siso-text">Investment Level</span>
          <span className="text-lg font-bold text-siso-orange">£{value[0]}</span>
        </div>
        
        <div 
          className="h-2 w-full rounded-full overflow-hidden"
          style={{
            background: `linear-gradient(to right, 
              rgba(237, 137, 54, 0.2) 0%, 
              rgba(237, 137, 54, 0.4) 25%, 
              rgba(237, 137, 54, 0.6) 50%, 
              rgba(237, 137, 54, 0.8) 75%, 
              rgba(237, 137, 54, 1) 100%)`
          }}
        >
          <Slider
            value={value}
            min={minPrice}
            max={maxPrice}
            step={50}
            onValueChange={handleChange}
            className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
          />
        </div>
        
        <div className="flex justify-between text-xs text-siso-text/70">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={cn(
                "flex flex-col items-center",
                value[0] >= tier.value ? "text-siso-orange" : ""
              )}
            >
              <span className="font-medium">{tier.label}</span>
              <span>£{tier.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
