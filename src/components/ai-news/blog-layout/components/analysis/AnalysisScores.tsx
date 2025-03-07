
import React from 'react';
import { Progress } from '@/components/ui/progress';

// [Analysis] These components render confidence and relevance scores
interface AnalysisScoreProps {
  value: number;
  label: string;
}

export const AnalysisScore = ({ value, label }: AnalysisScoreProps) => {
  if (!value && value !== 0) return null;
  
  // Handle both percentage and decimal formats
  const normalizedValue = value <= 1 ? value * 100 : value;
  
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{Math.round(normalizedValue)}%</span>
      </div>
      <Progress 
        value={normalizedValue} 
        className="h-1.5" 
        indicatorClassName={normalizedValue > 70 ? "bg-green-500" : normalizedValue > 40 ? "bg-amber-500" : "bg-red-500"}
      />
    </div>
  );
};
