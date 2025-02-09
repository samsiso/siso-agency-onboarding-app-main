
import { motion } from 'framer-motion';

interface EducatorCardSpecializationsProps {
  specializations?: string[];
}

export const EducatorCardSpecializations = ({ specializations }: EducatorCardSpecializationsProps) => {
  if (!specializations?.length) return null;

  return (
    <div className="space-y-1 overflow-hidden">
      <div className="flex flex-wrap gap-2">
        {specializations.map((spec, index) => (
          <motion.span
            key={index}
            className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-siso-text/90 border border-siso-border/50 group-hover:border-siso-orange/30 transition-colors whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
          >
            {spec}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

