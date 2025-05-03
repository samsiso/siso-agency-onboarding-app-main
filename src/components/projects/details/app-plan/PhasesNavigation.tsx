
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PhaseData } from './types';

interface PhasesNavigationProps {
  phases: PhaseData[];
  activePhaseId: string;
  setActivePhaseId: (id: string) => void;
}

export function PhasesNavigation({ phases, activePhaseId, setActivePhaseId }: PhasesNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-4 z-10 mb-4"
    >
      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-4">
        <div className="flex flex-wrap gap-2">
          {phases.map(phase => (
            <Button 
              key={phase.id}
              variant={activePhaseId === phase.id ? "default" : "outline"}
              className={activePhaseId === phase.id 
                ? "bg-[#FF5722] hover:bg-[#E64A19] text-white border-transparent" 
                : "bg-transparent border-white/10 text-white hover:bg-white/5"
              }
              onClick={() => setActivePhaseId(phase.id)}
            >
              {phase.title}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
