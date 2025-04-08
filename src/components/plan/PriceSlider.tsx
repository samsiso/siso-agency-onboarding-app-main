
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  onChange: (value: number) => void;
}

export const PriceSlider = ({ minPrice, maxPrice, currentPrice, onChange }: PriceSliderProps) => {
  // Calculate the percentage of the current price
  const percentage = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    onChange(value[0]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-xl font-semibold text-white mr-2">Plan Investment</h3>
        </div>
        <motion.div 
          key={currentPrice}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center text-2xl font-bold text-siso-orange"
        >
          <DollarSign className="h-5 w-5" />
          {currentPrice}
        </motion.div>
      </div>
      
      <Slider
        defaultValue={[minPrice]}
        min={minPrice}
        max={maxPrice}
        step={(maxPrice - minPrice) / 20}
        value={[currentPrice]}
        onValueChange={handleSliderChange}
        className="my-4"
      />
      
      <div className="flex items-center justify-between text-sm text-siso-text">
        <div>MVP</div>
        <div>Standard</div>
        <div>Premium</div>
        <div>Enterprise</div>
      </div>
      
      <div className="h-2 bg-gradient-to-r from-siso-orange/30 via-siso-orange/60 to-siso-orange rounded-full relative">
        <motion.div 
          className="absolute -top-1 h-4 w-4 rounded-full bg-white border-2 border-siso-orange"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
          initial={false}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
      </div>
    </div>
  );
};
