
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Clock, Calendar, Tag, Activity, CheckCircle, Circle, ArrowRight, Zap, Shield, Users, Coins, Sparkles } from 'lucide-react';
import { FeatureCardProps } from '@/types/feature.types';
import { cn } from '@/lib/utils';

export function FeatureCard({ 
  feature, 
  onViewDetails 
}: FeatureCardProps) {
  // Helper functions for styling based on feature properties
  const getDifficultyBadge = () => {
    switch (feature.difficulty) {
      case 'low': return <Badge variant="success">Low</Badge>;
      case 'medium': return <Badge variant="warning">Medium</Badge>;
      case 'high': return <Badge variant="destructive">High</Badge>;
    }
  };

  const getPriorityBadge = () => {
    switch (feature.priority) {
      case 'low': return <Badge variant="success">Low Priority</Badge>;
      case 'medium': return <Badge variant="warning">Medium Priority</Badge>;
      case 'high': return <Badge variant="destructive">High Priority</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (feature.status) {
      case 'pending': 
        return <Badge variant="secondary" className="gap-1"><Circle className="w-3 h-3" /> Pending</Badge>;
      case 'in_progress': 
        return <Badge variant="info" className="gap-1"><Activity className="w-3 h-3" /> In Progress</Badge>;
      case 'completed': 
        return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
    }
  };
  
  // Calculate progress based on status
  const getProgress = () => {
    switch (feature.status) {
      case 'pending': return 0;
      case 'in_progress': return 50;
      case 'completed': return 100;
    }
  };
  
  // Get progress bar color based on status
  const getProgressColor = () => {
    switch (feature.status) {
      case 'pending': return 'bg-gray-400';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
    }
  };

  // Get the category icon based on feature title
  const getCategoryIcon = () => {
    const title = feature.title.toLowerCase();
    
    if (title.includes('wallet') || title.includes('trading') || title.includes('transaction') || title.includes('market')) {
      return <Zap className="w-3 h-3 text-blue-400" />;
    } else if (title.includes('smart contract') || title.includes('2fa') || title.includes('security') || title.includes('kyc') || title.includes('ddos')) {
      return <Shield className="w-3 h-3 text-purple-400" />;
    } else if (title.includes('staking') || title.includes('token') || title.includes('interest') || title.includes('compound')) {
      return <Coins className="w-3 h-3 text-amber-400" />;
    } else if (title.includes('referral') || title.includes('community') || title.includes('social') || title.includes('engagement') || title.includes('education')) {
      return <Users className="w-3 h-3 text-green-400" />;
    }
    
    return null;
  };

  const categoryIcon = getCategoryIcon();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className={cn(
          "bg-black/20 border border-siso-text/10 hover:bg-black/30 transition-all duration-300",
          "p-5 h-full flex flex-col",
          "relative overflow-hidden backdrop-blur-sm shadow-lg"
        )}
      >
        {/* Token badge with glow effect */}
        <div className="absolute top-3 right-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 px-3 py-1.5 rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(123,97,255,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs font-bold text-indigo-300">
                    {feature.token_amount?.toLocaleString() || '50,000,000'} {feature.token_symbol || 'UBC'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Token allocation for this feature</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-between items-start mb-3 mt-8 relative">
          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="mb-4">
          <Progress 
            value={getProgress()} 
            className="h-1.5 bg-black/40" 
            indicatorClassName={`${getProgressColor()} transition-all duration-1000`} 
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categoryIcon && (
            <Badge variant="outline" className="gap-1 bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors">
              {categoryIcon} 
              {feature.title.toLowerCase().includes('wallet') || feature.title.toLowerCase().includes('trading') ? "Trading & Transactions" : 
               feature.title.toLowerCase().includes('smart contract') || feature.title.toLowerCase().includes('2fa') ? "Security & Trust" :
               feature.title.toLowerCase().includes('staking') || feature.title.toLowerCase().includes('token') ? "Staking & Earning" :
               "Community & Engagement"}
            </Badge>
          )}
          {getDifficultyBadge()}
          {getPriorityBadge()}
        </div>
        
        {/* Time estimates row */}
        <div className="flex justify-between items-center mb-4 bg-black/20 p-2 rounded-md border border-siso-text/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">
              {feature.time_estimate_days || 14} days
            </span>
          </div>
          {feature.timeline_week && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400">
                Week {feature.timeline_week}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow bg-gradient-to-b from-gray-400 to-gray-500 bg-clip-text text-transparent font-medium">
          {feature.description || 'No description provided'}
        </p>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-siso-text/10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">ESTIMATED COST</span>
            <span className="text-blue-400 font-medium">£{feature.estimated_cost.toLocaleString()}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(feature)}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-800/50 hover:to-indigo-800/50 transition-all"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
