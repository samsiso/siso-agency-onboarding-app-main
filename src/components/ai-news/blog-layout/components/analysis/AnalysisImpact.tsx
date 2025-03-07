
import React from 'react';
import { TrendingUp, Briefcase } from 'lucide-react';

// [Analysis] These components render market impact and business implications
interface AnalysisImpactProps {
  content: string;
  type: 'market' | 'business';
}

export const AnalysisImpact = ({ content, type }: AnalysisImpactProps) => {
  if (!content) return null;
  
  const Icon = type === 'market' ? TrendingUp : Briefcase;
  const title = type === 'market' ? 'Market Impact' : 'Business';
  
  return (
    <div>
      <h4 className="text-xs text-gray-400 mb-1 flex items-center gap-1">
        <Icon className="h-3 w-3" /> {title}
      </h4>
      <p className="text-sm line-clamp-2">{content}</p>
    </div>
  );
};
