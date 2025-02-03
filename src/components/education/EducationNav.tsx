import { motion } from 'framer-motion';
import { Video, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationNavProps {
  activeSection: 'videos' | 'educators';
  onSectionChange: (section: 'videos' | 'educators') => void;
}

export const EducationNav = ({ activeSection, onSectionChange }: EducationNavProps) => {
  return (
    <div className="flex items-center gap-4 mb-8 bg-black/20 p-2 rounded-lg backdrop-blur-sm">
      <button
        onClick={() => onSectionChange('videos')}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          activeSection === 'videos' 
            ? "text-siso-text-bold" 
            : "text-siso-text/70 hover:text-siso-text-bold"
        )}
      >
        <Video className="w-5 h-5" />
        <span>Video Library</span>
        {activeSection === 'videos' && (
          <motion.div
            layoutId="nav-highlight"
            className="absolute inset-0 bg-siso-text/10 rounded-md -z-10"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </button>

      <button
        onClick={() => onSectionChange('educators')}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          activeSection === 'educators' 
            ? "text-siso-text-bold" 
            : "text-siso-text/70 hover:text-siso-text-bold"
        )}
      >
        <Users className="w-5 h-5" />
        <span>Educators Directory</span>
        {activeSection === 'educators' && (
          <motion.div
            layoutId="nav-highlight"
            className="absolute inset-0 bg-siso-text/10 rounded-md -z-10"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </button>
    </div>
  );
};