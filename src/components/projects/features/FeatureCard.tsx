
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FeatureCardProps } from '@/types/feature.types';

export function FeatureCard({ 
  feature, 
  onViewDetails 
}: FeatureCardProps) {
  const getDifficultyColor = () => {
    switch (feature.difficulty) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-red-500/20 text-red-400';
    }
  };

  const getPriorityColor = () => {
    switch (feature.priority) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div 
      className="bg-black/20 border border-siso-text/10 p-6 rounded-lg 
      hover:bg-black/30 transition-colors duration-300 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          {feature.title}
        </h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className={getDifficultyColor()}>
            {feature.difficulty}
          </Badge>
          <Badge variant="outline" className={getPriorityColor()}>
            {feature.priority}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2">
        {feature.description || 'No description provided'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-blue-400">
          £{feature.estimated_cost.toLocaleString()}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(feature)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
