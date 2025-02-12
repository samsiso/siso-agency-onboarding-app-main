
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThinkingDots } from './ThinkingDots';

interface ProcessingNodeProps {
  icon: typeof Bot;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  size?: 'sm' | 'default';
  thoughts?: string[];
}

export const ProcessingNode = ({ icon: Icon, label, isActive, isComplete, size = 'default', thoughts }: ProcessingNodeProps) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    if (isActive && thoughts) {
      const interval = setInterval(() => {
        setThoughtIndex((prev) => (prev + 1) % thoughts.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, thoughts]);

  return (
    <div className={cn(
      "relative flex items-start",
      size === 'sm' ? 'gap-3' : 'gap-4'
    )}>
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.1 : 1,
          backgroundColor: isComplete ? 'rgb(var(--siso-orange))' : isActive ? 'rgb(var(--siso-red))' : 'rgb(var(--siso-text) / 0.1)',
        }}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-siso-text/10 z-10 transition-shadow duration-500",
          size === 'sm' ? 'w-8 h-8' : 'w-12 h-12',
          isActive && "shadow-lg shadow-siso-orange/20",
          isComplete && "shadow-md shadow-siso-orange/10"
        )}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-siso-red/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        <Icon className={cn(
          "text-white relative z-10",
          size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
        )} />
      </motion.div>
      
      <div className="flex-1 space-y-1">
        <span className={cn(
          "font-medium relative block",
          size === 'sm' ? 'text-sm' : 'text-base',
          isActive ? 'text-white' : 'text-siso-text/70',
          isComplete && 'text-siso-orange'
        )}>
          {label}
          {isActive && (
            <motion.div
              className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-siso-orange to-siso-red"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </span>

        {isActive && thoughts && (
          <motion.div 
            className="text-xs text-siso-text/70"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2">
              {thoughts[thoughtIndex]}
              <ThinkingDots />
            </span>
          </motion.div>
        )}
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-2 bg-siso-text/5 backdrop-blur-sm rounded-lg -z-10"
        />
      )}
    </div>
  );
};
