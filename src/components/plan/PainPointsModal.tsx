
import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, ExternalLink, TrendingUp, ArrowRight } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface PainPointDetailProps {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: Array<{label: string; value: string; icon?: React.ReactNode}>;
  images?: Array<{url: string; caption: string}>;
  caseStudyLink?: string;
}

interface PainPointModalProps {
  painPoint: PainPointDetailProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PainPointsModal = ({ painPoint, open, onOpenChange }: PainPointModalProps) => {
  if (!painPoint) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto bg-black/80 border border-siso-orange/20 backdrop-blur-md text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-siso-orange">Problem:</span> {painPoint.problem}
          </DialogTitle>
          <DialogDescription className="text-siso-text mt-1">
            <span className="font-semibold text-white">{painPoint.statistic}</span>
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="mt-2 space-y-6">
          {/* Solution section */}
          <div className="bg-siso-orange/10 rounded-lg p-4 border border-siso-orange/20">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <span className="text-siso-orange">Solution:</span> {painPoint.solution}
            </h3>
            <p className="text-siso-text leading-relaxed">{painPoint.detailedSolution}</p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-white">Key Benefits:</h3>
            <ul className="space-y-2">
              {painPoint.benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="h-5 w-5 text-siso-orange mt-0.5 shrink-0" />
                  <span className="text-siso-text">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Key metrics */}
          <div>
            <h3 className="text-md font-semibold text-white mb-3">Impact Metrics:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {painPoint.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 border border-siso-orange/10 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon || <TrendingUp className="h-4 w-4 text-siso-orange" />}
                    <span className="text-siso-text text-sm">{metric.label}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{metric.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Images if available */}
          {painPoint.images && painPoint.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-white">Visual Examples:</h3>
              <div className="grid grid-cols-1 gap-4">
                {painPoint.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden bg-black/30 border border-siso-text/10">
                    <img src={image.url} alt={image.caption} className="w-full object-cover" />
                    <p className="p-2 text-sm text-siso-text">{image.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Case study link if available */}
          {painPoint.caseStudyLink && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full border-siso-orange/30 bg-black/50 text-siso-orange transition-all hover:bg-siso-orange/10"
                onClick={() => window.open(painPoint.caseStudyLink, '_blank')}
              >
                View Related Case Study
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
