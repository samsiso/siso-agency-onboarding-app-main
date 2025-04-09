
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface WelcomeLoaderProps {
  progress: number;
  complete: boolean;
  steps: string[];
  onContinue: () => void;
}

export const WelcomeLoader = ({ 
  progress, 
  complete, 
  steps,
  onContinue
}: WelcomeLoaderProps) => {
  return (
    <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
      <div className="text-center mb-6">
        <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-1">
          Preparing Your Custom Plan
        </h2>
        <p className="text-siso-text text-sm">
          We're finalizing your custom OnlyFans Management Suite
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-siso-text">Loading your plan</span>
          <span className="text-sm text-siso-orange">
            {complete ? 'Ready!' : `${progress}%`}
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-black/30" 
          indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
        />
      </div>
      
      <div className="space-y-3 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              progress >= (index + 1) * 33 ? 'bg-siso-orange/20' : 'bg-siso-text/5'
            }`}>
              {progress >= (index + 1) * 33 ? (
                <CheckCircle className="h-4 w-4 text-siso-orange" />
              ) : progress >= index * 33 ? (
                <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
              ) : (
                <div className="h-4 w-4 rounded-full bg-siso-text/20" />
              )}
            </div>
            <p className={`text-sm ${
              progress >= (index + 1) * 33 ? 'text-siso-text' : 'text-siso-text/50'
            }`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      
      {complete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
          >
            View Your Personalized Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
