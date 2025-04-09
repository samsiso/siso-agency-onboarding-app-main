
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, CheckCircle, ExternalLink, Users, MessageSquare, Calendar, DollarSign, Clock } from 'lucide-react';

export interface PainPointDetailProps {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: { label: string; value: string; icon: JSX.Element }[];
  images: { url: string; caption: string }[];
  caseStudyLink: string;
}

interface PainPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  painPoint: PainPointDetailProps | null;
}

export const PainPointsModal = ({ open, onOpenChange, painPoint }: PainPointModalProps) => {
  if (!painPoint) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-black/90 border-siso-orange/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {painPoint.problem}
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-siso-orange/10 text-siso-orange text-xs font-medium px-3 py-1.5 rounded mb-4 inline-block">
          {painPoint.statistic}
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-siso-orange" />
              The Solution
            </h3>
            <p className="text-siso-text">{painPoint.detailedSolution}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-siso-orange" />
                Key Benefits
              </h4>
              <ul className="space-y-2">
                {painPoint.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-siso-orange shrink-0 mt-0.5" />
                    <span className="text-sm text-siso-text">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-siso-orange" />
                Impact Metrics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {painPoint.metrics.map((metric, index) => (
                  <div key={index} className="bg-black/30 rounded p-2 border border-siso-text/10">
                    <div className="flex items-center gap-1 text-xs text-siso-text mb-1">
                      {metric.icon}
                      <span>{metric.label}</span>
                    </div>
                    <div className="text-lg font-bold text-siso-orange">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {painPoint.images.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-2">Visual Solution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {painPoint.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="relative overflow-hidden rounded-lg border border-siso-text/10"
                  >
                    <img 
                      src={image.url} 
                      alt={image.caption} 
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-xs text-siso-text">{image.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between mt-6">
          <Button
            variant="outline"
            className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
            onClick={() => window.open(painPoint.caseStudyLink, '_blank')}
          >
            View Full Case Study
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            onClick={() => onOpenChange(false)}
          >
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
