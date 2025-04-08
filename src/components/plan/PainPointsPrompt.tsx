
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PainPointsPromptProps {
  onComplete: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

interface PainPoint {
  text: string;
  solution: string;
  icon: React.ReactNode;
  buttonText: string;
}

export const PainPointsPrompt = ({ 
  onComplete, 
  autoAdvance = false,
  autoAdvanceDelay = 1500 
}: PainPointsPromptProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const painPoints: PainPoint[] = [
    {
      text: "Struggling with creator churn?",
      solution: "Boost retention by 60% with our tools.",
      icon: <Users className="h-12 w-12 text-siso-orange" />,
      buttonText: "Next"
    },
    {
      text: "Disorganized content?",
      solution: "Save 15+ hours weekly with streamlined workflows.",
      icon: <Calendar className="h-12 w-12 text-siso-orange" />,
      buttonText: "Next"
    },
    {
      text: "Communication delays?",
      solution: "Centralize all messages and cut delays by 50%.",
      icon: <MessageSquare className="h-12 w-12 text-siso-orange" />,
      buttonText: "See the Value"
    }
  ];
  
  // Auto advance through screens if enabled
  useEffect(() => {
    if (!autoAdvance) return;
    
    const timer = setTimeout(() => {
      if (currentStep < painPoints.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete();
      }
    }, autoAdvanceDelay);
    
    return () => clearTimeout(timer);
  }, [currentStep, autoAdvance, autoAdvanceDelay, painPoints.length, onComplete]);
  
  const handleNext = () => {
    if (currentStep < painPoints.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const currentPoint = painPoints[currentStep];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-xl w-full bg-black/40 border border-siso-orange/20 rounded-lg p-8 backdrop-blur-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              className="p-4 bg-siso-orange/10 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              {currentPoint.icon}
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentPoint.text}
          </h2>
          <p className="text-lg text-siso-text mb-8">
            {currentPoint.solution}
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white min-w-[120px]"
            >
              {currentPoint.buttonText}
              {currentStep < painPoints.length - 1 && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            {painPoints.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  index === currentStep ? 'bg-siso-orange' : 'bg-siso-text/20'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
