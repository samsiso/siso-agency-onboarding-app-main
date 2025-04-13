
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building, CheckCircle, Info, ArrowRight, X, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureCategory } from '@/models/plan/features';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserFacingFeaturesProps {
  modelFacingCategories: FeatureCategory[];
  agencyFacingCategories: FeatureCategory[];
  sharedFeatureCategories: FeatureCategory[];
  onFeatureSelect: (selectedFeatures: string[]) => void;
  onCustomize: () => void;
}

interface FeatureDetailProps {
  id: string;
  name: string;
  description: string;
  tier: 'mvp' | 'advanced' | 'premium';
  recommended?: boolean;
  category: string;
  categoryName?: string;
  timeEstimate?: number;
  roi?: string;
}

export const UserFacingFeatures: React.FC<UserFacingFeaturesProps> = ({
  modelFacingCategories,
  agencyFacingCategories,
  sharedFeatureCategories,
  onFeatureSelect,
  onCustomize
}) => {
  const [activeTab, setActiveTab] = useState('both');
  const [featureDetail, setFeatureDetail] = useState<FeatureDetailProps | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleSelectRecommended = () => {
    const recommendedFeatures: string[] = [];
    
    // Collect all recommended features
    const allCategories = [...modelFacingCategories, ...agencyFacingCategories, ...sharedFeatureCategories];
    allCategories.forEach(category => {
      category.features.forEach(feature => {
        if (feature.recommended) {
          recommendedFeatures.push(feature.name);
        }
      });
    });
    
    onFeatureSelect(recommendedFeatures);
  };
  
  // Count features by tier
  const countFeaturesByTier = (tier: 'mvp' | 'advanced' | 'premium') => {
    let count = 0;
    const allCategories = [...modelFacingCategories, ...agencyFacingCategories, ...sharedFeatureCategories];
    
    allCategories.forEach(category => {
      category.features.forEach(feature => {
        if (feature.tier === tier) {
          count++;
        }
      });
    });
    
    return count;
  };

  const handleShowFeatureDetail = (feature: any, categoryName: string) => {
    setFeatureDetail({
      ...feature,
      categoryName
    });
    setIsDetailOpen(true);
  };
  
  const mvpFeatureCount = countFeaturesByTier('mvp');
  const advancedFeatureCount = countFeaturesByTier('advanced');
  const premiumFeatureCount = countFeaturesByTier('premium');
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-black/20 backdrop-blur-sm border border-siso-text/10 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Comprehensive Agency Management System</h3>
          
          <p className="text-siso-text mb-6">
            Our platform is organized into model-facing and agency-facing features, ensuring each user gets exactly what they need. The MVP tier includes {mvpFeatureCount} essential features to get you started immediately.
          </p>
          
          {/* Tab selection for user-facing perspective */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-black/30 border border-siso-text/10">
              <TabsTrigger value="both" className="data-[state=active]:bg-siso-orange data-[state=active]:text-white">
                All Features
              </TabsTrigger>
              <TabsTrigger value="model" className="data-[state=active]:bg-siso-orange data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Model-Facing
              </TabsTrigger>
              <TabsTrigger value="agency" className="data-[state=active]:bg-siso-orange data-[state=active]:text-white">
                <Building className="h-4 w-4 mr-2" />
                Agency-Facing
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="both" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Model Features Column */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-full bg-siso-orange/20">
                      <Users className="h-5 w-5 text-siso-orange" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Model-Facing Features</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modelFacingCategories.map((category) => (
                      <FeatureCategoryCard 
                        key={category.id} 
                        category={category}
                        onShowDetail={(feature) => handleShowFeatureDetail(feature, category.name)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Agency Features Column */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-full bg-siso-orange/20">
                      <Building className="h-5 w-5 text-siso-orange" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Agency-Facing Features</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agencyFacingCategories.map((category) => (
                      <FeatureCategoryCard 
                        key={category.id} 
                        category={category}
                        onShowDetail={(feature) => handleShowFeatureDetail(feature, category.name)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Shared Features */}
              {sharedFeatureCategories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Shared Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sharedFeatureCategories.map((category) => (
                      <FeatureCategoryCard 
                        key={category.id} 
                        category={category}
                        onShowDetail={(feature) => handleShowFeatureDetail(feature, category.name)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="model" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modelFacingCategories.map((category) => (
                  <FeatureCategoryCard 
                    key={category.id} 
                    category={category}
                    onShowDetail={(feature) => handleShowFeatureDetail(feature, category.name)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="agency" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agencyFacingCategories.map((category) => (
                  <FeatureCategoryCard 
                    key={category.id} 
                    category={category}
                    onShowDetail={(feature) => handleShowFeatureDetail(feature, category.name)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Feature tier breakdown */}
          <div className="mt-8 p-4 bg-black/30 border border-siso-text/10 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Features By Tier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-black/40 border border-siso-text/20 rounded-lg">
                <h4 className="text-siso-orange font-medium flex items-center">
                  <span className="h-2 w-2 bg-siso-orange rounded-full mr-2"></span>
                  MVP Tier (Free)
                </h4>
                <p className="text-sm text-siso-text mt-1">
                  {mvpFeatureCount} essential features included in the base package
                </p>
              </div>
              
              <div className="p-3 bg-black/40 border border-siso-text/20 rounded-lg">
                <h4 className="text-siso-orange font-medium flex items-center">
                  <span className="h-2 w-2 bg-siso-orange rounded-full mr-2"></span>
                  Advanced Tier
                </h4>
                <p className="text-sm text-siso-text mt-1">
                  {advancedFeatureCount} enhanced features for optimal efficiency
                </p>
              </div>
              
              <div className="p-3 bg-black/40 border border-siso-text/20 rounded-lg">
                <h4 className="text-siso-orange font-medium flex items-center">
                  <span className="h-2 w-2 bg-siso-orange rounded-full mr-2"></span>
                  Premium Tier
                </h4>
                <p className="text-sm text-siso-text mt-1">
                  {premiumFeatureCount} premium capabilities for maximum growth
                </p>
              </div>
            </div>
          </div>
          
          {/* Role-based access explanation */}
          <div className="mt-6 p-4 bg-siso-orange/10 border border-siso-orange/30 rounded-lg">
            <h3 className="text-white font-semibold mb-2">How It Works</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                <span className="text-sm text-siso-text">
                  <strong className="text-white">Role-Based Access:</strong> When users log in, they see only the features relevant to their role—models get their dashboard, agency staff get theirs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                <span className="text-sm text-siso-text">
                  <strong className="text-white">User-Friendly:</strong> The design is simple, so even non-tech-savvy users can navigate it easily.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                <span className="text-sm text-siso-text">
                  <strong className="text-white">Scalable:</strong> Built to grow with your agency, including future integrations like SMS and WhatsApp.
                </span>
              </li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onCustomize}
              className="border-siso-text/20"
            >
              Customize Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSelectRecommended}
              className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
            >
              Select Recommended Features
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {featureDetail?.name}
                {featureDetail?.recommended && (
                  <Badge className="ml-2 bg-siso-orange text-white">Recommended</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mt-1 mr-2",
                      featureDetail?.tier === 'mvp' && "bg-siso-orange/10 text-siso-orange border-siso-orange/20",
                      featureDetail?.tier === 'advanced' && "bg-blue-500/10 text-blue-400 border-blue-400/20",
                      featureDetail?.tier === 'premium' && "bg-purple-500/10 text-purple-400 border-purple-400/20"
                    )}
                  >
                    {featureDetail?.tier === 'mvp' && 'MVP Tier'}
                    {featureDetail?.tier === 'advanced' && 'Advanced Tier'}
                    {featureDetail?.tier === 'premium' && 'Premium Tier'}
                  </Badge>
                  
                  <Badge variant="outline" className="mt-1">
                    {featureDetail?.categoryName}
                  </Badge>
                </div>

                {featureDetail?.timeEstimate && featureDetail.timeEstimate > 0 && (
                  <div className="text-sm text-siso-text flex items-center">
                    <Clock className="h-4 w-4 mr-1 opacity-70" />
                    <span>+{featureDetail.timeEstimate} {featureDetail.timeEstimate === 1 ? 'day' : 'days'}</span>
                  </div>
                )}
              </div>
              
              <p className="text-siso-text">{featureDetail?.description}</p>
              
              {featureDetail?.roi && (
                <div className="bg-siso-orange/10 border border-siso-orange/20 rounded-md p-4 mt-4">
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                    <Target className="h-4 w-4 text-siso-orange" />
                    Business Impact
                  </h4>
                  <p className="text-sm text-siso-text">{featureDetail.roi}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

// Sub-component for feature category card
const FeatureCategoryCard: React.FC<{ 
  category: FeatureCategory;
  onShowDetail: (feature: any) => void;
}> = ({ category, onShowDetail }) => {
  const mvpFeatures = category.features.filter(f => f.tier === 'mvp');
  const advancedFeatures = category.features.filter(f => f.tier === 'advanced');
  const premiumFeatures = category.features.filter(f => f.tier === 'premium');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-siso-text/10 rounded-lg bg-black/30 overflow-hidden h-full flex flex-col"
    >
      <div className="p-4 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-black/40">
              {category.icon}
            </div>
            <h4 className="font-medium text-white">{category.name}</h4>
          </div>
          
          {mvpFeatures.length > 0 && (
            <Badge variant="outline" className="bg-siso-orange/10 text-siso-orange border-siso-orange/20">
              MVP Included
            </Badge>
          )}
        </div>
        
        {category.description && (
          <p className="text-sm text-siso-text mt-2">{category.description}</p>
        )}
        
        <div className="mt-3 space-y-2">
          {mvpFeatures.map(feature => (
            <FeatureItem 
              key={feature.id} 
              name={feature.name}
              description={feature.description}
              tier="mvp"
              recommended={feature.recommended}
              onClick={() => onShowDetail({...feature, category: category.id})}
            />
          ))}
          
          {advancedFeatures.length > 0 && (
            <div className="mt-4 pt-3 border-t border-siso-text/10">
              <span className="text-xs text-siso-text/70">Advanced Features:</span>
              {advancedFeatures.map(feature => (
                <FeatureItem 
                  key={feature.id} 
                  name={feature.name}
                  description={feature.description}
                  tier="advanced"
                  recommended={feature.recommended}
                  onClick={() => onShowDetail({...feature, category: category.id})}
                />
              ))}
            </div>
          )}
          
          {premiumFeatures.length > 0 && (
            <div className="mt-4 pt-3 border-t border-siso-text/10">
              <span className="text-xs text-siso-text/70">Premium Features:</span>
              {premiumFeatures.map(feature => (
                <FeatureItem 
                  key={feature.id} 
                  name={feature.name}
                  description={feature.description}
                  tier="premium"
                  recommended={feature.recommended}
                  onClick={() => onShowDetail({...feature, category: category.id})}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Sub-component for individual feature items
const FeatureItem: React.FC<{ 
  name: string; 
  description: string;
  tier: 'mvp' | 'advanced' | 'premium';
  recommended?: boolean;
  onClick: () => void;
}> = ({ name, description, tier, recommended, onClick }) => {
  return (
    <motion.div 
      className={cn(
        "flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-black/30 transition-colors",
        tier === 'mvp' ? "bg-black/20" : "bg-black/10"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CheckCircle className={cn(
        "h-4 w-4 shrink-0 mt-0.5",
        tier === 'mvp' ? "text-siso-orange" : "text-siso-text/50"
      )} />
      
      <div>
        <div className="flex items-center gap-1">
          <span className={cn(
            "font-medium text-sm",
            tier === 'mvp' ? "text-white" : "text-siso-text/80"
          )}>
            {name}
          </span>
          
          {recommended && (
            <Badge variant="outline" className="text-xs bg-siso-orange/10 text-siso-orange border-0 py-0 h-4">
              Recommended
            </Badge>
          )}
          
          {tier !== 'mvp' && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs py-0 h-4 border-0",
                tier === 'advanced' 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "bg-purple-500/10 text-purple-400"
              )}
            >
              {tier === 'advanced' ? 'Advanced' : 'Premium'}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mt-0.5">
          <Button variant="link" className="text-xs text-siso-orange p-0 h-auto" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>
            <Info className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
