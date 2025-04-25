
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, Tag, Activity, CheckCircle, Circle, ArrowRight } from 'lucide-react';
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className={cn(
          "bg-black/20 border border-siso-text/10 hover:bg-black/30 transition-colors duration-300",
          "p-5 h-full flex flex-col"
        )}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
          {getStatusBadge()}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {getDifficultyBadge()}
          {getPriorityBadge()}
          {feature.timeline_week && (
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              Week {feature.timeline_week}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
          {feature.description || 'No description provided'}
        </p>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-siso-text/10">
          <span className="text-blue-400 font-medium">£{feature.estimated_cost.toLocaleString()}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(feature)}
            className="flex items-center gap-1"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
