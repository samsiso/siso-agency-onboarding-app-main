import React from 'react';
import { cn } from '@/lib/utils';
import { CycleStep, CycleStatus, CYCLE_STEP_ORDER, CYCLE_STEP_LABELS } from '@/types/auto-prompts';
import { CheckCircle, Circle, ArrowDown } from 'lucide-react';

interface CycleStepperProps {
  currentStep: CycleStep;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  onStepClick?: (step: CycleStep) => void;
  className?: string;
}

export const CycleStepper: React.FC<CycleStepperProps> = ({
  currentStep,
  cycleNumber,
  cycleStatus,
  onStepClick,
  className
}) => {
  const getCurrentStepIndex = () => CYCLE_STEP_ORDER.indexOf(currentStep);

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {CYCLE_STEP_ORDER.map((step, index) => {
        const isCompleted = index < getCurrentStepIndex();
        const isCurrent = step === currentStep;
        
        return (
          <div key={step} className="flex flex-col">
            <div 
              className={cn(
                "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                (isCompleted || isCurrent) && "text-primary",
                isCurrent && "bg-primary/10",
                onStepClick && "cursor-pointer hover:bg-muted"
              )}
              onClick={() => onStepClick?.(step)}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-primary" />
                ) : isCurrent ? (
                  <Circle className="w-6 h-6 text-primary fill-primary/20" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <span className={cn(
                "font-medium",
                isCompleted && "text-primary",
                isCurrent && "text-primary font-semibold",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}>
                {CYCLE_STEP_LABELS[step]}
              </span>
            </div>
            {index < CYCLE_STEP_ORDER.length - 1 && (
              <div className="ml-[15px] h-4 w-px bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}; 