
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface SkillLevel {
  label: string;
  color: string;
}

interface SkillLevelFiltersProps {
  selectedSkillLevel: string | null;
  onSkillLevelChange: (level: string | null) => void;
}

export const skillLevels: SkillLevel[] = [
  { label: 'Beginner', color: '#FF5722' },
  { label: 'Intermediate', color: '#FF7043' },
  { label: 'Advanced', color: '#FFA726' }
];

export const SkillLevelFilters = ({ 
  selectedSkillLevel, 
  onSkillLevelChange 
}: SkillLevelFiltersProps) => {
  return (
    <motion.div 
      className="flex justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {skillLevels.map((level) => (
        <Button
          key={level.label}
          variant="outline"
          size="sm"
          className={`rounded-full border-2 transition-all duration-300 ${
            selectedSkillLevel === level.label
              ? 'bg-white/10'
              : 'bg-transparent hover:bg-white/5'
          }`}
          style={{
            borderColor: selectedSkillLevel === level.label ? level.color : 'transparent',
            color: selectedSkillLevel === level.label ? level.color : 'inherit'
          }}
          onClick={() => onSkillLevelChange(level.label === selectedSkillLevel ? null : level.label)}
        >
          {level.label}
        </Button>
      ))}
    </motion.div>
  );
};
