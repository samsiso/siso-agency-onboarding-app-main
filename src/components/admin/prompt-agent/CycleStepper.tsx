import React from 'react';
import { CycleStep, CycleStatus, CYCLE_STEP_LABELS, CYCLE_STEP_ORDER } from '@/types/auto-prompts';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleStepperProps {
  currentStep: CycleStep;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  className?: string;
}

export function CycleStepper({ 
  currentStep, 
  cycleNumber, 
  cycleStatus, 
  className 
}: CycleStepperProps) {
  // Display a subset of steps from the full cycle for simplicity
  const displaySteps = [
    CycleStep.Review,
    CycleStep.Analysis,
    CycleStep.Innovation,
    CycleStep.Planning,
    CycleStep.Execution1
  ];

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {displaySteps.map((step, index) => {
        // Determine if this step is completed, current, or upcoming
        const isCompleted = (
          cycleStatus === CycleStatus.Completed || 
          CYCLE_STEP_ORDER.indexOf(step) < CYCLE_STEP_ORDER.indexOf(currentStep)
        );
        const isCurrent = step === currentStep;
        
        // Determine colors based on state
        const bgColor = isCompleted 
          ? 'bg-green-500' 
          : isCurrent 
            ? 'bg-blue-500' 
            : 'bg-gray-700';
        
        const textColor = isCompleted 
          ? 'text-green-500' 
          : isCurrent 
            ? 'text-blue-500' 
            : 'text-gray-500';
            
        return (
          <React.Fragment key={step}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  bgColor,
                  "text-white text-xs font-medium"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn("text-xs mt-1 truncate", textColor)}>
                {CYCLE_STEP_LABELS[step]}
              </span>
            </div>
            
            {/* Connector (except after the last step) */}
            {index < displaySteps.length - 1 && (
              <div className={cn(
                "w-4 h-0.5", 
                isCompleted ? "bg-green-500" : "bg-gray-700"
              )}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
} 