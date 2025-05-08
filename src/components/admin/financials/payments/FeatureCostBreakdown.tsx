import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Shield, 
  PiggyBank, 
  Users, 
  ArrowLeftRight, 
  AlertCircle 
} from 'lucide-react';

import { 
  fetchProjectFeatures, 
  getFeatureCostsByCategory, 
  getTotalFeatureCost,
  ProjectFeature 
} from '@/utils/financial/features';

interface FeatureCostBreakdownProps {
  projectId: string | null;
}

export function FeatureCostBreakdown({ projectId }: FeatureCostBreakdownProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const { data: features, isLoading, error } = useQuery({
    queryKey: ['projectFeatures', projectId],
    queryFn: () => {
      if (!projectId) {
        return Promise.resolve([]);
      }
      return fetchProjectFeatures(projectId);
    },
    enabled: !!projectId,
  });
  
  if (isLoading) {
    return (
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Feature Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange"></div>
            <p className="ml-3 text-white">Loading feature costs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !features) {
    return (
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Feature Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-siso-red" />
            <p className="text-white">There was an error loading feature data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const categorizedFeatures = getFeatureCostsByCategory(features);
  const totalCost = getTotalFeatureCost(features);
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Trading & Transactions':
        return <ArrowLeftRight className="h-5 w-5 text-blue-400" />;
      case 'Security & Trust':
        return <Shield className="h-5 w-5 text-green-400" />;
      case 'Staking & Earning':
        return <PiggyBank className="h-5 w-5 text-purple-400" />;
      case 'Community & Engagement':
        return <Users className="h-5 w-5 text-orange-400" />;
      default:
        return <Layers className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Trading & Transactions':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-blue-400/30';
      case 'Security & Trust':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/10 border-green-400/30';
      case 'Staking & Earning':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 border-purple-400/30';
      case 'Community & Engagement':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-400/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/10 border-gray-400/30';
    }
  };
  
  const getCategoryProgressColor = (category: string) => {
    switch (category) {
      case 'Trading & Transactions':
        return 'bg-blue-500';
      case 'Security & Trust':
        return 'bg-green-500';
      case 'Staking & Earning':
        return 'bg-purple-500';
      case 'Community & Engagement':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (categorizedFeatures.length === 0) {
    return (
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Feature Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-white">No feature cost data available.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">Feature Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categorizedFeatures.map(({ category, features, totalCost: categoryTotal }) => {
          const percentage = totalCost > 0 ? (categoryTotal / totalCost) * 100 : 0;
          const isExpanded = expandedCategories[category] || false;
          
          return (
            <div key={category} className="space-y-2">
              <div 
                className={`p-4 rounded-lg ${getCategoryGradient(category)} cursor-pointer`} 
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category)}
                    <div>
                      <h3 className="font-medium text-white">{category}</h3>
                      <p className="text-sm text-white/70">{features.length} features</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-white">£{categoryTotal.toFixed(2)}</p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {isExpanded ? 
                        <ChevronUp className="h-5 w-5 text-white/70" /> : 
                        <ChevronDown className="h-5 w-5 text-white/70" />
                      }
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Percentage of Total Cost</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${getCategoryProgressColor(category)}`}
                  />
                </div>
              </div>
              
              {/* Feature Details */}
              {isExpanded && (
                <div className="pl-4 space-y-2 mt-2">
                  {features.map((feature: ProjectFeature) => (
                    <div 
                      key={feature.id} 
                      className="flex items-center justify-between p-3 border-b border-purple-400/10 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-white">{feature.name}</p>
                        <p className="text-sm text-white/60">{feature.description || 'No description'}</p>
                      </div>
                      <p className="font-medium text-white ml-4">£{(feature.cost || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Total Section */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-purple-400/30">
          <h3 className="font-semibold text-white text-lg">Total Feature Cost</h3>
          <p className="font-bold text-white text-lg">£{totalCost.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
