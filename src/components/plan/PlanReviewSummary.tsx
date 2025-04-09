
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  Users, 
  MessageSquare,
  FileText,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanReviewSummaryProps {
  selectedFeatures: string[];
  timeline: number;
  totalCost: number;
  onApprove: () => void;
  isSubmitting: boolean;
}

export const PlanReviewSummary = ({
  selectedFeatures,
  timeline,
  totalCost,
  onApprove,
  isSubmitting
}: PlanReviewSummaryProps) => {
  const featureIcons: Record<string, React.ReactNode> = {
    'Client Management': <Users className="h-5 w-5 text-siso-orange" />,
    'Content Management': <FileText className="h-5 w-5 text-siso-orange" />,
    'Communication Tools': <MessageSquare className="h-5 w-5 text-siso-orange" />,
    'Analytics & Financials': <BarChart className="h-5 w-5 text-siso-orange" />
  };
  
  return (
    <div className="bg-black/20 border border-siso-orange/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-siso-orange" />
        Plan Summary
      </h3>
      
      <div className="space-y-6 mb-6">
        <div>
          <h4 className="text-white font-medium mb-2">Selected Features</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 bg-black/30 p-3 rounded-lg border border-siso-text/10"
              >
                {featureIcons[feature] || <CheckCircle className="h-5 w-5 text-siso-orange" />}
                <span className="text-siso-text">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-black/30 p-3 rounded-lg border border-siso-text/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-siso-orange" />
              <h4 className="text-white font-medium">Timeline</h4>
            </div>
            <p className="text-siso-text">{timeline} days to launch</p>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-siso-text/10">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-5 w-5 text-siso-orange" />
              <h4 className="text-white font-medium">Investment</h4>
            </div>
            <p className="text-siso-text">£{totalCost}</p>
          </div>
        </div>
        
        <div className="bg-siso-orange/10 border border-siso-orange/20 rounded-lg p-4">
          <h4 className="text-white font-medium flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-siso-orange" />
            Next Steps After Approval
          </h4>
          <ol className="space-y-2 text-sm text-siso-text">
            <li className="flex items-start gap-2">
              <span className="bg-siso-orange/20 text-siso-orange rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Kickoff meeting with your dedicated project manager</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-siso-orange/20 text-siso-orange rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Detailed requirements gathering and design approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-siso-orange/20 text-siso-orange rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Development begins with weekly progress updates</span>
            </li>
          </ol>
        </div>
      </div>
      
      <Button
        onClick={onApprove}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
      >
        {isSubmitting ? 'Processing...' : 'Approve Plan & Begin Onboarding'}
      </Button>
    </div>
  );
};
