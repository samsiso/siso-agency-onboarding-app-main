
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, ArrowRight, Quote, Users, BarChart } from 'lucide-react';
import { PainPoint } from './AgencyPainPoints';

interface AgencyPainPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  painPoint: PainPoint | null;
  onRequestSolution?: () => void;
}

export const AgencyPainPointModal = ({ 
  isOpen, 
  onClose, 
  painPoint,
  onRequestSolution
}: AgencyPainPointModalProps) => {
  if (!painPoint) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-black/90 border-siso-orange/20 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-full ${
              painPoint.severity === 'high' ? 'bg-red-500/10' : 
              painPoint.severity === 'medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
            }`}>
              {painPoint.icon}
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {painPoint.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="bg-siso-orange/10 text-siso-orange text-xs font-medium px-3 py-1.5 rounded mb-4 inline-block">
          {painPoint.statistic}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">The Challenge</h3>
            <p className="text-siso-text">{painPoint.description}</p>
            
            <div className="mt-4 bg-black/30 rounded-lg p-4 border border-siso-text/10">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <BarChart className="h-4 w-4 text-siso-orange" />
                From Our Agency Survey
              </h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-siso-text">{painPoint.surveyData.label}</span>
                <span className="text-siso-orange font-semibold">{painPoint.surveyData.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-siso-text/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-siso-red to-siso-orange rounded-full"
                  style={{ width: `${painPoint.surveyData.percentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Impact Areas</h3>
            <div className="grid grid-cols-2 gap-2">
              {painPoint.impactAreas.map((area, index) => (
                <div key={index} className="bg-black/30 p-2 rounded border border-siso-text/10">
                  <p className="text-sm text-siso-text">{area}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Our Solution Approach</h3>
            <ul className="space-y-2">
              {painPoint.solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                  <span className="text-siso-text">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {painPoint.testimonial && (
            <div className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg p-4 border border-siso-orange/20">
              <div className="flex items-center gap-2 mb-2">
                <Quote className="h-5 w-5 text-siso-orange" />
                <h4 className="text-white font-medium">Agency Success Story</h4>
              </div>
              <p className="text-siso-text italic mb-2">"{painPoint.testimonial.quote}"</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-siso-orange/20 flex items-center justify-center">
                  <Users className="h-3 w-3 text-siso-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{painPoint.testimonial.author}</p>
                  <p className="text-xs text-siso-text/70">{painPoint.testimonial.position}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
          <Button
            variant="outline"
            className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
            onClick={() => window.open("https://notion.so/agency-report", '_blank')}
          >
            Read Full Agency Report
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            onClick={onRequestSolution}
          >
            See Our Solution
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
